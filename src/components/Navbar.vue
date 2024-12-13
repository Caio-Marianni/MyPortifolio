<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import NavElements from "./utils/NavElements.vue";
import ThemeToggle from "./utils/ThemeToggle.vue";

// Estado reativo para o menu e destaque dos itens
const isMenuOpen = ref(false);
const activeIndex = ref(0);

// Alternar estado do menu (mobile)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Alterar destaque do menu
const changeHighlight = (index) => {
  activeIndex.value = index;
};
</script>

<template>
  <div
    class="sticky top-0 flex items-center justify-between border-b w-full py-3 px-4 z-20 backdrop-blur-3xl shadow-lg"
  >
    <!-- Left Part -->
    <div class="flex gap-1 items-center">
      <!-- Logo -->
      <RouterLink to="/" @click="changeHighlight(0)">
        <div class="w-auto">
          <h1 class="text-black">LOGO AQ</h1>
          <!-- <img class="object-contain" src="../assets/LogoOrange.webp" alt="Logo" /> -->
        </div>
      </RouterLink>
      <!-- Bar -->
      <hr
        className="w-0 h-7 border border-solid border-l border-gray-300 mx-3 opacity-0 sm:opacity-100 transition-opacity"
      />
      <!-- Navigation -->
      <div class="hidden sm:flex items-center gap-4">
        <NavElements />
      </div>
      <!-- Menu lateral -->
      <div
        class="absolute sm:hidden top-16 left-0 w-52 p-4 rounded-br-xl bg-gray-100 sm:bg-transparent shadow-inner border-b border-r border-slate-300 transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0"
        :class="{
          '-translate-x-full': !isMenuOpen,
          'translate-x-0': isMenuOpen,
        }"
      >
        <NavElements />
      </div> 
    </div>
    <!-- Right Part -->
    <div class="flex gap-4 items-center">
      <ThemeToggle />
      <!-- contact Button -->
      <div class="hidden sm:block py-2 px-6 bg-red-400 text-black">
        Viaje Já
      </div>
      <!-- Mobile Menu -->
      <button
        @click="toggleMenu"
        class="sm:hidden cursor-pointer flex flex-col justify-center items-center p-2 rounded-lg shadow-sm shadow-slate-400"
      >
        <div
          class="h-1 w-7 bg-slate-800 rounded-full transition transform"
          :class="{
            '-rotate-45 translate-y-3': isMenuOpen,
          }"
        ></div>
        <div
          class="h-1 w-7 my-[6px] bg-slate-800 rounded-full transition opacity-100"
          :class="{ 'opacity-5': isMenuOpen }"
        ></div>
        <div
          class="h-1 w-7 bg-slate-800 rounded-full transition transform"
          :class="{
            'rotate-45 -translate-y-2': isMenuOpen,
          }"
        ></div>
      </button>
    </div>
  </div>
</template>

<!-- <div ref="navigation" class="flex items-center lg:items-start flex-col md:flex-row lg:flex-col justify-evenly gap-5 -translate-y-full lg:translate-y-0 pt-24 lg:pt-4 pb-4 lg:px-4 md:text-center lg:text-left text-[#ffffff] bg-containerColorDarker lg:bg-containerColor lg:backdrop-blur-lg transition-all duration-500 shadow-md">
  <a href="#session1" ref="element1" @click="changeHighlight(0)" class="md:w-32 md:h-8 text-[#ff5404] font-bold text-xl transition-all duration-200">{{ $t('nav1') }}</a>
  <a href="#session2" ref="element2" @click="changeHighlight(1)" class="md:w-32 md:h-8 text-[#ff5404] font-bold text-xl transition-all duration-200">{{ $t('nav2') }}</a>
  <a href="#session3" ref="element3" @click="changeHighlight(2)" class="md:w-32 md:h-8 text-[#ff5404] font-bold text-xl transition-all duration-200">{{ $t('nav3') }}</a>
  <a href="#session4" ref="element4" @click="changeHighlight(3)" class="md:w-32 md:h-8 text-[#ff5404] font-bold text-xl transition-all duration-200">{{ $t('nav4') }}</a>
  <a href="#session5" ref="element5" @click="changeHighlight(4)" class="md:w-32 md:h-8 text-[#ff5404] font-bold text-xl transition-all duration-200">{{ $t('nav5') }}</a>
</div>
<div class="flex gap-3 text-[#ffffff]">
  <button @click="locale = 'pt'">Português</button>
<button @click="locale = 'en'">English</button>
</div> -->