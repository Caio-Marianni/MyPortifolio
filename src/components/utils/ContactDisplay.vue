<template>
  <div class="flex flex-col w-full h-full p-10 lg:mt-0 border-b lg:border border-borderColor bg-containerColor ">
    <h2 class="font-semibold text-lg">Contact Me</h2>
    <ul class="flex flex-wrap gap-4 pt-2 pl-4">
      <li
        v-for="(badge, index) in badges"
        :key="index"
        class="reveal-no-reset shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
      >
        <!-- Link do badge -->
        <a
          :href="badge.link"
          :aria-label="'Contact via ' + badge.name"
          target="_blank"
        >
          <!-- Ícone do badge -->
          <img :src="badge.icon" :alt="badge.name + ' icon'" class="w-auto h-8" />
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useScrollReveal } from './ScrollRevealUtils';

// Receber os badges como props
defineProps({
  badges: {
    type: Array as () => { name: string; link: string; icon: string }[],
    required: true,
  },
});

// Usar ScrollReveal para aplicar animações
useScrollReveal();
</script>
