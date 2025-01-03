<template>
    <div class="flex items-center py-2">
        <img :src="item.image" alt="Employee Image" class="w-10 h-10 rounded-full mr-3">
      <div class="flex-1 min-w-0 flex items-center justify-between">
        <div>
            <h4 class="font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</h4>
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
</script>

<style scoped>

</style>