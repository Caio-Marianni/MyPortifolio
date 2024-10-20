<template>
  <div class="flex flex-col gap-6 lg:pt-2 pb-10 border-b border-borderColor border-opacity-10">
    <!-- Languages Section -->
    <SkillsDisplay
      skill="Languages"
      :skills="languages"
      color="79, 93, 149"
      />
    <!-- Frameworks Section -->
    <SkillsDisplay
      skill="Frameworks"
      :skills="frameworks"
      color="66, 184, 131"
    />
    <!-- Softwares Section -->
    <SkillsDisplay
      skill="Softwares"
      :skills="softwares"
      color="230, 230, 230"
    />
  </div>
</template>

<script setup>
import SkillsDisplay from "./utils/SkillsDisplay.vue";

const languages = ["JavaScript", "TypeScript", "Sql", "Php", "Html", "Css"];
const frameworks = ["Vue.js", "React", "Next.js", "Tailwind.css"];
const softwares = ["Figma", "Photoshop", "Illustrator", "VS Code", "Vercel"];
</script>
