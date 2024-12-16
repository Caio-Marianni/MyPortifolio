<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import NavElements from "./utils/NavElements.vue";
import ThemeToggle from "./utils/ThemeToggle.vue";
import { LucideLanguages } from "lucide-vue-next";

// Estado reativo
const isMenuOpen = ref(false); // Controle menu (mobile)
const activeIndex = ref(0); // Índice ativo para destacar o item do menu

// Alternar estado do menu (mobile)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Alterar destaque do menu
const changeHighlight = (index) => {
  activeIndex.value = index;
};

// Internacionalização (i18n)
const { t, locale } = useI18n(); // Desestruturação para usar `t` e `locale`

const switchLanguage = (lang) => {
  locale.value = lang; // Atualiza o idioma
};
</script>
<template>
  <div class="sticky top-0">
    <!-- NavBar -->
    <div class="sticky top-0 w-full dark:bg-[#ffffff] py-3 shadow-lg transition-all duration-500 z-10">
      <div class="flex items-center justify-between container relative">
        <!-- Left -->
        <div class="flex gap-1 items-center z-30">
          <!-- Mobile Menu -->
          <button
            @click="toggleMenu"
            class="cursor-pointer flex flex-col justify-center items-center p-2 rounded-lg shadow-sm shadow-slate-400"
          >
            <div
              class="h-1 w-7 bg-slate-800 rounded-full transition transform"
              :class="{
                '-rotate-45 translate-y-3': isMenuOpen,
              }"
            ></div>
            <div
              class="h-1 w-7 my-[6px] bg-slate-800 rounded-full transition"
              :class="{ 'bg-white': isMenuOpen }"
            ></div>
            <div
              class="h-1 w-7 bg-slate-800 rounded-full transition transform"
              :class="{
                'rotate-45 -translate-y-2': isMenuOpen,
              }"
            ></div>
          </button>
        </div>
        <!-- Center -->
        <div class="absolute inset-0 flex items-center justify-center">
          <img src="../assets/LogoOrange.webp" alt="" class="w-12" />
        </div>
        <!-- Right -->
        <div class="flex gap-4 items-center">
          <!-- contact Button -->
          <div class="block py-2 px-6 bg-red-400 text-black">
            {{ $t("btnNav") }}
          </div>
        </div>
        <!-- Extra -->
        <div
          class="absolute top-[52px] right-0 flex mr-10 px-10 rounded-b-xl bg-gray-100 shadow-inner border-b border-r border-slate-300"
        >
          <ThemeToggle />
          <hr
            className="w-0 h-7 border border-solid border-l border-gray-300 mx-3 opacity-0 sm:opacity-100 transition-opacity"
          />
          <div class="flex gap-3 text-[#ffffff]">
            <button @click="locale = 'pt'">Português</button>
            <button @click="locale = 'en'">English</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Navigation Elements -->
    <div class="relative container">
      <div
        class="container absolute left-0 w-52 p-4 mx-10 rounded-b-xl bg-gray-100 shadow-inner border-b border-r border-slate-300 transition-transform duration-300 ease-in-out"
        :class="{
          '-translate-y-full': !isMenuOpen,
          'translate-y-0': isMenuOpen,
        }"
      >
        <NavElements />
      </div>
    </div>
  </div>
</template>
