<template>
  <footer class="bg-gray-800 text-white py-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-4 grid-rows-1 gap-4">
        <!-- About Section -->
        <div className="col-span-2">
          <h2 class="text-xl font-bold mb-4">About</h2>
          <p class="text-gray-400">
            This is a brief description about the portfolio or the person. You can add more details here.
            This is a brief description about the portfolio or the person. You can add more details here.
            This is a brief description about the portfolio or the person. You can add more details here.
            This is a brief description about the portfolio or the person. You can add more details here.
            {{ $t("About") }}
          </p>
        </div>
        <!-- Certifications Section -->
        <div className="col-start-3">
          <h2 class="text-xl font-bold mb-4">Certifications</h2>
          <ul class="flex flex-col  gap-1">
            <li class="">Ciencias da computacao<br/><span class="text-sm text-gray-400">5 years •••• Politecnica de goinia</span></li>
            <li class="">{{ $t("Certification1") }}<br/><span class="text-sm text-gray-400">{{ $t("CertificationDuration") }} •••• {{ $t("CertificationPlace") }}</span></li>
          </ul>
        </div>
        <!-- Contact Platforms Section -->
        <div className="col-start-4">
          <h2 class="text-xl font-bold mb-4">Contact Platforms</h2>
          <div class="flex gap-2 mt-4">
          <a class="border rounded-full p-2 bg-neutral-800 border-gray-500 hover:-translate-y-2 hover:border-white hover:bg-neutral-600 transition-all duration-500 ease-in-out" href="https://wa.me/5562981160081" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50" fill="orange">
              <path d="M25,2C12.318,2,2,12.318,2,25c0,3.96,1.023,7.854,2.963,11.29L2.037,46.73c-0.096,0.343-0.003,0.711,0.245,0.966 C2.473,47.893,2.733,48,3,48c0.08,0,0.161-0.01,0.24-0.029l10.896-2.699C17.463,47.058,21.21,48,25,48c12.682,0,23-10.318,23-23 S37.682,2,25,2z M36.57,33.116c-0.492,1.362-2.852,2.605-3.986,2.772c-1.018,0.149-2.306,0.213-3.72-0.231 c-0.857-0.27-1.957-0.628-3.366-1.229c-5.923-2.526-9.791-8.415-10.087-8.804C15.116,25.235,13,22.463,13,19.594 s1.525-4.28,2.067-4.864c0.542-0.584,1.181-0.73,1.575-0.73s0.787,0.005,1.132,0.021c0.363,0.018,0.85-0.137,1.329,1.001 c0.492,1.168,1.673,4.037,1.819,4.33c0.148,0.292,0.246,0.633,0.05,1.022c-0.196,0.389-0.294,0.632-0.59,0.973 s-0.62,0.76-0.886,1.022c-0.296,0.291-0.603,0.606-0.259,1.19c0.344,0.584,1.529,2.493,3.285,4.039 c2.255,1.986,4.158,2.602,4.748,2.894c0.59,0.292,0.935,0.243,1.279-0.146c0.344-0.39,1.476-1.703,1.869-2.286 s0.787-0.487,1.329-0.292c0.542,0.194,3.445,1.604,4.035,1.896c0.59,0.292,0.984,0.438,1.132,0.681 C37.062,30.587,37.062,31.755,36.57,33.116z"></path>
            </svg>
          </a>
          <a class="border rounded-full p-2 bg-neutral-800 border-gray-500 hover:-translate-y-2 hover:border-white hover:bg-neutral-600 transition-all duration-500 ease-in-out" href="mailto:caiomarianni@gmail.com" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50" fill="orange">
              <path d="M12 23.403V23.39 10.389L11.88 10.3h-.01L9.14 8.28C7.47 7.04 5.09 7.1 3.61 8.56 2.62 9.54 2 10.9 2 12.41v3.602L12 23.403zM38 23.39v.013l10-7.391V12.41c0-1.49-.6-2.85-1.58-3.83-1.46-1.457-3.765-1.628-5.424-.403L38.12 10.3 38 10.389V23.39zM14 24.868l10.406 7.692c.353.261.836.261 1.189 0L36 24.868V11.867L25 20l-11-8.133V24.868zM38 25.889V41c0 .552.448 1 1 1h6.5c1.381 0 2.5-1.119 2.5-2.5V18.497L38 25.889zM12 25.889L2 18.497V39.5C2 40.881 3.119 42 4.5 42H11c.552 0 1-.448 1-1V25.889z"></path>
            </svg>
          </a>
          <a class="border rounded-full p-2 bg-neutral-800 border-gray-500 hover:-translate-y-2 hover:border-white hover:bg-neutral-600 transition-all duration-500 ease-in-out" href="https://www.upwork.com/freelancers/~01e15c653dfbed2b29" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50" fill="orange">
              <path d="M 1 9 C 0.448 9 0 9.448 0 10 L 0 24.115234 C 0 30.276234 4.6829844 35.631469 10.833984 35.980469 C 16.730984 36.314469 21.747875 32.176391 22.796875 26.650391 C 23.366875 27.420391 23.94625 28.135969 24.53125 28.792969 L 21.001953 43.771484 C 20.932953 44.069484 21.002406 44.380094 21.191406 44.621094 C 21.382406 44.859094 21.670563 45 21.976562 45 L 27.095703 45 C 27.559703 45 27.959406 44.687328 28.066406 44.236328 C 28.687406 41.615328 29.660969 37.508156 30.542969 33.785156 L 31.453125 34.3125 C 33.618125 35.4335 35.815 36 38 36 C 45.192 36 50.926 29.641 49.875 22.25 C 49.179 17.354 45.414078 13.318344 40.580078 12.277344 C 34.951078 11.064344 29.525359 13.949141 27.193359 18.744141 C 27.193359 18.744141 26.934562 19.318578 26.726562 19.892578 C 25.076563 17.046578 24.107609 14.094078 23.599609 11.955078 C 23.414609 11.175078 23.137469 9.762875 23.105469 9.671875 C 22.966469 9.268875 22.589109 9 22.162109 9 L 17 9 C 16.448 9 16 9.448 16 10 L 16 24.300781 C 16 26.649781 14.287219 28.750516 11.949219 28.978516 C 9.2672187 29.240516 7 27.13 7 24.5 L 7 10 C 7 9.448 6.552 9 6 9 L 1 9 z M 38 19 C 40.757 19 43 21.243 43 24 C 43 26.757 40.757 29 38 29 C 35.775 29 33.713531 27.658281 32.269531 26.488281 C 32.796531 24.263281 33.15025 22.773047 33.15625 22.748047 C 33.72425 20.541047 35.717 19 38 19 z"></path>
            </svg>
          </a>
          <a class="border rounded-full p-2 bg-neutral-800 border-gray-500 hover:-translate-y-2 hover:border-white hover:bg-neutral-600 transition-all duration-500 ease-in-out" href="https://github.com/Caio-Marianni" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30" fill="orange">
              <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
            </svg>
          </a>
          <a class="border rounded-full p-2 bg-neutral-800 border-gray-500 hover:-translate-y-2 hover:border-white hover:bg-neutral-600 transition-all duration-500 ease-in-out" href="https://www.linkedin.com/in/caio-marianni-de-morais/" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50" fill="orange">
              <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
            </svg>
          </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
