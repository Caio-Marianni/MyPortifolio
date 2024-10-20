<template>
  <div class="flex flex-col gap-6 text-[#c1c1c1]">
    <!-- Passe as props corretamente para o ContactDisplay -->
    <ContactDisplay :badges="badges" />
  </div>
</template>

<script setup lang="ts">
import ContactDisplay from '../components/utils/ContactDisplay.vue';

const badges = [
  {
    name: "WhatsApp",
    link: "https://wa.me/5562981160081",
    icon: "https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white",
  },
  {
    name: "GitHub",
    link: "https://github.com/Caio-Marianni",
    icon: "https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white",
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/caiomarianni/",
    icon: "https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white",
  },
  {
    name: "Linkedin",
    link: "https://www.linkedin.com/in/caio-marianni-de-morais/",
    icon: "https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white",
  },
  {
    name: "Up Work",
    link: "https://www.upwork.com/freelancers/~01e15c653dfbed2b29",
    icon: "https://img.shields.io/badge/UpWork-6FDA44?style=for-the-badge&logo=Upwork&logoColor=white",
  },
  {
    name: "Sound Cloud",
    link: "https://soundcloud.com/cmarianni",
    icon: "https://img.shields.io/badge/SoundCloud-FF3300?style=for-the-badge&logo=soundcloud&logoColor=white",
  },
  {
    name: "Vercel",
    link: "https://vercel.com/caiomariannis-projects",
    icon: "https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white",
  },
  {
    name: "Stackflow",
    link: "https://stackoverflow.com/users/23487177/caio",
    icon: "https://img.shields.io/badge/Stack_Overflow-FE7A16?style=for-the-badge&logo=stack-overflow&logoColor=white",
  },
];
</script>
