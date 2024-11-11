<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxSdk from "@mapbox/mapbox-sdk/services/geocoding";
import { query } from "firebase/firestore/lite";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore/lite";
import { db } from "../firebaseConfig";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGlndWVyb2RpZWdvIiwiYSI6ImNrN3Q2a25yNTBtc2ozaG1yam8zNnRibHUifQ.Zgmrlgnrw54eXySGuI3DIQ";
const mapContainer = ref<HTMLElement>();

onMounted(() => {
  const map = new mapboxgl.Map({
    container: mapContainer.value!, // container ID
    style: 'mapbox://styles/mapbox/satellite-v9', // sty
    center: [-1.52558, 43.486685], // starting position [lng, lat]
    zoom: 12.2, // starting zoom,
  });
  map.on("load", () => {
    var layers: any = map.getStyle().layers;
    var labelLayerId;

    for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
        labelLayerId = layers[i].id;
        break;
      }
    }

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });
    const getInfo = async () => {
      try {
        const q = query(collection(db, "clientes"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
          mapboxClient
            .forwardGeocode({
              query: ` ${doc.data().direccion} + ${doc.data().ciudad}`,
              autocomplete: false,
              limit: 1,
            })
            .send()
            .then((response) => {
              if (
                !response ||
                !response.body ||
                !response.body.features ||
                !response.body.features.length
              ) {
                console.error("Invalid response:");
                console.error(response);
                return;
              }
              const feature = response.body.features[0];

              new mapboxgl.Marker({
    color: "blue",
  }).setLngLat(feature.center).setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                  .setHTML(
                    `<h5 class="p-2 text-center">${doc.data().nombre}</h5>
                    <p class="text-center">${doc.data().direccion}<p/>
                    <p class="text-center">${doc.data().codigoPostal} ${doc.data().ciudad}<p/>`
                  )
              )
                .addTo(map);
            });
        });
      } catch (error) {
        console.log(error);
      }
    };
    getInfo();

    map.addSource("edificiosHechos", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    }),
      labelLayerId;
  });
});
</script>

<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
}

.marker {
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
</style>