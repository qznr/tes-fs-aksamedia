<template>
  <nav class="bg-[#8072D0] dark:bg-[#3D3D7A] drop-shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <RouterLink to="/" class="font-bold text-xl text-gray-800 dark:text-white">
              UwU
            </RouterLink>
          </div>
        </div>

        <!-- Desktop view (>= 992px) -->
        <div class="hidden lg:flex items-center ml-4 lg:ml-6">
          <div class="mr-4" v-if="user">
            <span class="text-gray-900 dark:text-gray-300">Hi, {{ user.fullName || user.username }}</span>
          </div>
          <Dropdown :align="right" width="48" :contentClasses="'py-1 bg-white dark:bg-gray-800'">
            <template #trigger>
              <button class="relative rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span class="sr-only">Open user menu</span>
                <ion-icon name="person-circle-outline" class="text-2xl text-gray-900 dark:text-gray-300"></ion-icon>
              </button>
            </template>
            <template #content>
              <DropdownItem @click="goToSettings">Settings</DropdownItem>
              <DropdownItem @click="handleLogout">Logout</DropdownItem>
            </template>
          </Dropdown>
        </div>

        <!-- Mobile burger menu button (< 992px) -->
        <div class="lg:hidden">
          <button 
            @click="isMenuOpen = !isMenuOpen"
            class="p-2 rounded-md text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            <ion-icon 
              :name="isMenuOpen ? 'close-outline' : 'menu-outline'"
              class="text-2xl"
            ></ion-icon>
          </button>
        </div>
      </div>

      <!-- Mobile menu dropdown -->
      <div 
        v-show="isMenuOpen" 
        class="lg:hidden"
        :class="{ 'block': isMenuOpen, 'hidden': !isMenuOpen }"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
          <div class="px-3 py-2" v-if="user">
            <span class="text-gray-700 dark:text-gray-300">Hi, {{ user.fullName || user.username }}</span>
          </div>
          <a 
            @click="goToSettings"
            class="block px-3 py-2 rounded-md text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            Settings
          </a>
          <a 
            @click="handleLogout"
            class="block px-3 py-2 rounded-md text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '../../services/authService';
import { useRouter, RouterLink } from 'vue-router';
import { useLocalStorage } from '../../services/localStorageService';
import Dropdown from '../common/Dropdown.vue';
import DropdownItem from '../common/DropdownItem.vue';
import { computed, ref, onMounted, onUnmounted } from 'vue';

const { logout, isAuthenticated } = useAuth();
const router = useRouter();
const { getItem } = useLocalStorage();

const user = computed(() => getItem('user'));
const isMenuOpen = ref(false);

const handleResize = () => {
  if (window.innerWidth >= 992 && isMenuOpen.value) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const handleLogout = () => {
  console.log('isAuthenticated before logout:', isAuthenticated.value);
  logout();
  console.log('isAuthenticated after logout:', isAuthenticated.value);
  isMenuOpen.value = false;
};

const goToSettings = () => {
  router.push('/settings');
  isMenuOpen.value = false;
};
</script>