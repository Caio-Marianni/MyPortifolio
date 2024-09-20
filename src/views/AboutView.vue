<script setup>
import { vScrollReveal } from 'vue-scroll-reveal';
</script>
<template>
  <div class="flex flex-col lg:flex-row items-center justify-center lg:gap-20 w-full h-auto p-10 mt-24 lg:mt-0 border-b lg:border border-borderColor bg-containerColor ">
    <!-- Heading / description -->
    <div class="w-full text-[#ffffff]" v-scroll-reveal="{ delay:100, scale: 1, distance: '10px'}">
      <h1 class="text-lg font-bold mb-2">About me</h1>
      <p class="font-light text-base">I'm a Brazilian with a passion for programming, creativity, and music. I love diving into the creative process, whether it's coding a new project or exploring new musical ideas. My curiosity drives me to constantly improve everything I work on, always seeking ways to make my creations more innovative and refined. <br> <br> Whether through problem-solving in programming or expressing creativity in music, I'm always looking for opportunities to grow and evolve in everything I do. Stay tuned, as I'll soon be sharing updates about my music project here!</p>
    </div>
    <!-- Img -->
    <div class="relative flex lg:hidden w-64 h-64 bg-borderColor mt-10 rounded-md overflow-hidden shadow-md shadow-[#1e383c]" v-scroll-reveal="{ delay:200, scale: 1, distance: '10px'}">
      <img src="../assets/Profile.webp" alt="profile-picture" class="h-full object-cover">
    </div>
  </div>
</template>
