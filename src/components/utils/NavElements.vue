<script setup>
import { LucideBadge, LucidePackage } from "lucide-vue-next";
import { ref } from "vue";
// import { RouterLink } from "vue-router";

const activeIndex = ref(0);

// Alternar estado do menu (mobile)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Alterar destaque do menu
const changeHighlight = (index) => {
  activeIndex.value = index;
};

// Recebe a prop isMenuOpen do pai
defineProps({
  isMenuOpen: Boolean,
});
</script>

<template>
  <nav class="flex flex-col sm:flex-row gap-2">
    <!-- <RouterLink to="/" @click="changeHighlight(0)"> -->
      <p
        class="text-base font-normal transition-all duration-200"
        :class="{
          'text-[#ff5404]': activeIndex === 0,
          'text-gray-400': activeIndex !== 0,
        }"
      >
        Home
      </p>
    <!-- </RouterLink> -->
    <!-- <RouterLink to="/pacotes" @click="changeHighlight(1)"> -->
      <p
        class="text-base font-normal transition-all duration-200"
        :class="{
          'text-[#ff5404]': activeIndex === 1,
          'text-gray-400': activeIndex !== 1,
        }"
      >
        Pacotes
      </p>
    <!-- </RouterLink> -->
    <!-- <RouterLink to="/contact" @click="changeHighlight(2)"> -->
      <p
        class="text-base font-normal transition-all duration-200"
        :class="{
          'text-[#ff5404]': activeIndex === 2,
          'text-gray-400': activeIndex !== 2,
        }"
      >
        Contact Me
      </p>
      <a
          href="#session1"
          ref="element1"
          @click="changeHighlight(0)"
          class="md:w-32 md:h-8 text-[#ff5404] font-bold text-xl transition-all duration-200"
          >{{ $t("nav1") }}</a
        >
    <!-- </RouterLink> -->
  </nav>
</template>