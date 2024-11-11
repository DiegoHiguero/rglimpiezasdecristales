<template>
    <ol class="day-of-week">
      <li
        v-for="weekday in user.weekdays"
        :key="weekday"
      >
        {{ weekday }}
      </li>
    </ol>
  </template>
  <script setup>
    import { useUserStore } from "../stores/user";
    const user = useUserStore();  
 
  </script>