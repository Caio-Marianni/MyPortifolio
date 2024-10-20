<!-- src/components/utils/SkillDisplay.vue -->
<template>
  <div>
    <h1 class="font-semibold text-lg">{{ skill }}</h1>
    <ul class="flex flex-wrap gap-3 pt-2 pl-4">
      <li
        v-for="(skill, index) in skills"
        :key="index"
        :aria-label="'Skill: ' + skill"
        :style="{
          borderColor: `rgb(${color})`,
          backgroundColor: `rgb(${color}, .2)`,
          color: `rgb(${color})`,
        }"
        class="reveal-no-reset px-4 py-1 font-bold border rounded-full"
      >
        {{ skill }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useScrollReveal } from "./ScrollRevealUtils";

defineProps({
  skill: {
    type: String,
    required: true,
  },
  skills: {
    type: Array,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

useScrollReveal();
</script>
