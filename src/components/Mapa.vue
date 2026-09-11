<template>
  <div class="map-container-wrapper">
    <div ref="mapContainer" class="map-container"></div>

    <!-- Botón de Hamburguesa -->
    <button class="hamburger-button" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </button>

    <!-- Contenedor del Menú de Controles del Mapa -->
    <div class="map-controls-menu" :class="{ 'is-open': isMenuOpen }">
      <!-- NUEVO: Título para Estilos del Mapa -->
      <h4>Estilos del Mapa</h4>
      <div class="style-switcher">
        <button @click="setMapStyle('default')" :class="{ active: currentStyle === 'default' }">
          Normal
        </button>
        <button @click="setMapStyle('satellite')" :class="{ active: currentStyle === 'satellite' }">
          Satélite
        </button>
        <button @click="toggleTrafficLayer()" :class="{ active: trafficEnabled }">
          Tráfico
        </button>
      </div>

      <hr>

      <h4>Filtrar Clientes por Tipo</h4>
      <div class="client-type-filter-buttons">
        <button
          @click="setClientTypeFilter('all')"
          :class="{ active: selectedClientType === 'all' }"
        >
          Todos
        </button>
        <button
          @click="setClientTypeFilter('chalet')"
          :class="{ active: selectedClientType === 'chalet', 'filter-chalet': true }"
        >
          Chalet
        </button>
        <button
          @click="setClientTypeFilter('piso')"
          :class="{ active: selectedClientType === 'piso', 'filter-piso': true }"
        >
          Piso
        </button>
        <button
          @click="setClientTypeFilter('empresa')"
          :class="{ active: selectedClientType === 'empresa', 'filter-empresa': true }"
        >
          Empresa
        </button>
      </div>
    </div>

    <!-- Contenedor para mostrar la información de la ruta -->
    <div v-if="routeDuration || routeDistance" class="route-info-display">
      <p v-if="routeDuration">Duración: {{ routeDuration }}</p>
      <p v-if="routeDistance">Distancia: {{ routeDistance }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxSdk from "@mapbox/mapbox-sdk/services/geocoding";
import { useDatabaseStore } from "../stores/database";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const databaseStore = useDatabaseStore();
const MADRID_CENTER: [number, number] = [-3.7267915, 40.3100345];

// Referencias para el mapa y sus estados
const mapContainer = ref<HTMLElement>();
let map: mapboxgl.Map | null = null;
const defaultMapStyle = 'mapbox://styles/higuerodiego/clolwjys2009k01qm73bf7jct';
const satelliteMapStyle = 'mapbox://styles/mapbox/satellite-streets-v12';
const currentStyle = ref('default');

// Referencias para información de ruta
const routeDuration = ref<string | null>(null);
const routeDistance = ref<string | null>(null);
const trafficEnabled = ref(false);

const allClientsProcessedData = ref<any[]>([]); // Coordenadas ya geocodificadas de cada cliente
const activeMarkers = ref<mapboxgl.Marker[]>([]); // Instancias de los marcadores actualmente en el mapa
const isMenuOpen = ref(false);
const selectedClientType = ref('all'); // 'all', 'chalet', 'piso', 'empresa'

// Función para alternar el menú
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const setClientTypeFilter = (type: string) => {
  selectedClientType.value = type;
  renderMarkers();
};

// --- FUNCIONES DE UTILIDAD PARA RUTAS ---

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${remainingMinutes} min`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

async function getCurrentUserLocation(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error al obtener la ubicación del usuario:", error);
          let errorMessage = "Ha ocurrido un error desconocido al obtener la ubicación.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permiso de ubicación denegado. Por favor, actívalo en la configuración de tu navegador.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "La información de ubicación no está disponible.";
              break;
            case error.TIMEOUT:
              errorMessage = "La solicitud para obtener la ubicación ha caducado.";
              break;
          }
          alert(errorMessage);
          resolve(null);
        }
      );
    } else {
      alert("Tu navegador no soporta la geolocalización.");
      resolve(null);
    }
  });
}

async function getMapboxRoute(origin: [number, number], destination: [number, number]): Promise<{ geojson: any; duration: number; number } | null> {
  try {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?steps=false&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    if (json.routes && json.routes.length > 0) {
      const route = json.routes[0];
      return {
        geojson: route.geometry,
        duration: route.duration,
        distance: route.distance
      };
    }
    return null;
  } catch (error) {
    console.error("Error al obtener la ruta de Mapbox:", error);
    return null;
  }
}

function drawRoute(routeGeoJSON: any) {
  if (!map) return;

  const sourceId = 'route';
  const layerId = 'route-line';

  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data: routeGeoJSON
  });

  map.addLayer({
    id: layerId,
    type: 'line',
    source: sourceId,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#007bff',
      'line-width': 6,
      'line-opacity': 0.75
    }
  });

  if (routeGeoJSON.geometry && routeGeoJSON.geometry.coordinates) {
    const bounds = new mapboxgl.LngLatBounds();
    for (const coord of routeGeoJSON.geometry.coordinates) {
      bounds.extend(coord as mapboxgl.LngLatLike);
    }
    map.fitBounds(bounds, { padding: 50, duration: 1000 });
  }
}

// Funciones globales para acceder desde el HTML del popup
(window as any).drawClientRouteOnMap = async (clientLat: number, clientLng: number) => {
  routeDuration.value = null;
  routeDistance.value = null;

  const userCoords = await getCurrentUserLocation();

  if (!userCoords) {
    console.warn("No se pudo obtener la ubicación del usuario.");
    return;
  }

  const origin: [number, number] = [userCoords.lon, userCoords.lat];
  const destination: [number, number] = [clientLng, clientLat];

  const routeData = await getMapboxRoute(origin, destination);

  if (routeData) {
    drawRoute(routeData.geojson);
    routeDuration.value = formatDuration(routeData.duration);
    routeDistance.value = formatDistance(routeData.distance);
  } else {
    if (map && map.getLayer('route-line')) {
        map.removeLayer('route-line');
    }
    if (map && map.getSource('route')) {
        map.removeSource('route');
    }
    alert("No se pudo calcular la ruta en el mapa.");
  }
};

(window as any).startWazeNavigation = async (clientLat: number, clientLng: number) => {
  const wazeUrl = `https://waze.com/ul?ll=${clientLat},${clientLng}&navigate=yes`;
  window.open(wazeUrl, "_blank");

  console.log("Waze abierto para navegación.");
};

