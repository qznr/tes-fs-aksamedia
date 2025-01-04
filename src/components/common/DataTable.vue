<template>
  <div class="overflow-x-auto flex flex-col h-full">
    <div class="mb-4 flex flex-col items-start">
      <div class="mb-2 flex justify-start items-center">
        <input
          type="text"
          v-model="internalSearchQuery"
          @input="handleSearch"
          placeholder="Search..."
          class="border focus:border-primary appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        />
      </div>
      <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2">
        <span
          v-for="(filter, index) in activeFilters"
          :key="index"
          @click="removeFilter(index)"
          class="inline-flex items-center px-3 py-1 rounded bg-inbetween text-white text-sm cursor-pointer"
        >
          {{ filter.category }}
        </span>
      </div>
    </div>
    <div class="overflow-y-auto flex-grow">
        <table class="min-w-full rounded-lg overflow-hidden border border-black" v-if="!loading">
        <thead class="bg-white border border-black dark:bg-gray-800 dark:border-gray-600">
            <tr>
            <th
                v-for="column in columns"
                :key="column.key"
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
            >
                <div class="flex items-center justify-between">
                <span>{{ column.label }}</span>
                <div v-if="filterableColumns.includes(column.key)">
                    <Dropdown :contentClasses="'py-1 bg-white dark:bg-gray-800'">
                    <template #trigger>
                        <button
                        @click="() => {}"
                        class="focus:outline-none"
                        >
                        <ion-icon name="filter" class="text-primary"></ion-icon>
                        </button>
                    </template>
                    <template #content>
                        <DropdownItem
                        v-for="category in filterCategories[column.key]"
                        :key="category.id"
                        @click="applyFilter(column.key, category.id, category.name)"
                        >
                        {{ category.name }}
                        </DropdownItem>
                    </template>
                    </Dropdown>
                </div>
                </div>
            </th>
            </tr>
        </thead>
        <tbody class="bg-white border border-black dark:bg-gray-800 dark:border-gray-600 cursor-pointer">
            <tr v-for="item in displayedData" :key="item.id" @click="selectItem(item)" :class="{ 'bg-gray-200 dark:bg-gray-700': isSelected(item) }">
            <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                @click.stop="selectItem(item)"
            >
                <slot :name="column.key" :item="item" :column="column">{{ item[column.key] }}</slot>
            </td>
            </tr>
            <tr v-if="data.length === 0">
            <td :colspan="columns.length" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center dark:text-gray-400">
                No data available.
            </td>
            </tr>
            <tr v-if="data.length > 0">
            <td :colspan="columns.length" class="px-4 py-3 bg-white border-t border-gray-200 sm:px-6 dark:bg-gray-800 dark:border-gray-700">
                <div class="flex justify-between items-center">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                    Previous
                    </button>
                    <button
                    @click="nextPage"
                    :disabled="currentPage === pagination.last_page"
                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                    Next
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                    <div>
                    <nav class="relative z-0 inline-flex rounded-md -space-x-px" aria-label="Pagination">
                        <button
                        @click="previousPage"
                        :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        <span class="sr-only">Previous</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        </button>
                        <button
                        v-for="page in pagination.last_page"
                        :key="page"
                        @click="goToPage(page)"
                        :class="[
                            'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600',
                            { 'z-10 bg-primary border-primary text-gray-700 dark:bg-primary dark:border-primary dark:text-white': currentPage === page },
                        ]"
                        aria-current="page"
                        >
                        {{ page }}
                        </button>
                        <button
                        @click="nextPage"
                        :disabled="currentPage === pagination.last_page"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        <span class="sr-only">Next</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                        </button>
                    </nav>
                    </div>
                </div>
                </div>
            </td>
            </tr>
        </tbody>
        </table>
        <div v-else class="flex justify-center items-center h-full">
            <ion-icon name="sync" class="animate-spin text-4xl text-gray-500 dark:text-gray-400"></ion-icon>
        </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, defineEmits, onMounted } from 'vue';
import Dropdown from './Dropdown.vue';
import DropdownItem from './DropdownItem.vue';
import { debounce } from 'lodash-es';

const props = defineProps({
  fetchData: { // The API function to fetch data
    type: Function,
    required: true
  },
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  searchColumns: {
    type: Array,
    default: () => null,
  },
  filterableColumns: {
    type: Array,
    default: () => [],
  },
  filterCategories: {
    type: Object,
    default: () => ({}),
  },
  selectedItem: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:selectedItem']);

const internalSearchQuery = ref('');
const currentPage = ref(1);
const activeFilters = ref([]);
const data = ref([]);
const pagination = ref({});
const loading = ref(false)

const debouncedFetchData = debounce(async () => {
  loading.value = true; // Set loading to true before the request
  try {
      const params = {
        page: currentPage.value,
      };

    // Add search parameters
    if (internalSearchQuery.value && props.searchColumns) {
        props.searchColumns.forEach(column => {
            params[`${column}`] = internalSearchQuery.value;
        });
    }

    // Add filter parameters
    activeFilters.value.forEach(filter => {
        params[`${filter.column}_id`] = filter.value;
    });

      const response = await props.fetchData(params);

      data.value = response.data.employees;
      pagination.value = response.pagination;

    } catch (error) {
      console.error('Error fetching data:', error);
      data.value = []; // Reset data in case of error
      pagination.value = {}; // Reset pagination info
    } finally {
        loading.value = false; // Set loading back to false after request completes
    }
}, 250);

onMounted(async () => {
  await debouncedFetchData();
});

const displayedData = computed(() => {
  return data.value;
});


// Watchers for reacting to changes
watch(currentPage, debouncedFetchData);

watch(internalSearchQuery, () => {
  currentPage.value = 1; // Reset to first page on search
  debouncedFetchData();
});

watch(activeFilters, () => {
  currentPage.value = 1; // Reset to first page on filter change
  debouncedFetchData();
}, { deep: true });

const handleSearch = () => {
  // The actual search is handled by the watcher on internalSearchQuery
};

const applyFilter = (columnKey, filterValue, filterName) => {
    const existingFilterIndex = activeFilters.value.findIndex(
        (filter) => filter.column === columnKey
    );

    if (existingFilterIndex !== -1) {
        // Update existing filter
        if (activeFilters.value[existingFilterIndex].value === filterValue) {
            // Remove filter if the same value is clicked again
            activeFilters.value.splice(existingFilterIndex, 1);
        } else {
            // Update filter value
            activeFilters.value[existingFilterIndex].value = filterValue;
            activeFilters.value[existingFilterIndex].category = filterName;
        }
    } else {
        // Add new filter
        activeFilters.value.push({
            column: columnKey,
            value: filterValue,
            category: filterName,
        });
    }
};

const removeFilter = (index) => {
  activeFilters.value.splice(index, 1);
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < pagination.value.last_page) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

const selectItem = (item) => {
  if (props.selectedItem === item) {
    emit('update:selectedItem', null);
  } else {
    emit('update:selectedItem', item);
  }
};

const isSelected = (item) => {
  return props.selectedItem && props.selectedItem.id === item.id;
};
</script>

<style scoped>
ion-icon {
  font-size: 16px;
}
</style>