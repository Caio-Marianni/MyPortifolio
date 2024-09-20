<template>
  <div class="mt-24 lg:mt-0 p-5 bg-containerColor border-borderColor lg:border">
    <!-- Heading -->
    <h1 class="mb-2 text-xl font-bold text-[#ffffff]">Places to contact me :</h1>
    <!-- Content Container -->
    <!-- Icons Container -->  
    <div class="flex gap-3">
      <div v-for="(icon, index) in socials[0].icons" :key="index" class="content-center w-10 h-auto opacity-70 hover:opacity-100 hover:scale-110">
        <a :href="socials[0].link[index]" target="_blank" rel="noopener noreferrer">
          <component :is="icon" class="w-10" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import IconEmail from '../components/icons/IconEmail.vue';
import IconUpWork from '../components/icons/IconUpWork.vue';
import IconLinkedin from '../components/icons/IconLinkedin.vue';
import IconSoundCloud from '../components/icons/IconSoundCloud.vue';

export default {
  components: { 
    IconLinkedin, 
    IconUpWork,
    IconEmail, 
  },
  props: {
    socials: {
      type: Array,
      default: () => [
        { 
          icons: [
            IconUpWork,
            IconLinkedin,
            IconSoundCloud,
            IconEmail,
          ], 
          link: [
            'https://www.upwork.com/freelancers/~01e15c653dfbed2b29',
            'https://www.linkedin.com/in/caio-marianni-de-morais/',
            'https://soundcloud.com/cmarianni',
          ]
        }
      ]
    },
  }
}
</script>