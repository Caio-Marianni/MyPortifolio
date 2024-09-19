<template>
  <div class="flex flex-col items-center justify-center gap-10 w-full mt-6 lg:mt-3 border-b">
    <!-- Title -->
    <h1 class="text-4xl">Services</h1>
    <!-- Card Container -->
    <div class="flex flex-wrap flex-col items-center md:flex-row md:justify-evenly gap-8 w-full mb-10 px-5">
      <!-- Card -->
      <div v-for="(card, index) in cards" :key="index" class="flex flex-col items-center justify-center max-w-[350px] h-auto gap-5 py-8 px-8 border-2 border-borderColor rounded-md bg-cardColor">
        <component :is="card.icon" class="flex items-center justify-center w-20" />
        <h2 class="font-semibold">{{ card.title }}</h2>
        <p class="font-extralight text-center">{{ card.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import IconCode from './icons/IconCode.vue';
import IconPalette from './icons/IconPalette.vue';

export default {
  components: { IconCode, IconPalette },
  props: {
    cards: {
      type: Array,
      default: () => [
        { icon: IconCode,
          title: 'Web Deveopment', 
          description: 'As a programmer, I focus on using my creativity to deliver the project as quickly as possible, while taking great care to ensure the highest quality and standards throughout the development process.' },
        { icon: IconPalette, 
          title: 'Design', 
          description: 'As a designer, I focus on creating visually captivating designs that engage users, delivering quickly while ensuring the highest quality to maximize user interaction with the product' },
      ]
    }
  }
}
</script>