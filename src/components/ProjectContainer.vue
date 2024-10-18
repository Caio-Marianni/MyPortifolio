<template>
  <div class="flex flex-col items-center justify-center gap-10 w-full mt-6 lg:mt-3 pb-10">
    <!-- Title -->
    <h1 class="text-4xl">Web Projects</h1>
    <!-- Card Container -->
    <div class="flex flex-col justify-center items-center gap-8 w-full px-4 md:px-14">
      <!-- Card -->
      <CardProject />
    </div>
  </div>
</template>


<script setup>
import CardProject from './CardProject.vue';
</script>
