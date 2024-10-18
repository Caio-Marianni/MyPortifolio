<template>
  <div v-for="(card, index) in cards" :key="index" class="reveal flex flex-col lg:flex-row items-center max-w-[1000px] rounded-md overflow-hidden shadow-md shadow-cardColorShadow">
    <!-- Part1 (cover, heading and icons) -->
    <div class="flex flex-col w-full lg:w-1/2 lg:border-r">
      <!-- Clicked cover -->
      <div class="relative group overflow-hidden w-full h-auto md:h-[350px] lg:h-full">
        <a :href="card.link" target="_blank" class="absolute h-full w-full text-center place-content-center text-xl bg-containerColor opacity-0 hover:opacity-90 hover:text-LittleDetailAction transition-all duration-500 z-10">
          access project
        </a>
        <img
          :src="card.cover"
          alt="project_cover"
          class="border-4 w-full h-[275px] md:h-[350px] lg:h-[250px] object-cover group-hover:scale-110 transition-all duration-500 z-0"
        />
      </div>
      <!-- Heading -->
      <div class="flex items-center justify-between px-5 py-6 border-t border-b lg:border-t lg:border-b-none bg-cardColorSec">
        <!-- Title -->
        <h2 class="font-semibold text-base md:text-xl">{{ card.name }}</h2>
        <!-- Icons -->
        <div class="flex justify-end flex-wrap gap-1 w-40 opacity-70">
          <div v-for="(icon, iconIndex) in card.technologies" :key="iconIndex">
            <component :is="icon" class="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
    <!-- Part2 (description and button)-->
    <div
      class="flex flex-col justify-between items-start w-full h-full lg:w-1/2 p-4 bg-cardColor"
    >
      <p class="font-extralight opacity-70">{{ card.description }}</p>
      <a
        :href="card.link"
        target="_blank"
        class="text-center mt-5 px-4 py-1 text-LittleDetailAction border-2 border-borderColor hover:border-[#ffffff] hover:text-[#ffffff] bg-containerColorSecondary hover:bg-LittleDetail rounded-full transition-all duration-300"
        >access project</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import projects from "@/core/constants/projects"; // Caminho correto para o arquivo projects.ts
import { useScrollReveal } from "./utils/ScrollRevealUtils";

// Defina os cards usando os projetos importados
const cards = ref(projects);
useScrollReveal()
</script>
