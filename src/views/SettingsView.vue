<template>
  <div class="min-h-screen bg-white dark:bg-dark-bg py-6 flex flex-col justify-center sm:py-12 dots">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="absolute inset-0 gradient shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl glow"></div>
      <div class="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20 dark:shadow-none">
        <div class="max-w-md mx-auto">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white text-center">Edit Profile</h1>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-900 dark:text-gray-300 sm:text-lg sm:leading-7">
              <div class="space-y-1">
                <label for="fullName" class="block font-medium text-gray-900 dark:text-gray-300">Full Name</label>
                <input
                  id="fullName"
                  v-model="fullName"
                  placeholder="Ketik nama kamu"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-900 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-transparent text-gray-900 dark:text-gray-300"
                />
              </div>
              <!-- Theme Toggle Section -->
              <div class="space-y-1">
                <label for="theme" class="block font-medium text-gray-900 dark:text-gray-300">Theme</label>
                <select
                  id="theme"
                  v-model="selectedTheme"
                  @change="updateTheme(selectedTheme)"
                  class="w-full px-4 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div class="flex items-center justify-between mt-4 gap-2">
                <button
                  @click="resetLocalStorage"
                  class="bg-red-500 hover:bg-opacity-70 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Reset Data
                </button>
                <button
                  @click="saveProfile"
                  class="bg-primary hover:bg-opacity-70 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useLocalStorage } from '../services/localStorageService';
import { useRouter } from 'vue-router';
import { useTheme } from '../theme/theme'; 
import employeesData from '../assets/employees.json';

const { getItem, setItem, removeItem } = useLocalStorage();
const router = useRouter();
const { theme, updateTheme } = useTheme();

const fullName = ref('');
const selectedTheme = ref(theme.value);

onMounted(() => {
  const user = getItem('user');
  if (user && user.fullName) {
    fullName.value = user.fullName;
  }
});

const saveProfile = () => {
  const user = getItem('user');
  if (user) {
    const updatedUser = { ...user, fullName: fullName.value };
    setItem('user', updatedUser);
    router.push('/');
  }
};

const resetLocalStorage = () => {
  removeItem('employees');
  removeItem('crudState');

  window.location.href = '/'; // Force reload the app, which will reinitialize everything
};
</script>

<style scoped>
.glow {
  box-shadow: 0 0 20px 5px rgba(173, 216, 230, 0.7);
}

.dark .glow {
  box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.3);
}

.gradient {
  background-image: linear-gradient(135deg, #DE78DE, #78ABDE, #78DE78);
}
</style>