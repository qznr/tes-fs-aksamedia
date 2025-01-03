<template>
  <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:shadow-none">
    <h3 class="text-lg font-semibold mb-2 dark:text-white text-gray-900">Add Employee</h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="image" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Image URL</label>
          <input type="text" id="image" v-model="form.image" placeholder="https://i.pravatar.cc/100" class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label for="name" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Name</label>
          <input type="text" id="name" v-model="form.name" placeholder="John Doe" class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label for="phone" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
          <input type="tel" id="phone" v-model="form.phone" placeholder="123-456-7890" class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label for="division" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Division</label>
          <select id="division" v-model="form.division.name" class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600">
            <option v-for="division in divisionOptions" :key="division" :value="division">{{ division }}</option>
          </select>
        </div>
      </div>
      <div>
        <label for="position" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Position</label>
        <input type="text" id="position" v-model="form.position" placeholder="Software Engineer" class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div class="flex justify-end">
        <button type="submit" class="bg-primary hover:bg-opacity-70 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Add
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, defineEmits } from 'vue';

const emit = defineEmits(['create']);

const divisionOptions = ['Mobile Apps', 'QA', 'Full Stack', 'Backend', 'Frontend', 'UI/UX Designer'];

const form = reactive({
  id: Date.now(),
  image: '',
  name: '',
  phone: '',
  division: {
    id: Date.now(),
    name: divisionOptions[0],
  },
  position: '',
});

const handleSubmit = () => {
  emit('create', { ...form });
  form.id = Date.now();
  form.image = '';
  form.name = '';
  form.phone = '';
  form.division.id = Date.now();
  form.division.name = divisionOptions[0];
  form.position = '';
};
</script>