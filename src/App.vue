<script setup>
import Navbar from "./components/Navbar.vue";
import Hero from "./components/Hero.vue";
import AboutCard from "./components/AboutCard.vue";
import Projects from "./components/Projects.vue";
import Contact from "./components/Contact.vue";
</script>

<template>
  <Navbar />
  <!-- Background Effect -->
  <div class="absolute top-0 z-[-2] h-screen w-full bg-background-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
    <div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
  </div>
  <!-- Hero Content -->
  <div class="md:container font-sans">
    <Hero />
    <div class="flex justify-center mx-5">
      <AboutCard />
    </div>
  </div>
  <!-- Projects and More -->
  <div>
    <Projects />
  </div>
   <Contact />
  <!-- Use REVEAL como class para o effect de fade -->
  <!-- v-scroll-reveal="{ delay:200, scale: 1, distance: '10px'}" -->
</template>
