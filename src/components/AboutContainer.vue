<script setup>
import BorderEffect from "./BorderEffect.vue";
import InfoTemplate from "./InfoTemplate.vue";
import IconDocument from "./icons/IconDocumentation.vue";
</script>
<template>
  <div class="text-[#ffffff] relative flex flex-col justify-between mt-24 lg:mt-3 px-5 pb-5 w-full lg:max-w-[350px] h-auto border-b lg:border lg:border-borderColor bg-containerColor">
    <!-- Cover and Info -->
    <div class="flex flex-col md:flex-row-reverse lg:flex-col justify-between items-center pt-10 lg:pt-5">
      <!-- Cover -->
      <div class="relative w-60 h-60 mb-5">
        <img class="flex object-contain rounded-lg" src="../assets/Profile.webp" alt="">
        <!-- <img class="absolute top-0 w-32 h-32" src="../assets/LogoOrange.webp" alt=""> -->
      </div>
      <!-- Info -->
      <div class="flex flex-col flex-wrap justify-between gap-2">
        <InfoTemplate>
          <template #title>Name</template>
          <template #text>Caio Marianni</template>
        </InfoTemplate>
        <InfoTemplate>
          <template #title>Occupation</template>
          <template #text>Web Developer / Designer</template>
        </InfoTemplate>
        <InfoTemplate>
          <template #title>Nacionality</template>
          <template #text>Brazilian</template>
        </InfoTemplate>
      </div>
    </div>
    <!-- Buttom -->
    <div class="flex items-center justify-center gap-4 mt-5 w-full ">
      <a href="" class="flex justify-center items-center px-14 w-22 h-10 text-lg border-2 border-borderColor hover:border-[#ffffff] hover:bg-LittleDetail hover:text-[#000000] rounded-full transition-all">Hire me</a>
      <a href="" class="flex justify-center items-center w-10 h-10 border-2 border-borderColor hover:border-[#ffffff] hover:bg-LittleDetail rounded-full transition-all"><IconDocument/></a>
    </div>
    <!-- Border just when is LG view -->
    <div class="hidden lg:flex">
      <BorderEffect />
    </div>
  </div>
</template>
