<script setup>
import Navbar from "./components/Navbar.vue";
import AboutContainer from "./components/AboutContainer.vue";
import Footer from "./components/Footer.vue";
import BorderEffect from "./components/BorderEffect.vue";
</script>

<template>
  <!-- Device size -->
  <div class="bg-containerColorSecondary dark:bg-[#ffffff] font-sans">
    <Navbar />
    <!-- Content Change  -->
     <div class="h-screen"></div>
    <div class="relative h-full w-full reveal">
      <!-- Content -->
      <Footer />
    </div>
  </div>
</template> 