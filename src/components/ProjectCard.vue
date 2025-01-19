<script setup>
import { useI18n } from "vue-i18n";
// import textureImage1 from "@/assets/texture1.webp";
// import textureImage2 from "@/assets/texture2.webp";
// import textureImage3 from "@/assets/texture3.webp";
import IconVue from "@/assets/icons/IconVue.vue";
import IconReact from "@/assets/icons/IconReact.vue";
import IconTailwind from "@/assets/icons/IconTailwind.vue";
import IconTypescript from "@/assets/icons/IconTypeScript.vue";

// Mapa de tecnologias para componentes de ícones
const iconMap = {
  vue: IconVue,
  react: IconReact,
  tailwind: IconTailwind,
  typescript: IconTypescript,
};

// Recebe o projeto e o ID como props
defineProps({
  project: {
    type: Object,
    required: true,
  },
});

// Vue I18n para textos estáticos
const { t } = useI18n();
</script>

<template>
  <!-- Card Container -->
  <div class="border border-black rounded-lg shadow-2xl mx-auto my-14 w-[420px] h-auto" :style="{ boxShadow: `0 4px 6px -1px ${project.color}, 0 2px 4px -1px ${project.color}` }">
    <div class="relative h-auto rounded-lg bg-[#000] text-text-100 bg-cover bg-center p-4 shadow-lg">
      <!-- Card Frame -->
      <div
        class="relative flex flex-col h-full w-full pt-2 px-1 rounded-sm rounded-b-[100px]"
        :style="{
          backgroundImage: `url('${project.texture}')`,
        }"
      >
        <!-- Frame Header -->
        <div class="flex justify-between items-center px-4 py-2 text-[#fff] border border-[#000] rounded-3xl backdrop-blur-lg shadow-[inset_2px_-2px_3px_0px_rgba(0,_0,_0,_1)]">
          <h1>{{ t(`projects.${project.id}.name`) }}</h1>
          <a :href="project.link" target="_blank" class="w-8 h-8 border-2 bg-[#000] bg-opacity-40 hover:bg-opacity-60 transition-all rounded-full flex items-center justify-center">
            <!-- Ícone de link -->
            <svg width="23px" height="22px" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 5H8.2C7.08 5 6.52 5 6.09 5.22C5.72 5.41 5.41 5.72 5.22 6.09C5 6.52 5 7.08 5 8.2V15.8C5 16.92 5 17.48 5.22 17.91C5.41 18.28 5.72 18.59 6.09 18.78C6.52 19 7.08 19 8.2 19H15.8C16.92 19 17.48 19 17.91 18.78C18.28 18.59 18.59 18.28 18.78 17.91C19 17.48 19 16.92 19 15.8V14M20 9V4M20 4H15M20 4L13 11"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
        </div>

        <!-- Frame Art -->
        <div class="relative mx-4 min-h-[196px]">
          <a :href="project.link" class="absolute w-full h-full z-10 shadow-inner shadow-[#000] border border-b-0 border-[#000]"></a>
          <img class="object-fill rounded-sm" :src="project.cover" :alt="project.name" />
        </div>

        <!-- Frame Type -->
        <div class="flex justify-between items-center px-4 py-2 text-text-50 border border-t border-[#000] rounded-3xl backdrop-blur-lg shadow-[inset_2px_-2px_3px_0px_rgba(0,_0,_0,_1)]">
          <h1 class="text-sm">{{ project.type }}</h1>
          <div class="flex gap-2">
            <div v-for="tech in project.technologies" :key="tech" class="w-8 h-8 border-2 bg-[#000] bg-opacity-40 rounded-full flex items-center justify-center">
              <component :is="iconMap[tech]" class="w-5 h-5" />
            </div>
          </div>
        </div>

        <!-- Frame Description -->
        <div class="flex flex-col justify-between border border-t-0 bg-background-100 min-h-72 text-text-900 mx-4 p-3 py-4 text-sm leading-relaxed">
          <p>{{ t(`projects.${project.id}.description1`) }}</p>
          <p>{{ t(`projects.${project.id}.description2`) }}</p>
          <p class="italic text-text-950">"{{ t(`projects.${project.id}.description3`) }}"</p>
        </div>
      </div>

      <!-- Frame Footer -->
      <div class="flex justify-between text-xs text-white mt-2 px-4">
        <div class="mb-1 text-wrap w-44">
          <p>{{ t(`projects.${project.id}.acquiredProject`) }} &#x2022; {{ t(`projects.${project.id}.requestedProject`) }}</p>
        </div>
        <div class="text-right">&#x99; &amp; &#169; {{ project.year }} By me</div>
      </div>
    </div>
  </div>
</template>
