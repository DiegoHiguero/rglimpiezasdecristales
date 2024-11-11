<template>
    <div class="calendar-month">
      <div class="calendar-month-header">
        <CalendarDateIndicator
          :selected-date="user.selectedDate"
          class="calendar-month-header-selected-month"
        />
        <CalendarDateSelector
          :current-date="user.today"
          @dateSelected="selectDate"
        />
      </div>
      <CalendarWeekdays/>
      <ol class="days-grid">
      <CalendarMonthDayItem
        v-for="day in user.days()"
        :key="day.date"
        :day="day"
        :is-today="day.date === today"
      />
    </ol>
    </div>
  </template>

<script setup>

import CalendarDateIndicator from "./CalendarDateIndicator.vue";
import CalendarDateSelector from "./CalendarDateSelector.vue";
import { useUserStore } from "../stores/user";
import  CalendarWeekdays from "./CalendarWeekdays.vue";

const user = useUserStore();  

    const selectDate = (newSelectedDate)=> {
    user.selectedDate = newSelectedDate;
    }

</script>

<style>

</style>