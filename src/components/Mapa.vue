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

      <!-- NUEVO: Separador -->
      <hr>

      <!-- NUEVO: Título para Filtrar Clientes por Tipo -->
      <h4>Filtrar Clientes por Tipo</h4>
      <!-- INICIO DEL CAMBIO: Botones de filtro -->
      <div class="client-type-filter-buttons">
        <button
          @click="setClientTypeFilter('all')"
          :class="{ active: selectedClientType === 'all' }"
        >
          Todos
        </button>
        <button
          @click="setClientTypeFilter('casa')"
          :class="{ active: selectedClientType === 'casa', 'filter-casa': true }"
        >
          Casa
        </button>
        <button
          @click="setClientTypeFilter('empresa')"
          :class="{ active: selectedClientType === 'empresa', 'filter-empresa': true }"
        >
          Empresa
        </button>
        <button
          @click="setClientTypeFilter('cooperativa')"
          :class="{ active: selectedClientType === 'cooperativa', 'filter-cooperativa': true }"
        >
          Cooperativa
        </button>
      </div>
      <!-- FIN DEL CAMBIO -->
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
import { query, collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Mapbox Access Token
mapboxgl.accessToken ="pk.eyJ1IjoiaGlndWVyb2RpZWdvIiwiYSI6ImNrN3Q2a25yNTBtc2ozaG1yam8zNnRibHUifQ.Zgmrlgnrw54eXySGuI3DIQ";

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

// Referencias para el filtrado de clientes
const selectedClientType = ref('all'); // 'all', 'casa', 'empresa', 'cooperativa'
const allClientsProcessedData = ref<any[]>([]); // Almacena todos los datos de clientes procesados para filtrar
const activeMarkers = ref<mapboxgl.Marker[]>([]); // Almacena las instancias de los marcadores actualmente en el mapa
const isMenuOpen = ref(false);

// Función para alternar el menú
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// NUEVO: Función para establecer el tipo de cliente y filtrar
const setClientTypeFilter = (type: string) => {
  selectedClientType.value = type;
  filterAndRenderMarkers();
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

// --- FUNCIONES DE FILTRADO Y RENDERIZADO DE MARCADORES ---

const filterAndRenderMarkers = () => {
  if (!map) return;

  // 1. Elimina todos los marcadores existentes del mapa
  activeMarkers.value.forEach(marker => marker.remove());
  activeMarkers.value = []; // Limpia el array de marcadores activos

  // 2. Itera sobre todos los datos de clientes procesados
  allClientsProcessedData.value.forEach(({ coordinates, markerColor, clientData }) => {
    const clientType = clientData.tipoCliente;
    // Determina si el marcador debe mostrarse basándose en el filtro
    const shouldDisplay = selectedClientType.value === 'all' || clientType === selectedClientType.value;

    if (shouldDisplay) {
      const clientLng = coordinates[0];
      const clientLat = coordinates[1];

      // Crea y añade el marcador al mapa
      const marker = new mapboxgl.Marker({
        color: markerColor,
      })
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(
              `<h5 class="p-2 text-center fw-bold">${clientData.nombre}</h5>
              <p class="text-center">${clientData.direccion}<p/>
              <p class="text-center">${clientData.codigoPostal || ''} ${clientData.ciudad}<p/>
              <p class="text-center">Tipo: <b>${clientData.tipoCliente || 'No especificado'}</b></p>
              <div class="popup-buttons-container">
                <button class="btn btn-primary btn-sm" onclick="window.drawClientRouteOnMap(${clientLat}, ${clientLng})">Ver Ruta</button>
                <button class="btn btn-success btn-sm" onclick="window.startWazeNavigation(${clientLat}, ${clientLng})">
                  <i class="fa-brands fa-waze"></i> Ir
                </button>
              </div>`
            )
        )
        .addTo(map!);
        activeMarkers.value.push(marker); // Almacena la instancia del marcador
    }
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

  // Cargar datos de clientes y dibujar marcadores una vez que el mapa esté listo
  map.on("load", async () => {
    try {
      const q = query(collection(db, "clientes"));
      const querySnapshot = await getDocs(q);
      const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });

      const clientPromises = querySnapshot.docs.map(async (docFirebase) => {
        const clientData = docFirebase.data();
        let coordinates: [number, number] | null = null;
        let markerColor: string; // Declaramos el tipo como string

        // Lógica para asignar el color del marcador según el tipo de cliente
        switch (clientData.tipoCliente) {
          case 'empresa':
            markerColor = '#4970B6';    // Azul para empresas
            break;
          case 'cooperativa':
            markerColor = 'orange';  // Naranja para cooperativas
            break;
          case 'casa':
            markerColor = 'pink';    // Rosa para casas
            break;
          default:
            markerColor = 'gray';    // Color por defecto si el tipo no está definido o es desconocido
            console.warn(`Tipo de cliente desconocido para ${clientData.nombre}: ${clientData.tipoCliente}. Usando color gris.`);
            break;
        }

        if (!clientData.direccion || !clientData.ciudad) {
          console.warn(`Cliente ${clientData.nombre} (${docFirebase.id}) no tiene dirección o ciudad para geocodificar.`);
          return null;
        }

        try {
          const response = await mapboxClient.forwardGeocode({
              query: `${clientData.direccion}, ${clientData.ciudad}, ${clientData.codigoPostal || ''}`,
              autocomplete: false,
              limit: 1,
            })
            .send();

          if (
            !response ||
            !response.body ||
            !response.body.features ||
            !response.body.features.length
          ) {
            console.warn(`No se encontraron coordenadas válidas para: ${clientData.nombre} - ${clientData.direccion}, ${clientData.ciudad}`);
            return null;
          }
          const feature = response.body.features[0];
          coordinates = feature.center as [number, number];

          // Devolvemos todos los datos necesarios para el filtrado y el renderizado
          return {
            coordinates,
            markerColor,
            clientData // Mantén los datos originales del cliente para el popup y el filtrado
          };

        } catch (error) {
          console.error(`Error al geocodificar dirección para ${clientData.nombre} (${clientData.direccion}, ${clientData.ciudad}):`, error);
          return null;
        }
      });

      // Una vez que todas las promesas de geocodificación se resuelven,
      // guarda todos los datos procesados en la variable reactiva
      allClientsProcessedData.value = (await Promise.all(clientPromises)).filter(Boolean);

      // Renderiza los marcadores iniciales (todos por defecto)
      filterAndRenderMarkers();

    } catch (error) {
      console.error("Error al obtener clientes de Firestore o procesar datos:", error);
    }
  });
});
</script>

