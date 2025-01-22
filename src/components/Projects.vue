<script setup>
import { projects } from "@/core/constants/index";
import ProjectCard from "./ProjectCard.vue";
</script>

<template>
  <div id="projects" class="relative h-auto bg-background-50 dark:bg-background-950 transition-all duration-1000">
    <!-- Need to change the COLOR -->
    <div class="absolute bottom-0 h-[1000px] w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,transparent_60%,#cc6633_100%)]"></div>
    <!-- Content -->
    <div class="flex flex-wrap z-10 py-32">
      <ProjectCard v-for="(project, index) in projects" :key="project.id" :project="project" :projectId="index" />
    </div>
  </div>
</template>
