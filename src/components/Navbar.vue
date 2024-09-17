<script>
import { RouterLink } from 'vue-router';
import BorderEffect from './BorderEffect.vue';

export default {
  components: { BorderEffect, RouterLink },
  methods: {
    rotateMenu() {
      const bar1 = this.$refs.bar1;
      const bar2 = this.$refs.bar2;
      const bar3 = this.$refs.bar3;
      const navigation = this.$refs.navigation;
      bar1.classList.toggle("-rotate-45");
      bar1.classList.toggle("translate-y-4");
      bar2.classList.toggle("opacity-0");
      bar3.classList.toggle("rotate-45");
      bar3.classList.toggle("-translate-y-4");
      navigation.classList.toggle("translate-y-0");
    },
    changeHighlight(index) {
      const elements = [this.$refs.element1, this.$refs.element2, this.$refs.element3];
      
      elements.forEach((el, idx) => {
        if (idx === index) {
          el.classList.add("text-[#ff5404]");
          el.classList.remove("text-[#ffffff]");
          el.classList.add("font-bold");
          el.classList.remove("font-normal");
          el.classList.add("text-xl");
          el.classList.remove("text-base");
        } else {
          el.classList.add("text-[#ffffff]");
          el.classList.remove("text-[#ff5404]");
          el.classList.add("font-normal");
          el.classList.remove("font-bold");
          el.classList.add("text-base");
          el.classList.remove("text-xl");
        }
      });
    },
  },
};
</script>
<template>
    <div class="relative h-auto lg:border lg:m-2">
      <!-- Mobile navbar -->
       <div class="absolute lg:hidden flex items-center justify-between px-5 py-2 w-full h-24 z-10 bg-containerColor shadow-md">
        <!-- Logo -->
         <div class="w-16 h-16"><img class="object-contain" src="../assets/LogoOrange.webp" alt=""></div>
         <!-- Burguer Menu -->
         <div @click="rotateMenu" class="cursor-pointer flex flex-col gap-2 justify-center items-center">
           <div ref="bar1" class="h-2 w-10 bg-[#ffffff] rounded-full transition duration-300 ease-in-out transform"></div>
           <div ref="bar2" class="h-2 w-10 bg-[#ffffff] rounded-full transition duration-200 ease-in-out transform rotate-0"></div>
           <div ref="bar3" class="h-2 w-10 bg-[#ffffff] rounded-full transition duration-300 ease-in-out transform"></div>
          </div>
        </div>
      <!-- Navigation -->
      <div ref="navigation" class="flex items-center lg:items-start flex-col md:flex-row lg:flex-col justify-evenly gap-5 -translate-y-full lg:translate-y-0 pt-28 lg:pt-4 pb-4 lg:px-4 md:text-center lg:text-left text-[#ffffff] bg-containerColorDarker lg:bg-transparent lg:backdrop-blur-lg transition-all duration-500 shadow-md">
        <RouterLink to="/">
          <p class="md:w-32 md:h-8 text-[#ff5404] font-bold text-xl transition-all duration-200" ref="element1" @click="changeHighlight(0)">Home</p>
        </RouterLink>
        <RouterLink to="/about">
          <p class="md:w-32 md:h-8 text-[#ffffff] font-normal text-base transition-all duration-200" ref="element2" @click="changeHighlight(1)">About me</p>
        </RouterLink>
        <RouterLink to="">
          <p class="md:w-32 md:h-8 text-[#ffffff] font-normal text-base transition-all duration-200" ref="element3" @click="changeHighlight(2)">Contact me</p>
        </RouterLink>
      </div>
      <!-- Border just when is LG view -->
      <div class="hidden lg:flex">
        <BorderEffect />
      </div>
    </div>
</template>
