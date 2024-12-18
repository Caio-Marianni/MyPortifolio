<template>
  <nav class="flex flex-col gap-2">
      <a
        href="#home"
        class="text-base font-normal text-gray-400 focus:text-[#ff5404] transition-all duration-200 cursor-pointer"
      >
        {{ $t("nav1") }}
      </a>
      <a
        href="#aboutMe"
        class="text-base font-normal text-gray-400 focus:text-[#ff5404] transition-all duration-200 cursor-pointer"
      >
        {{ $t("nav2") }}
      </a>
      <a
        href="#skiils"
        class="text-base font-normal text-gray-400 focus:text-[#ff5404] transition-all duration-200 cursor-pointer"
      >
        {{ $t("nav3") }}
      </a>
      <a
        href="#projects"
        class="text-base font-normal text-gray-400 focus:text-[#ff5404] transition-all duration-200 cursor-pointer"
      >
        {{ $t("nav4") }}
      </a>
      <a
        href="#contact"
        class="text-base font-normal text-gray-400 focus:text-[#ff5404] transition-all duration-200 cursor-pointer"
      >
        {{ $t("nav5") }}
      </a>
  </nav>
</template>