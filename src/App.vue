<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import AboutContainer from "./components/AboutContainer.vue";
import Footer from "./components/Footer.vue";
import BorderEffect from "./components/BorderEffect.vue";
</script>

<template>
  <!-- Device size -->
  <div class="flex flex-col lg:flex-row lg:gap-3 lg:p-2 min-h-screen bg-containerColorSecondary lg:bg-black font-sans">
    <!-- Navbar / About Card-->
    <header class="h-full w-auto lg:sticky lg:top-2">
      <Navbar />
      <!-- About Card, show only in lg size -->
      <div class="hidden lg:flex">
        <AboutContainer />
      </div>
    </header>
    <!-- Content Change  -->
    <div class="relative h-full w-full reveal">
      <RouterView />
      <Footer />
      <!-- Border -->
      <div class="hidden lg:flex">
        <BorderEffect />
      </div>
    </div>
  </div>
</template>