<style>
/* Estilos para el popup de Mapbox (fuera de scoped para que funcionen) */
.mapboxgl-popup-content {
  border-radius: 12px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.25);
  padding: 15px;
  text-align: center;
  background-color: #fff;
  overflow: hidden;
}

.mapboxgl-popup-tip {
    border-top-color: #fff !important;
}

/* Estilos de texto para el popup */
.mapboxgl-popup-content h5 {
    margin-bottom: 5px;
    font-size: 1.15rem;
}
.mapboxgl-popup-content p {
    margin-bottom: 3px;
    line-height: 1.2;
    font-size: 0.9rem;
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
  top: 10px; /* Arriba del todo, centrado */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 8px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  color: #333;
  font-size: 14px;
  text-align: center;
  pointer-events: none;
}

.route-info-display p {
  margin: 0;
  line-height: 1.4;
}

/* --- ESTILOS DEL BOTÓN DE HAMBURGUESA --- */
.hamburger-button {
  position: absolute;
  top: 10px; /* Ajusta la posición según tus necesidades */
  right: 10px;
  z-index: 3; /* Asegúrate de que esté por encima del menú */
  width: 40px;
  height: 40px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 50%; /* Botón circular */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: background-color 0.3s ease;
}

.hamburger-button:hover {
  background-color: #f0f0f0;
}

.hamburger-button .bar {
  width: 24px;
  height: 3px;
  background-color: #333;
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
  top: 60px; /* Se posiciona debajo del botón de hamburguesa */
  right: 10px;
  z-index: 2; /* Por debajo del botón, por encima del mapa */

  background-color: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);

  display: flex;
  flex-direction: column; /* Apila los elementos verticalmente */
  gap: 15px; /* Espacio entre las SECCIONES (ahora títulos y hr) */

  /* Animación de entrada/salida */
  opacity: 0;
  visibility: hidden;
  transform: translateX(100%); /* Comienza fuera de la pantalla a la derecha */
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
  pointer-events: none; /* Deshabilita interacciones cuando está oculto */
}

.map-controls-menu.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateX(0); /* Vuelve a su posición normal */
  pointer-events: auto; /* Habilita interacciones cuando está abierto */
}

