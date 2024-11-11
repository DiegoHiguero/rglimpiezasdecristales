<template>
    <li
      class="calendar-day"
      :class="{
        'calendar-day--not-current': !isCurrentMonth,
        'calendar-day--today': isToday
      }"
    >
      <span>{{ user.label() }}</span>
    </li>
  </template>
  <script setup>
  import dayjs from "dayjs";
  import { useUserStore } from "../stores/user";
    const user = useUserStore();  
 
  </script>