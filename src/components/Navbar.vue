<script setup>
import ThemeToggle from "./utils/ThemeToggle.vue";
import LanguageToggle from "./utils/LanguageToggle.vue";
</script>

<template>
  <div class="md:container sticky top-0 md:top-4 flex justify-center items-center m-auto z-50">
  <div class="flex justify-between w-full md:m-4 p-2 px-6 md:border border-b border-gray-600 md:rounded-full backdrop-blur-3xl bg-slate-900 bg-opacity-50 shadow-md">
    <!-- Right side (logo) -->
    <div class="">
      <img src="../assets/LogoOrange.webp" alt="Logo" class="w-12" />
    </div>
    <!-- Left side (buttons)-->
    <div class="flex justify-center items-center">
      <!-- Extras -->
      <ThemeToggle />
      <hr class="h-5 border border-solid border-l border-gray-800 mx-3 transition-opacity"/>
      <LanguageToggle />
      <!-- Contact Button-->
      <a href="#contact" class="ml-5 overflow-hidden bg-orange-600 focus:ring-4 focus:ring-orange-300 inline-flex items-center px-6 py-2 rounded-full text-white justify-center">
        <span>{{ $t("btnNav") }}</span>
      </a>
    </div>
  </div></div>
</template>

<style scoped>
/* Transição CSS personalizada */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
