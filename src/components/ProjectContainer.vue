<template>
  <div class="flex flex-col gap-5 w-full mt-6 lg:mt-3 pb-10">
    <!-- Title -->
    <h1 class="text-4xl font-bold text-[#d1d1d1]">Web Projects</h1>
    <!-- Searchbar -->
    <input
      v-model="searchTerm"
      placeholder="Search projects by name, page types, and techs"
      class="border-b border-[#c1c1c1c1] rounded-md p-2 mb-6 bg-tranparent text-white focus:outline-none focus:ring-2 focus:ring-LittleDetail hover:bg-opacity-20 transition-all duration-300 ease-in-out"
    />
    <!-- Card Container and Transition to Search -->
    <transition-group name="fade" tag="div" class="flex flex-wrap gap-6 w-full">
      <CardProject
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import projects from "@/core/constants/projects";
import CardProject from "./CardProject.vue";

const searchTerm = ref("");

// Computed que filtra os projetos com base no termo de busca
const filteredProjects = computed(() => {
  const searchLower = searchTerm.value.toLowerCase();
  return projects.filter((project) => {
    return (
      project.name.toLowerCase().includes(searchLower) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
      project.technologies.some((tech) =>
        tech.name.toLowerCase().includes(searchLower)
      )
    );
  });
});
</script>

<style>
/* Efeito fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* Optional custom styling */
input::placeholder {
  color: #b3b3b3; /* Lighter color for the placeholder */
}

input:focus {
  border-bottom-color: #ff6600; /* Custom focus color matching your theme */
}

input:hover {
  background-color: rgba(255, 255, 255, 0.05); /* Slightly change background on hover */
}
</style>
