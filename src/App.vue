<script setup>
import { RouterView } from "vue-router";
import { vScrollReveal } from 'vue-scroll-reveal';
import Navbar from "./components/Navbar.vue";
import AboutContainer from "./components/AboutContainer.vue";
import Footer from "./components/Footer.vue";
import BorderEffect from "./components/BorderEffect.vue";
</script>

<template>
  <!-- Device size -->
  <div class="flex flex-col lg:flex-row lg:gap-3 lg:p-2 min-h-screen bg-containerColorSecondary lg:bg-black">
    <!-- Navbar / About Card-->
    <header class="h-full w-auto lg:sticky lg:top-2">
      <Navbar />
      <!-- About Card, show only in lg size -->
      <div class="hidden lg:flex">
        <AboutContainer />
      </div>
    </header>
    <!-- Content Change  -->
    <div class="relative h-full w-full">
      <RouterView v-scroll-reveal="{ delay:100, scale: 1, distance: '10px', reset: true,}" />
      <Footer v-scroll-reveal="{ delay:200, scale: 1, distance: '10px', reset: true,}" />
      <!-- Border -->
      <div class="hidden lg:flex">
        <BorderEffect />
      </div>
    </div>
  </div>
</template>

<!-- Add the path to the navigation item -->
<!-- Add the path to the hire me (ZAP) -->
<!-- Add the path to the CV donwload, and dowload function -->

<!-- Create the text to the service card -->
<!-- Fix the Icon from the service card -->