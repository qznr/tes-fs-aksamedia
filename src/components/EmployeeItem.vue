<template>
  <div class="flex items-center py-2 px-4">
    <img
      v-if="formatImageUrl(item.image)"
      :src="formatImageUrl(item.image)"
      alt="Employee Image"
      class="w-10 h-10 rounded-full mr-3"
    />
    <ion-icon v-else name="person-circle-outline" class="w-10 h-10 text-gray-400 mr-3"></ion-icon>
    <div class="flex-1 min-w-0 flex items-center justify-between">
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white truncate break-words">
          {{ item.name }}
        </h4>
        <div class="text-sm text-gray-600 dark:text-gray-400 truncate">
          {{ item.phone }}
        </div>
      </div>
      <div class="flex flex-col items-end space-y-1 text-sm text-gray-600 dark:text-gray-400 truncate">
        <div class="whitespace-nowrap">{{ item.division.name }}</div>
        <div class="whitespace-nowrap">{{ item.position }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const formatImageUrl = (imageUrl) => {
  if (imageUrl && imageUrl.startsWith('/storage')) {
    return `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;
  }
  return imageUrl;
};
</script>

<style scoped>
</style>