<script setup>
import AboutContainer from "@/components/AboutContainer.vue";
import BorderEffect from "@/components/BorderEffect.vue";
import ProjectContainer from "@/components/ProjectContainer.vue";
import ServicesContainer from "@/components/ServicesContainer.vue";

// import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div class="relative flex flex-col justify-center items-center gap-4 p-2 text-[#ffffff] lg:border lg:border-borderColor bg-containerColor w-full">
    <!-- About Card show only in sm/md size -->
    <div class="flex w-full lg:hidden">
      <AboutContainer />
    </div>
    <ServicesContainer />
    <ProjectContainer />
    <div class="hidden lg:flex">
      <BorderEffect />
    </div>
  </div>
  <!-- <TheWelcome /> -->
  <!-- <div class="flex w-20 h-72 bg-containerColor">teste</div> -->
  <!-- <div class="flex w-20 h-96 bg-containerColor">teste</div> -->
</template>
