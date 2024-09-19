<template>
  <div class="flex flex-col items-center justify-center gap-10 w-full mt-6 lg:mt-3">
    <!-- Title -->
    <h1 class="text-4xl">Web Projects</h1>
    <!-- Card Container -->
    <div class="flex flex-wrap flex-col md:flex-row justify-evenly gap-4 w-full px-5">
      <!-- Card -->
      <div v-for="(card, index) in cards" :key="index" class="flex flex-col lg:flex-row items-center border-2 rounded-md">
        <!-- Part1 (cover, heading and icons) -->
         <div class="flex flex-col">
          <!-- Clicked cover -->
          <div class="relative group overflow-hidden">
            <a :href="card.link" class="absolute h-full w-full text-center place-content-center text-xl bg-containerColor opacity-0 hover:opacity-90 hover:text-LittleDetailAction transition-all duration-500 z-10">access project</a>
            <img :src="card.cover" alt="project_cover" class="w-full h-aut0 object-cover group-hover:scale-110 transition-all duration-500 z-0">
          </div>
          <!-- Heading -->
          <div class="flex">
            <h2 class="font-semibold">{{ card.title }}</h2>
          </div>
        </div>
        <!-- Part2 (description and button)-->
         <div class="h-20 p-20">
           <p class="font-extralight">{{ card.description }}</p>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectVictorLou from "../assets/projects/CoverVictorLou.webp"

export default {
  components: { ProjectVictorLou },
  props: {
    cards: {
      default: () => [
        { cover: ProjectVictorLou,
          title: 'Victor Lou Landing page', 
          link: 'https://victorlou-landing-page.vercel.app', 
          description: 'Descrição do Card 1' 
        },
      ]
    }
  }
}
</script>