<template>
  <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:shadow-none">
    <h3 class="text-lg font-semibold mb-2 dark:text-white text-gray-900">Edit Employee</h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="image" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Image URL</label>
          <input type="text" id="image" v-model="form.image" placeholder="https://i.pravatar.cc/100"
            class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label for="name" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Name</label>
          <input type="text" id="name" v-model="form.name" placeholder="John Doe"
            class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label for="phone" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
          <input type="tel" id="phone" v-model="form.phone" placeholder="123-456-7890"
            class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label for="division" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Division</label>
          <select id="division" v-model="form.division.name"
            class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600">
            <option v-for="division in divisionOptions" :key="division" :value="division">{{ division }}</option>
          </select>
        </div>
      </div>
      <div>
        <label for="position" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Position</label>
        <input type="text" id="position" v-model="form.position" placeholder="Software Engineer"
          class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div class="flex justify-between">
        <button type="button" @click="handleDelete"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Delete
        </button>
        <button type="submit"
          class="bg-primary hover:bg-opacity-70 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Update
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, defineEmits, defineProps, watch } from 'vue';

const props = defineProps({
  selectedEmployee: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update', 'delete']);

const divisionOptions = ['Mobile Apps', 'QA', 'Full Stack', 'Backend', 'Frontend', 'UI/UX Designer'];

const form = reactive({
  id: null,
  image: '',
  name: '',
  phone: '',
  division: {
    id: null,
    name: '',
  },
  position: '',
});

// Watch for changes in the selectedEmployee prop and update the form
watch(() => props.selectedEmployee, (newEmployee) => {
  if (newEmployee) {
    Object.assign(form, JSON.parse(JSON.stringify(newEmployee))); // Deep copy
  } else {
    resetForm();
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('update', { ...form });
};

const handleDelete = () => {
  emit('delete', form.id);
  resetForm();
};

const resetForm = () => {
  form.id = null;
  form.image = '';
  form.name = '';
  form.phone = '';
  form.division.id = null;
  form.division.name = '';
  form.position = '';
};
</script>