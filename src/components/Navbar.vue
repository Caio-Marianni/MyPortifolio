<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import NavElements from "./utils/NavElements.vue";
import ThemeToggle from "./utils/ThemeToggle.vue";
import LanguageToggle from "./utils/LanguageToggle.vue";

// Reactive states
const isMenuOpen = ref(false); // Toggle for mobile menu
const activeIndex = ref(0); // Active menu item index

// Toggle (mobile menu)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Vue I18n (setup / language change)
const { locale } = useI18n();

// Toggle (English / Portuguese)
const toggleLanguage = () => {
  locale.value = locale.value === "en" ? "pt" : "en";
  currentLanguage.value = locale.value;
};
</script>

<template>
  <div class="sticky top-0">
    <!-- NavBar -->
    <div
      class="sticky top-0 bg-slate-50 dark:bg-slate-800 py-3 shadow-lg transition-all duration-500 z-10"
    >
      <div class="flex items-center justify-between container relative">
        <!-- Left -->
        <div class="flex gap-1 items-center z-30">
          <!-- Mobile Menu Button -->
          <button
            @click="toggleMenu"
            class="cursor-pointer flex flex-col justify-center items-center p-2 rounded-lg shadow-sm shadow-slate-400"
          >
            <div
              class="h-1 w-7 bg-slate-800 rounded-full transition-transform"
              :class="{
                '-rotate-45 translate-y-3': isMenuOpen,
              }"
            ></div>
            <div
              class="h-1 w-7 my-[6px] bg-slate-800 rounded-full transition"
              :class="{ 'bg-white': isMenuOpen }"
            ></div>
            <div
              class="h-1 w-7 bg-slate-800 rounded-full transition-transform"
              :class="{
                'rotate-45 -translate-y-2': isMenuOpen,
              }"
            ></div>
          </button>
        </div>

        <!-- Center -->
        <div class="absolute inset-0 -left-6 flex items-center justify-center">
          <img src="../assets/LogoOrange.webp" alt="Logo" class="w-12" />
        </div>

        <!-- Right / Contact Button-->
        <a
          href="#contact"
          class="group relative overflow-hidden bg-orange-600 focus:ring-4 focus:ring-orange-300 inline-flex items-center px-7 py-2.5 rounded-lg text-white justify-center"
        >
            <span relative="relative z-10">{{ $t("btnNav") }}</span>
        </a>

      </div>
    </div>

    <!-- Extra Options -->
    <div class="absolute top-[68px] right-10 flex items-center px-6 py-3 rounded-b-xl bg-gray-100 shadow-inner border-b border-r border-slate-300">
      <ThemeToggle />
      <hr class="h-5 border border-solid border-l border-gray-300 mx-3 opacity-0 sm:opacity-100 transition-opacity"/>
      <LanguageToggle />
    </div>

    <!-- Navigation Elements (Mobile Menu) -->
    <div class="relative container">
      <div
        class="absolute left-0 w-52 p-4 mx-10 rounded-b-xl bg-gray-100 shadow-inner border-b border-r border-slate-300 transition-transform duration-300 ease-in-out"
        :class="{
          '-translate-y-full': !isMenuOpen,
          'translate-y-0': isMenuOpen,
        }"
      >
        <NavElements
          :activeIndex="activeIndex"
          @changeHighlight="changeHighlight"
        />
      </div>
    </div>
  </div>
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