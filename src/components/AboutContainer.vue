<script>
import BorderEffect from "./BorderEffect.vue";
import InfoTemplate from "./InfoTemplate.vue";
import IconDocument from "./icons/IconDocumentation.vue";

export default {
  components: { BorderEffect, InfoTemplate, IconDocument },
  methods: {
    openWhatsApp() {
      const phoneNumber = '5562981160081';
      const message = encodeURIComponent(`Hello, I came across your website.\n\nname:\nregion/language:\nsubject:`);
      const url = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(url, '_blank');
    }
  }
};

</script>
<template>
  <div class="text-[#ffffff] relative flex flex-col justify-between mt-24 lg:mt-3 px-5 pb-5 w-full lg:max-w-[350px] h-auto border-b border-borderColor border-opacity-20 lg:border lg:border-borderColor bg-containerColor" >
    <!-- Cover and Info -->
    <div class="flex flex-col md:flex-row-reverse lg:flex-col justify-between items-center pt-10 lg:pt-5">
      <!-- Cover -->
      <div class="relative w-60 h-60 mb-5 rounded-lg shadow-md shadow-[#1e383c] overflow-hidden">
        <img class="flex object-contain w-60 h-60" src="../assets/Profile.webp" alt="">
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
      <div @click="openWhatsApp" class="flex justify-center items-center px-14 lg:w-full h-10 text-lg border-2 hover:text-LittleDetailAction hover:border-borderColor border-[#ffffff] bg-LittleDetail hover:bg-tranparent text-[#ffffff] cursor-pointer rounded-full transition-all duration-300">Hire me</div>
      <a href="/Curriculo.pdf" class="flex justify-center items-center w-20 lg:w-28 h-10 border-2 border-borderColor hover:border-[#ffffff] hover:bg-LittleDetail rounded-full transition-all" download="Document">CV<IconDocument/></a>
    </div>
    <!-- Border just when is LG view -->
    <div class="hidden lg:flex">
      <BorderEffect />
    </div>
  </div>
</template>
