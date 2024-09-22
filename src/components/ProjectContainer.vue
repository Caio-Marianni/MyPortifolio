<template>
  <div class="flex flex-col items-center justify-center gap-10 w-full mt-6 lg:mt-3 pb-10">
    <!-- Title -->
    <h1 class="text-4xl">Web Projects</h1>
    <!-- Card Container -->
    <div class="flex flex-wrap flex-col lg:flex-row justify-evenly gap-8 w-full px-5">
      <!-- Card -->
      <div v-for="(card, index) in cards" :key="index" class="flex flex-col lg:flex-row items-center max-w-[1000px] border border-containerColorSecondary rounded-md overflow-hidden shadow-md shadow-cardColorShadow">
        <!-- Part1 (cover, heading and icons) -->
        <div class="flex flex-col lg:w-1/2 lg:border-r">
          <!-- Clicked cover -->
          <div class="relative group overflow-hidden h-auto md:h-[350px] lg:h-full">
            <a :href="card.link" target="_blank" class="absolute h-full w-full text-center place-content-center text-xl bg-containerColor opacity-0 hover:opacity-90 hover:text-LittleDetailAction transition-all duration-500 z-10">access project</a>
            <img :src="card.cover" alt="project_cover" class="w-full h-aut0 object-cover group-hover:scale-110 transition-all duration-500 z-0">
          </div>
          <!-- Heading -->
          <div class="flex items-center justify-between px-5 py-1 border-t border-b lg:border-t lg:border-b-none bg-cardColorSec">
            <!-- Title -->
            <h2 class="font-semibold text-base md:text-xl">{{ card.title }}</h2>
            <!-- Icons -->
            <div class="flex justify-end gap-1 w-20 opacity-70">
              <div v-for="(icon, iconIndex) in card.icons" :key="iconIndex">
                <component :is="icon" class="w-8" />
              </div>
            </div>
          </div>
        </div>
        <!-- Part2 (description and button)-->
         <div class="flex flex-col justify-between items-start w-full h-full lg:w-1/2 p-4 bg-cardColor">
           <p class="font-extralight opacity-70">{{ card.description }}</p>
           <a :href="card.link" target="_blank" class="text-center mt-5 px-4 py-1 text-LittleDetailAction border-2 border-borderColor hover:border-[#ffffff] hover:text-[#ffffff] bg-containerColorSecondary hover:bg-LittleDetail rounded-full transition-all duration-300">access project</a>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconVue from "./icons/IconVue.vue";
import IconTailWind from "./icons/IconTailWind.vue";
import IconFigma from "./icons/IconFigma.vue";
import IconVercel from "./icons/IconVercel.vue";
import ProjectVictorLou from "../assets/projects/CoverVictorLou.webp"

export default {
  components: { ProjectVictorLou, IconVue, IconTailWind, IconFigma, IconVercel },
  props: {
    cards: {
      default: () => [
        { cover: ProjectVictorLou,
          icons: [IconVue, IconTailWind, IconVercel, IconFigma], 
          title: 'Victor Lou Landing page',
          link: 'https://victorlou-landing-page.vercel.app', 
          description: 'Coded with Tailwind CSS and Vue, this redesign for Victor Lou landing page focuses on creating a distinct visual identity that reflects his style while keeping users engaged. The design is fresh, intuitive, and balances creativity with functionality, ensuring a captivating user experience that aligns with his artistic vision.' 
        },
      ]
    }
  }
}
</script>