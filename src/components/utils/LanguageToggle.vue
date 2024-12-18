<template>
  <button @click="toggleLanguage" class="flex items-center text-black">
    <LucideLanguages class="w-5 h-5" />
    <!-- Mostra PT ou EN com base no idioma atual -->
    <span class="ml-2">{{ locale === "en" ? "PT" : "EN" }}</span>
  </button>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { LucideLanguages } from "lucide-vue-next";

// Vue I18n (setup / language change)
const { locale } = useI18n();

// Toggle (English / Portuguese)
const toggleLanguage = () => {
  locale.value = locale.value === "en" ? "pt" : "en";
};
</script>