/* NUEVO: ESTILOS PARA TÍTULOS Y SEPARADOR DENTRO DEL MENÚ */
.map-controls-menu h4 {
  margin-top: 0; /* Eliminar margen superior por defecto */
  margin-bottom: 5px; /* Pequeño margen inferior para separar del contenido */
  font-size: 1rem; /* Tamaño de fuente para el título */
  color: #555; /* Color de texto más suave */
  text-align: center; /* Centrar el texto del título */
  width: 100%; /* Asegurar que ocupe todo el ancho disponible */
}

.map-controls-menu hr {
  width: 100%; /* La línea ocupará todo el ancho */
  border: none; /* Eliminar borde por defecto */
  border-top: 1px solid #eee; /* Borde superior fino y claro */
  margin: 10px 0; /* Espacio encima y debajo de la línea */
}

/* --- AJUSTES PARA LOS CONTROLES DENTRO DEL MENÚ --- */

.style-switcher {
  display: flex;
  gap: 5px;
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 0;
}

.style-switcher button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
}

.style-switcher button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

/* INICIO DE NUEVOS ESTILOS PARA LOS BOTONES DE FILTRO DE CLIENTE */
.client-type-filter-buttons {
  background-color: transparent; /* No necesita fondo propio */
  padding: 0; /* No necesita padding propio, lo maneja el menú */
  border-radius: 0;
  box-shadow: none;
  display: flex;
  flex-wrap: wrap; /* Permite que los elementos se envuelvan en pantallas pequeñas */
  gap: 8px; /* Espacio entre los botones */
  align-items: center;
  justify-content: center; /* Centra los botones */
}

.client-type-filter-buttons button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f0f0f0; /* Color por defecto inactivo */
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  flex-grow: 1; /* Permite que los botones crezcan para llenar el espacio */
  min-width: 80px; /* Ancho mínimo para que no se hagan demasiado pequeños */
}

.client-type-filter-buttons button:hover:not(.active) {
  background-color: #e9e9e9; /* Ligeramente más oscuro al pasar el ratón */
}

/* Estilos para el botón activo (seleccionado) */
.client-type-filter-buttons button.active {
  color: white; /* Texto blanco para botones activos */
  font-weight: bold;
}

/* Colores específicos para cada tipo de cliente */
.client-type-filter-buttons button.filter-empresa {
  background-color: #007bff; /* Azul */
  border-color: #007bff;
}
.client-type-filter-buttons button.filter-empresa.active {
  background-color: #0056b3; /* Azul más oscuro cuando está activo */
  border-color: #0056b3;
}

.client-type-filter-buttons button.filter-casa {
  background-color: #ff69b4; /* Rosa (HotPink) */
  border-color: #ff69b4;
}
.client-type-filter-buttons button.filter-casa.active {
  background-color: #e05c9f; /* Rosa más oscuro cuando está activo */
  border-color: #e05c9f;
}

.client-type-filter-buttons button.filter-cooperativa {
  background-color: #ffa500; /* Naranja */
  border-color: #ffa500;
}
.client-type-filter-buttons button.filter-cooperativa.active {
  background-color: #cc8400; /* Naranja más oscuro cuando está activo */
  border-color: #cc8400;
}

/* Color por defecto para el botón "Todos" cuando está activo */
.client-type-filter-buttons button.active:not(.filter-empresa):not(.filter-casa):not(.filter-cooperativa) {
  background-color: #007bff; /* Puedes ajustar este color */
  border-color: #007bff;
}
/* FIN DE NUEVOS ESTILOS PARA LOS BOTONES DE FILTRO DE CLIENTE */

/* --- MEDIA QUERY PARA MÓVILES --- */
@media (max-width: 768px) {
  /* Ajustes para la información de ruta */
  .route-info-display {
    top: 60px;
  }

  /* El botón de hamburguesa y el menú se ajustan automáticamente al ser absolutos */
  .hamburger-button {
    width: 35px;
    height: 35px;
    top: 10px;
    right: 10px;
    padding: 6px;
  }
  .hamburger-button .bar {
    width: 20px;
    height: 2px;
  }
  .hamburger-button.is-active .bar:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .hamburger-button.is-active .bar:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .map-controls-menu {
    top: 55px; /* Más cerca del top en móvil */
    right: 10px;
    left: 10px; /* Expandir a casi todo el ancho */
    max-width: unset; /* Asegurar que no haya límite de ancho */
  }

  /* Los botones de filtro se adaptan automáticamente con flex-wrap y flex-grow */
  .client-type-filter-buttons button {
    font-size: 13px;
    padding: 7px 10px;
  }
}
</style>
