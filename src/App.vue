<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import AboutContainer from "./components/AboutContainer.vue";
</script>

<template>
  <!-- Device size -->
  <div class="flex flex-col lg:flex-row lg:gap-3 lg:p-2">
    <!-- Navbar -->
    <header class="h-full w-auto lg:sticky lg:top-2">
      <Navbar />
      <AboutContainer />
    </header>
    <!-- Content  -->
    <div class="h-full w-full">
      <RouterView />
    </div>
  </div>
</template>

<!-- Add the path to the navigation item -->
<!-- Add the path to the hire me -->
<!-- Add the path to the CV donwload, and dowload function -->
