<!-- src/components/utils/SkillDisplay.vue -->
<template>
  <div>
    <h1 class="font-semibold text-lg text-[#d1d1d1]">{{ skill }}</h1>
    <ul class="flex flex-wrap gap-4 pt-2 pl-4">
      <li
        v-for="(skill, index) in skills"
        :key="index"
        :aria-label="'Skill: ' + skill"
        :style="{
          borderColor: `rgb(${color})`,
          backgroundColor: `rgba(${color}, 0.2)`,
          color: `rgb(${color})`,
        }"
        class="reveal-no-reset px-4 py-1 font-bold border rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
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
