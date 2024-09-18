<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import AboutContainer from "./components/AboutContainer.vue";
</script>

<template>
  <!-- Device size -->
  <div class="flex flex-col lg:flex-row lg:gap-2 w-screen lg:p-2">
    <!-- Navbar -->
    <header class="h-full">
      <Navbar />
      <AboutContainer />
    </header>
    <!-- Content  -->
    <div class="">
      <RouterView />
    </div>
  </div>
</template>

<!-- Add the path to the navigation item -->
<!-- Add the path to the hire me -->
<!-- Add the path to the CV donwload, and dowload function -->
