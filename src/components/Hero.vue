<template>
  <div class="flex flex-col items-center justify-center text-center md:h-[500px] py-10 px-6 md:px-10 transition-all duration-1000 ease-in-out">
    <h1 class="text-text-950 dark:text-text-50 text-5xl sm:text-6xl md:text-7xl">
      {{ $t("Hero1") }} <span class="text-accent-500"> {{ $t("HeroSpan1") }} </span> {{ $t("HeroAnd") }} <span class="text-accent-500"> {{ $t("HeroSpan2") }} </span> {{ $t("Hero2") }}
    </h1>

    <p class="mt-6 mb-10 text-base sm:text-lg md:text-xl text-text-950 dark:text-text-50 opacity-40">{{ $t("HeroSub1") }}<br />{{ $t("HeroSub2") }}</p>

    <div class="flex gap-8">
      <button class="rounded-full py-2 px-4 bg-accent-500 text-text-50 shadow-2xl shadow-accent-500 hover:-translate-y-2 transition-all duration-500 ease-in-out">
        <a href="#">{{ $t("HeroBtn1") }}</a>
      </button>
      <button class="rounded-full py-2 px-4 bg-secondary-700 text-text-50 text-opacity-200">
        <a href="#">{{ $t("HeroBtn2") }}</a>
      </button>
    </div>
  </div>
</template>
