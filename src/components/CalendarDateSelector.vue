<template>
    <div class="calendar-date-selector">
      <span @click="user.selectPrevious()">﹤</span>
      <span @click="user.selectCurrent()">Today</span>
      <span @click="user.selectNext()">﹥</span>
    </div>
  </template>
  <script setup>
  import dayjs from "dayjs";
  
  import { useUserStore } from "../stores/user";

    const user = useUserStore();  
 
   
  </script>