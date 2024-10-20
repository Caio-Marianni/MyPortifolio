<script setup>
import AboutContainer from "@/components/AboutContainer.vue";
import ProjectContainer from "@/components/ProjectContainer.vue";
import SkillsContainer from "@/components/SkillsContainer.vue";
</script>

<template>
  <div
    class="flex flex-col justify-center items-center gap-4 p-2 text-[#ffffff] lg:border lg:border-borderColor bg-containerColor w-full"
  >
    <!-- About Card show only in sm/md size -->
    <div class="flex w-full lg:hidden">
      <AboutContainer />
    </div>
    <SkillsContainer />
    <ProjectContainer />
  </div>
</template>
