<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <!-- Background Effect -->
  <div class="absolute top-0 z-[-2] h-screen w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
    <div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
    <!-- Actual aplication -->
    <div class="md:container bg-containerColorSecondary dark:bg-[#ffffff] font-sans">
      <Navbar />
      <!-- Hero -->
       <!-- Projects -->
        <!-- About -->
         <!-- Contact -->
          <!-- Use REVEAL como class para o effect de fade -->
      <div class="h-screen"></div>
    </div>
  </div>
</template>
