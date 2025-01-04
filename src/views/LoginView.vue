<template>
  <div class="min-h-screen bg-white dark:bg-dark-bg dots">
    <div class="min-h-screen flex items-center justify-center">

      <!-- Card Container (Desktop/Tablet) -->
      <div v-if="!isMobile" class="relative rounded-xl shadow-lg backdrop-blur-md max-w-4xl w-full mx-auto my-16 gradient dark:bg-white glow">
        <div class="flex sm:block md:flex">
          <div class="w-full md:w-1/2 p-8">
            <h3 class="text-2xl font-bold text-gray-900 text-center mb-4">Login Here!</h3>
            <LoginForm @submit="handleLogin" />
            <!-- Alert Message -->
            <div v-if="loginError" class="mt-4">
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline">&nbsp;{{ loginErrorMessage }}</span>
              </div>
            </div>
          </div>

          <!-- Overlapping Card (Desktop/Tablet) -->
          <div v-if="!isMobile" class="absolute overflow-hidden rounded-3xl z-10 -top-20 right-14 h-[480px] w-[360px] translate-x-1 skew-x-[-20deg] flex items-center justify-center shadow-2xl">
            <img src="../assets/Light_Cone_Incessant_Rain_Artwork.jpg" alt="Silver Wolf Image" class="skew-x-[20deg] object-cover transform scale-[145%]">
          </div>
        </div>
      </div>

      <!-- Form Only (Mobile) -->
      <div v-else class="w-full px-6 sm:px-12">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">Login Here!</h3>
        <LoginForm @submit="handleLogin" />
        <!-- Alert Message -->
        <div v-if="loginError" class="mt-4">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">&nbsp;{{ loginErrorMessage }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LoginForm from '../components/auth/LoginForm.vue';
import { useAuth } from '../services/authService';

const { login } = useAuth();

const loginError = ref(false);
const loginErrorMessage = ref('');

const handleLogin = async ({ username, password }) => {
  loginError.value = false;
  loginErrorMessage.value = '';

  const result = await login(username, password);

  if (result && result.success === false) {
      loginError.value = true;
      loginErrorMessage.value = result.error; // Set the error message from the result
  }
};

const isMobile = ref(false);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 992; // Adjust breakpoint as needed
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<style scoped>
.gradient {
  background-image: linear-gradient(135deg, white 50%, #DE78DE, #78ABDE, #78DE78);
}

.glow {
  box-shadow: 0 0 20px 5px rgba(173, 216, 230, 0.7); /* Light Blue glow */
}

.dark .glow {
  box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.3); /* White glow in dark mode */
}

/* Tablet Specific Styles */
@media (min-width: 992px) and (max-width: 1023px) {
  .bg-white {
    background: none;
  }

  .dark .bg-white {
    background: none;
  }

  .glow {
    box-shadow: 0 0 15px 4px rgba(173, 216, 230, 0.6); /* Slightly less intense glow on tablet */
  }
  
  .dark .glow {
    box-shadow: 0 0 15px 4px rgba(255, 255, 255, 0.25);
  }
}
</style>