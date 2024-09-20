<script setup>
import { vScrollReveal } from 'vue-scroll-reveal';
import BorderEffect from "./BorderEffect.vue";
import InfoTemplate from "./InfoTemplate.vue";
import IconDocument from "./icons/IconDocumentation.vue";
</script>
<template>
  <div class="text-[#ffffff] relative flex flex-col justify-between mt-24 lg:mt-3 px-5 pb-5 w-full lg:max-w-[350px] h-auto border-b border-borderColor border-opacity-20 lg:border lg:border-borderColor bg-containerColor" v-scroll-reveal="{ delay:200, scale: 1, distance: '10px'}">
    <!-- Cover and Info -->
    <div class="flex flex-col md:flex-row-reverse lg:flex-col justify-between items-center pt-10 lg:pt-5">
      <!-- Cover -->
      <div class="relative w-60 h-60 mb-5 rounded-lg shadow-md shadow-[#1e383c] overflow-hidden">
        <img class="flex object-contain" src="../assets/Profile.webp" alt="">
      </div>
      <!-- Info -->
      <div class="flex flex-col flex-wrap justify-between gap-2" v-scroll-reveal="{ delay:300, scale: 1, distance: '10px'}">
        <InfoTemplate>
          <template #title>Name</template>
          <template #text>Caio Marianni</template>
        </InfoTemplate>
        <InfoTemplate>
          <template #title>Occupation</template>
          <template #text>Web Developer / Designer</template>
        </InfoTemplate>
        <InfoTemplate>
          <template #title>Nacionality</template>
          <template #text>Brazilian</template>
        </InfoTemplate>
      </div>
    </div>
    <!-- Buttom -->
    <div class="flex items-center justify-center gap-4 mt-5 w-full " v-scroll-reveal="{ delay:400, scale: 1, distance: '10px'}">
      <a href="" class="flex justify-center items-center px-14 w-22 h-10 text-lg border-2 text-LittleDetailAction border-borderColor hover:border-[#ffffff] hover:bg-LittleDetail hover:text-[#ffffff] rounded-full transition-all duration-300">Hire me</a>
      <a href="" class="flex justify-center items-center w-10 h-10 border-2 border-borderColor hover:border-[#ffffff] hover:bg-LittleDetail rounded-full transition-all"><IconDocument/></a>
    </div>
    <!-- Border just when is LG view -->
    <div class="hidden lg:flex">
      <BorderEffect />
    </div>
  </div>
</template>
