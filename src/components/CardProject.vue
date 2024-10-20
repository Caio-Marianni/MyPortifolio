<template>
  <div
    class="reveal w-full lg:w-2/6 border border-[#4e4e4e] rounded-lg shadow-lg text-white transition-transform duration-300 hover:shadow-2xl hover:scale-105 bg-containerColorDarker"
  >
    <!-- Exibir a Imagem de Capa do Projeto -->
    <div class="relative w-full h-[200px] md:h-[250px] rounded-t-lg overflow-hidden">
      <a :href="project.link" target="_blank" class="absolute place-content-center text-center text-lg text-LittleDetailAction w-full h-full bg-black opacity-0 hover:opacity-100 hover:bg-opacity-80 duration-300 transition-all">access</a>
      <img
        :src="project.cover"
        alt="Project cover"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="px-6 py-3 border-t-2 border-[#929292]">
      <!-- Título do Projeto -->
      <h2 class="text-2xl font-bold mb-3 text-white">{{ project.name }}</h2>

      <!-- Tags do Projeto -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="(tag, tagIndex) in project.tags"
          :key="tagIndex"
          class="px-3 py-1 bg-LittleDetail bg-opacity-50 border border-LittleDetail text-white rounded-full text-sm transition-all duration-200 hover:bg-opacity-80"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Tecnologias Utilizadas -->
      <div class="flex items-center gap-4 mb-4">
        <component
          v-for="(tech, techIndex) in project.technologies"
          :key="techIndex"
          :is="tech.icon"
          class="w-8 h-8 text-LittleDetail transition-transform duration-300 hover:scale-110"
        />
      </div>

      <!-- Descrição do Projeto -->
      <p class="mb-4 text-gray-300 opacity-70">{{ project.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>