// --- FUNCIONES DE ESTILO DEL MAPA ---

const setMapStyle = (styleName: string) => {
  if (map) {
    if (styleName === 'default') {
      map.setStyle(defaultMapStyle);
      currentStyle.value = 'default';
    } else if (styleName === 'satellite') {
      map.setStyle(satelliteMapStyle);
      currentStyle.value = 'satellite';
    }
  }
};

const toggleTrafficLayer = () => {
  if (!map) return;

  const trafficSourceId = 'mapbox-traffic';
  const trafficLayerId = 'mapbox-traffic-layer';

  // Si la fuente y la capa de tráfico no existen, las añadimos
  if (!map.getSource(trafficSourceId)) {
    map.addSource(trafficSourceId, {
      type: 'vector',
      url: 'mapbox://mapbox.mapbox-traffic-v1' // Fuente de datos de tráfico de Mapbox
    });

    map.addLayer(
      {
        'id': trafficLayerId,
        'type': 'line',
        'source': trafficSourceId,
        'source-layer': 'traffic', // La capa dentro de la fuente de vectores
        'layout': {
          'line-cap': 'round',
          'line-join': 'round'
        },
        'paint': {
          'line-color': [
            'case',
            ['==', ['get', 'traffic_level'], 'low'], '#82C782',      // Verde claro
            ['==', ['get', 'traffic_level'], 'moderate'], '#F5E663', // Amarillo
            ['==', ['get', 'traffic_level'], 'heavy'], '#F29C35',    // Naranja
            ['==', ['get', 'traffic_level'], 'severe'], '#D9534F',    // Rojo
            '#A9A9A9' // Gris más oscuro si no hay match
          ],
          'line-width': 3
        },
        'filter': ['==', '$type', 'LineString'] // Asegura que solo se dibujen líneas
      },
      'road-label' // Inserta la capa de tráfico debajo de las etiquetas de las carreteras
    );
  }

  // Ahora, alternamos la visibilidad de la capa
  const currentVisibility = map.getLayoutProperty(trafficLayerId, 'visibility');
  const newVisibility = currentVisibility === 'visible' ? 'none' : 'visible';
  map.setLayoutProperty(trafficLayerId, 'visibility', newVisibility);

  // Actualiza la variable reactiva para el estado del botón
  trafficEnabled.value = newVisibility === 'visible';
};

