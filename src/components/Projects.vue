<script setup>
import { projects } from "@/core/constants/index";
import ProjectCard from "./ProjectCard.vue";
</script>

<template>
  <div class="relative h-auto bg-background-950">
    <!-- Need to change the COLOR -->
    <div class="absolute inset-0 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,rgb(17, 68, 85)_100%)]"></div>
    <!-- Content -->
    <div class="flex flex-wrap z-10 pb-20">
      <ProjectCard v-for="(project, index) in projects" :key="project.id" :project="project" :projectId="index" />
    </div>
  </div>
</template>
