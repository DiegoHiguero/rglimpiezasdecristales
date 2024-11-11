<template>
    <div class="calendar-date-indicator">{{ user.selectedMonth() }}</div>
  </template>
  
  <script setup>
  import dayjs from "dayjs";
  import dayOfYear from "dayjs/plugin/dayOfYear"
     dayjs.extend(dayOfYear)
  import { useUserStore } from "../stores/user";
const user = useUserStore();  

    
  </script>