// --- RENDERIZADO DE MARCADORES ---

const MARKER_COLORS: Record<string, string> = {
  empresa: '#4970B6',   // Azul para empresas
  piso: 'orange',       // Naranja para pisos
  chalet: 'pink',       // Rosa para chalets
};
const DEFAULT_MARKER_COLOR = 'gray'; // Sin categoría asignada

const TYPE_LABELS: Record<string, string> = {
  empresa: 'Empresa',
  piso: 'Piso',
  chalet: 'Chalet',
};

// Normaliza la categoría: acepta tanto el valor interno ('chalet') como si
// alguien escribió directamente en la hoja el nombre visible ('Chalet'),
// sin distinguir mayúsculas/acentos/espacios.
function normalizeTipoCliente(raw: string): string {
  const v = (raw || '').trim().toLowerCase();
  if (v === 'chalet') return 'chalet';
  if (v === 'piso') return 'piso';
  if (v === 'empresa') return 'empresa';
  return '';
}

const renderMarkers = () => {
  if (!map) return;

  activeMarkers.value.forEach(marker => marker.remove());
  activeMarkers.value = [];

  allClientsProcessedData.value.forEach(({ coordinates, clientData }) => {
    const clientType = normalizeTipoCliente(clientData.tipoCliente);
    const shouldDisplay = selectedClientType.value === 'all' || clientType === selectedClientType.value;
    if (!shouldDisplay) return;

    const markerColor = MARKER_COLORS[clientType] || DEFAULT_MARKER_COLOR;
    const clientLng = coordinates[0];
    const clientLat = coordinates[1];
    const contacto = [clientData.telefono, clientData.email].filter(Boolean).join(' · ');

    const marker = new mapboxgl.Marker({ color: markerColor })
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h5 class="p-2 text-center fw-bold">${clientData.nombre}</h5>
            <p class="text-center">${clientData.direccion || ''}</p>
            ${contacto ? `<p class="text-center">${contacto}</p>` : ''}
            <p class="text-center">Tipo: <b>${TYPE_LABELS[clientType] || 'No especificado'}</b></p>
            <div class="popup-buttons-container">
              <button class="btn btn-primary btn-sm" onclick="window.drawClientRouteOnMap(${clientLat}, ${clientLng})">Ver Ruta</button>
              <button class="btn btn-success btn-sm" onclick="window.startWazeNavigation(${clientLat}, ${clientLng})">
                <i class="fa-brands fa-waze"></i> Ir
              </button>
            </div>`
          )
      )
      .addTo(map!);
    activeMarkers.value.push(marker);
  });
};

// --- LIFECYCLE HOOK: onMounted ---

onMounted(() => {
  map = new mapboxgl.Map({
    container: mapContainer.value!,
    style: defaultMapStyle,
    center: [-3.7267915,40.3100345],
    zoom: 10,
  });

  // Añadir controles de geolocalización y búsqueda
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }),
    'top-left'
  );

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  });
  map.addControl(geocoder);

  // Cargar clientes (la misma hoja que usa el resto del panel) y dibujar
  // marcadores una vez que el mapa esté listo.
  map.on("load", async () => {
    try {
      if (!databaseStore.clientes.length) await databaseStore.fetchClientes();
      const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });

      const clientPromises = databaseStore.clientes.map(async (clientData) => {
        if (!clientData.direccion) {
          console.warn(`Cliente ${clientData.nombre} no tiene dirección para geocodificar.`);
          return null;
        }

        try {
          const response = await mapboxClient.forwardGeocode({
              query: clientData.direccion,
              autocomplete: false,
              limit: 1,
              proximity: MADRID_CENTER,
            })
            .send();

          if (
            !response ||
            !response.body ||
            !response.body.features ||
            !response.body.features.length
          ) {
            console.warn(`No se encontraron coordenadas válidas para: ${clientData.nombre} - ${clientData.direccion}`);
            return null;
          }
          const feature = response.body.features[0];
          const coordinates = feature.center as [number, number];

          return { coordinates, clientData };

        } catch (error) {
          console.error(`Error al geocodificar dirección para ${clientData.nombre} (${clientData.direccion}):`, error);
          return null;
        }
      });

      // Una vez que todas las promesas de geocodificación se resuelven,
      // guarda todos los datos procesados en la variable reactiva
      allClientsProcessedData.value = (await Promise.all(clientPromises)).filter(Boolean);

      renderMarkers();

    } catch (error) {
      console.error("Error al obtener clientes o procesar datos:", error);
    }
  });
});
</script>

<style>
/* Estilos para el popup de Mapbox (fuera de scoped para que funcionen) */
.mapboxgl-popup-content {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 16px;
  text-align: center;
  background-color: #0f1729;
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
  color: #f1f5f9;
}

.mapboxgl-popup-tip {
  border-top-color: #0f1729 !important;
}

.mapboxgl-popup-close-button {
  color: #94a3b8;
}
.mapboxgl-popup-close-button:hover {
  color: #f1f5f9;
  background: rgba(255,255,255,0.08);
}

/* Estilos de texto para el popup */
.mapboxgl-popup-content h5 {
  margin-bottom: 5px;
  font-size: 1.05rem;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  color: #f1f5f9;
}
.mapboxgl-popup-content p {
  margin-bottom: 3px;
  line-height: 1.3;
  font-size: 0.85rem;
  color: #94a3b8;
  font-family: 'Raleway', sans-serif;
}
.mapboxgl-popup-content b {
  color: #60a5fa;
}
</style>
<style scoped>
/* Contenedor para los botones dentro del popup */
.popup-buttons-container {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  justify-content: center;
}

/* Ajustes finos para el botón de Waze con Bootstrap y Font Awesome */
.btn.btn-success.btn-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  white-space: nowrap;
}

/* Contenedores principales del mapa */
.map-container-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map-container {
  width: 100%;
  height: 100%;
}

/* Estilos para la información de ruta (permanece visible) */
.route-info-display {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  background-color: rgba(15, 23, 41, 0.92);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 8px 18px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  color: #f1f5f9;
  font-family: 'Raleway', sans-serif;
  font-size: 0.85rem;
  text-align: center;
  pointer-events: none;
  white-space: nowrap;
}

.route-info-display p {
  margin: 0;
  line-height: 1.5;
  color: #94a3b8;
}
.route-info-display p strong,
.route-info-display p b { color: #60a5fa; }

/* --- ESTILOS DEL BOTÓN DE HAMBURGUESA --- */
.hamburger-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  width: 40px;
  height: 40px;
  background-color: rgba(15, 23, 41, 0.92);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  transition: background-color 0.2s, border-color 0.2s;
}

.hamburger-button:hover {
  background-color: rgba(30, 41, 59, 0.97);
  border-color: rgba(96,165,250,0.3);
}

.hamburger-button .bar {
  width: 20px;
  height: 2px;
  background-color: rgba(255,255,255,0.8);
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Animación de la hamburguesa a la 'X' */
.hamburger-button.is-active .bar:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger-button.is-active .bar:nth-child(2) {
  opacity: 0; /* Oculta la barra del medio */
}

.hamburger-button.is-active .bar:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* --- ESTILOS DEL MENÚ DE CONTROLES DEL MAPA (Panel) --- */
.map-controls-menu {
  position: absolute;
  top: 60px;
  right: 10px;
  z-index: 2;
  min-width: 190px;

  background-color: rgba(15, 23, 41, 0.96);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);

  display: flex;
  flex-direction: column;
  gap: 12px;

  opacity: 0;
  visibility: hidden;
  transform: translateX(calc(100% + 10px));
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
  pointer-events: none;
}

.map-controls-menu.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  pointer-events: auto;
}

.map-controls-menu h4 {
  margin: 0 0 4px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #64748b;
  text-align: center;
  width: 100%;
}

.map-controls-menu hr {
  width: 100%;
  border: none;
  border-top: 1px solid rgba(255,255,255,0.07);
  margin: 0;
}

/* --- AJUSTES PARA LOS CONTROLES DENTRO DEL MENÚ --- */

.style-switcher {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.style-switcher button {
  flex: 1;
  padding: 7px 10px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  background-color: rgba(255,255,255,0.05);
  color: #94a3b8;
  cursor: pointer;
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  white-space: nowrap;
}
.style-switcher button:hover:not(.active) {
  background-color: rgba(255,255,255,0.1);
  color: #f1f5f9;
}
.style-switcher button.active {
  background-color: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.client-type-filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.client-type-filter-buttons button {
  flex: 1;
  min-width: 72px;
  padding: 7px 10px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  background-color: rgba(255,255,255,0.05);
  color: #94a3b8;
  cursor: pointer;
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, opacity 0.2s;
}

.client-type-filter-buttons button:hover:not(.active) {
  background-color: rgba(255,255,255,0.1);
  color: #f1f5f9;
}

.client-type-filter-buttons button.active {
  color: #fff;
  font-weight: 700;
}

.client-type-filter-buttons button.active:not(.filter-empresa):not(.filter-chalet):not(.filter-piso) {
  background-color: #2563eb;
  border-color: #2563eb;
}

.client-type-filter-buttons button.filter-empresa {
  border-color: rgba(73,112,182,0.4);
}
.client-type-filter-buttons button.filter-empresa.active {
  background-color: #4970B6;
  border-color: #4970B6;
}

.client-type-filter-buttons button.filter-chalet {
  border-color: rgba(255,105,180,0.4);
}
.client-type-filter-buttons button.filter-chalet.active {
  background-color: #e05c9f;
  border-color: #e05c9f;
}

.client-type-filter-buttons button.filter-piso {
  border-color: rgba(255,165,0,0.4);
}
.client-type-filter-buttons button.filter-piso.active {
  background-color: #d97706;
  border-color: #d97706;
}

/* --- MEDIA QUERY PARA MÓVILES --- */
@media (max-width: 768px) {
  .route-info-display {
    top: 60px;
    font-size: 0.8rem;
  }

  .hamburger-button {
    width: 36px;
    height: 36px;
    top: 10px;
    right: 10px;
    padding: 7px;
  }
  .hamburger-button .bar {
    width: 18px;
    height: 2px;
  }
  .hamburger-button.is-active .bar:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .hamburger-button.is-active .bar:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .map-controls-menu {
    top: 56px;
    right: 10px;
    left: 10px;
    min-width: unset;
  }

  .client-type-filter-buttons button {
    font-size: 0.78rem;
    padding: 6px 8px;
  }
}
</style>
