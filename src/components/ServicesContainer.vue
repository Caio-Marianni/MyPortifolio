<template>
  <div class="flex flex-col items-center justify-center gap-10 w-auto mt-6 lg:mt-3">
    <!-- Title -->
    <h1 class="text-4xl">Services</h1>
    <!-- Card Container -->
    <div class="flex flex-wrap flex-col md:flex-row justify-evenly gap-4 w-full">
      <!-- Card -->
      <div v-for="(card, index) in cards" :key="index" class="flex flex-col items-center justify-around border-2 rounded-md">
        <!-- <div class="flex items-center justify-center w-40 h-40"><{{ card.icon }}/></div> -->
        <h2 class="font-semibold">{{ card.title }}</h2>
        <p class="font-extralight">{{ card.description }}</p>
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
      default: () => [
        { icon: IconCode, title: 'Web Deveopment', description: 'Descrição do Card 1' },
        { icon: IconPalette, title: 'Design', description: 'Descrição do Card 2' },
      ]
    }
  }
}
</script>