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
    style: 'mapbox://styles/higuerodiego/clolwjys2009k01qm73bf7jct', // sty
    center: [-3.7031979, 40.4170335], // starting position [lng, lat]
    zoom: 10.2, // starting zoom,
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
    const el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker(el)
      .setLngLat([-3.7291771, 40.3099457,])
      .addTo(map);
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
                    `<h5 class="p-2 text-center fw-bold">${doc.data().nombre}</h5>
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

<style >
.map-container {
  width: 100vw;
  height: 100vh;
}
.mapboxgl-popup-close-button {
  font-size: 1.5rem!important;
  padding: 10px!important;
}
.marker {
  background-image: url('../assets/img/storeLogo.png');
  background-size: cover;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}
.mapboxgl-popup-content {
    background: #fff;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    
    padding: 20px 10px 10px 20px;
    pointer-events: auto;
    position: relative;
    width: max-content!important;
}
</style>