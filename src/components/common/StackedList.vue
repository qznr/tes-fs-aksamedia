<!-- src/components/common/StackedList.vue -->
<template>
  <div class="space-y-4">
    <!-- Search and Filter Input Row -->
    <div class="flex items-center gap-2">
      <!-- Search Input -->
      <input
        v-if="searchable"
        type="text"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        placeholder="Search..."
        class="border focus:border-primary appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
      />

      <div v-if="filterable" class="flex flex-wrap gap-2">
        <!-- Filter Dropdown Buttons -->
        <div v-for="(filterCategory, column) in filterCategories" :key="column" class="relative inline-block">
          <Dropdown :contentClasses="'py-1 bg-white dark:bg-gray-800'">
            <template #trigger>
              <button class="px-2 py-2 rounded bg-primary text-white text-sm">
                <ion-icon name="filter"></ion-icon>
              </button>
            </template>
            <template #content>
                <DropdownItem
                v-for="category in (filterCategory.categories ? filterCategory.categories : filterCategory)"
                :key="category"
                @click="applyFilter(column, category)"
              >
                {{ category.name }}
              </DropdownItem>
            </template>
          </Dropdown>
        </div>
      </div>
    </div>

    <div class="flex gap-x-1">
      <button
          v-for="(filter, index) in activeFilters"
          :key="index"
          @click="removeFilter(index)"
          class="inline-flex items-center px-3 py-1 rounded bg-inbetween text-white font-bold"
        >
          {{ filter.category }}
        </button>
    </div>

    <!-- List Items -->
    <div v-if="!loading">
        <div
            v-if="displayedData.length > 0"
            v-for="item in displayedData"
            :key="item.id"
            class="bg-white dark:bg-gray-800 cursor-pointer my-2"
            :class="{ 'bg-gray-300 dark:bg-gray-600': isSelected(item) }"
            @click="selectItem(item)"
        >
          <component :is="itemComponent" :item="item" :class="{ 'bg-gray-300 dark:bg-gray-600': isSelected(item) }"/> 
          <hr v-if="showDivider" class="border-t border-gray-300 dark:border-gray-700" />
        </div>
      <div v-else class="text-center text-gray-500 dark:text-gray-400">
        {{ emptyMessage }}
      </div>

      <!-- Pagination Controls -->
       <div v-if="data.length > 0">
            <div class="px-4 py-3 bg-white border-t border-gray-200 sm:px-6 dark:bg-gray-800 dark:border-gray-700">
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
            </div>
        </div>
    </div>
     <div v-else class="flex justify-center items-center h-40">
        <ion-icon name="sync" class="animate-spin text-4xl text-gray-500 dark:text-gray-400"></ion-icon>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref, watch, defineEmits, onMounted } from 'vue';
import Dropdown from './Dropdown.vue';
import DropdownItem from './DropdownItem.vue';
import { debounce } from 'lodash-es';

const props = defineProps({
    fetchData: {
        type: Function,
        required: true
    },
    itemComponent: {
        type: Object,
        required: true,
    },
    emptyMessage: {
        type: String,
        default: 'No data available.',
    },
    showDivider: {
        type: Boolean,
        default: true,
    },
    searchable: {
        type: Boolean,
        default: false,
    },
    searchColumns: {
        type: Array,
        default: () => null, // If null, search in all columns
    },
    filterable: {
        type: Boolean,
        default: false,
    },
    filterCategories: {
        type: Object,
        default: () => ({}),
        validator: (value) => {
            return Object.values(value).every(
                (item) =>
                    Array.isArray(item) ||
                    (typeof item === 'object' &&
                        item !== null &&
                        Array.isArray(item.categories) &&
                        (item.key === undefined || typeof item.key === 'string'))
            );
        },
    },
    searchQuery: {
        type: String,
        default: ''
    },
    activeFilters: {
        type: Array,
        default: () => []
    },
    currentPage: {
        type: Number,
        default: 1
    },
    selectedItem: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['update:searchQuery', 'update:activeFilters', 'update:currentPage', 'update:selectedItem']);

const internalCurrentPage = ref(props.currentPage);
const internalSearchQuery = ref(props.searchQuery);
const internalActiveFilters = ref(props.activeFilters);
const data = ref([]);
const pagination = ref({});
const loading = ref(false);

const debouncedFetchData = debounce(async () => {
    loading.value = true;
    try {
        const params = {
            page: internalCurrentPage.value,
        };

        if (internalSearchQuery.value && props.searchColumns) {
            props.searchColumns.forEach(column => {
                params[`${column}`] = internalSearchQuery.value;
            });
        }

        internalActiveFilters.value.forEach(filter => {
            params[`${filter.column}_id`] = filter.value;
        });

        const response = await props.fetchData(params);
        data.value = response.data.employees;
        pagination.value = response.pagination;
    } catch (error) {
        console.error('Error fetching data:', error);
        data.value = [];
        pagination.value = {};
    } finally {
        loading.value = false;
    }
}, 250);

onMounted(async () => {
    await debouncedFetchData();
});

const applyFilter = (columnKey, category) => {
    const existingFilterIndex = internalActiveFilters.value.findIndex(
        (filter) => filter.column === columnKey
    );

    if (existingFilterIndex !== -1) {
        // Update existing filter
        if (internalActiveFilters.value[existingFilterIndex].value === category.id) {
            // Remove filter if the same value is clicked again
           internalActiveFilters.value.splice(existingFilterIndex, 1);
        } else {
            // Update filter value
            internalActiveFilters.value[existingFilterIndex].value = category.id;
            internalActiveFilters.value[existingFilterIndex].category = category.name;
        }
    } else {
        // Add new filter
        internalActiveFilters.value.push({
            column: columnKey,
            value: category.id,
            category: category.name,
        });
    }
    emit('update:activeFilters', internalActiveFilters.value);
};


const removeFilter = (index) => {
    internalActiveFilters.value.splice(index, 1);
      emit('update:activeFilters', internalActiveFilters.value);
};

const displayedData = computed(() => {
    return data.value;
});

const previousPage = () => {
  if (internalCurrentPage.value > 1) {
    internalCurrentPage.value--;
     emit('update:currentPage', internalCurrentPage.value)
  }
};

const nextPage = () => {
  if (internalCurrentPage.value < pagination.value.last_page) {
    internalCurrentPage.value++;
     emit('update:currentPage', internalCurrentPage.value)
  }
};

const goToPage = (page) => {
  internalCurrentPage.value = page;
    emit('update:currentPage', internalCurrentPage.value)
};


watch(() => props.searchQuery, (newVal) => {
  internalSearchQuery.value = newVal;
  internalCurrentPage.value = 1; // Reset page on search
  debouncedFetchData();
});

watch(() => props.currentPage, (newVal) => {
  internalCurrentPage.value = newVal
  debouncedFetchData();
});

watch(() => props.activeFilters, (newVal) => {
  internalActiveFilters.value = newVal
  internalCurrentPage.value = 1;
  debouncedFetchData();
}, { deep: true });

watch(internalCurrentPage, debouncedFetchData);

watch(internalSearchQuery, () => {
  emit('update:searchQuery', internalSearchQuery.value)
});


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

const refetch = async () => {
  await debouncedFetchData();
}

defineExpose({
  refetch
})
</script>