<template>
  <div class="flex flex-col gap-6 pb-10 border-b border-borderColor border-opacity-10">
    <!-- Languages Section -->
    <SkillsDisplay
      skill="Languages"
      :skills="languages"
      color="0, 0, 255"
      />
    <!-- Frameworks Section -->
    <SkillsDisplay
      skill="Frameworks"
      :skills="frameworks"
      color="0, 255, 255"
    />
    <!-- Softwares Section -->
    <SkillsDisplay
      skill="Softwares"
      :skills="softwares"
      color="255, 0, 0"
    />
  </div>
</template>

<script setup>
import SkillsDisplay from "./utils/SkillsDisplay.vue";

const languages = ["JavaScript", "TypeScript", "Sql", "Php", "Html", "Css"];
const frameworks = ["Vue.js", "React", "Next.js", "Tailwind.css"];
const softwares = ["Figma", "Photoshop", "Illustrator", "VS Code", "Vercel"];
</script>
