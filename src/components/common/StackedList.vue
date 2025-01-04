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
        class="bg-white dark:bg-gray-800 cursor-pointer mt-4"
        :class="{ 'bg-gray-300 dark:bg-gray-600': isSelected(item) }"
      >
        <component :is="itemComponent" :item="item" @click.stop="selectItem(item)" />
        <hr v-if="showDivider" class="border-t border-gray-300 dark:border-gray-700" />
      </div>
      <div v-else class="text-center text-gray-500 dark:text-gray-400">
        {{ emptyMessage }}
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="flex justify-center items-center text-white">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 mx-1 rounded bg-primary hover:bg-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="mx-2 text-gray-700 dark:text-gray-300">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 mx-1 rounded bg-primary hover:bg-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
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
  fetchData: { // The API function to fetch data
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
  pageSize: {
    type: Number,
    default: 5,
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

const currentPage = ref(props.currentPage);
const searchQuery = ref(props.searchQuery);
const activeFilters = ref(props.activeFilters);
const data = ref([]);
const pagination = ref({});
const loading = ref(false);


const debouncedFetchData = debounce(async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
    };

    if (searchQuery.value && props.searchColumns) {
        props.searchColumns.forEach(column => {
            params[`${column}`] = searchQuery.value;
        });
    }

    activeFilters.value.forEach(filter => {
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
    const existingFilterIndex = activeFilters.value.findIndex(
        (filter) => filter.column === columnKey
    );

    if (existingFilterIndex !== -1) {
        // Update existing filter
        if (activeFilters.value[existingFilterIndex].value === category.id) {
            // Remove filter if the same value is clicked again
            activeFilters.value.splice(existingFilterIndex, 1);
        } else {
            // Update filter value
            activeFilters.value[existingFilterIndex].value = category.id;
            activeFilters.value[existingFilterIndex].category = category.name;
        }
    } else {
        // Add new filter
        activeFilters.value.push({
            column: columnKey,
            value: category.id,
            category: category.name,
        });
    }
};


const removeFilter = (index) => {
  activeFilters.value.splice(index, 1);
  emit('update:activeFilters', activeFilters.value);
};


const totalPages = computed(() => Math.ceil(data.value.length / props.pageSize));

const displayedData = computed(() => {
    const startIndex = (currentPage.value - 1) * props.pageSize;
    const endIndex = startIndex + props.pageSize;
    return data.value.slice(startIndex, endIndex);
});

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    emit('update:currentPage', currentPage.value)
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    emit('update:currentPage', currentPage.value)
  }
};

watch(() => props.searchQuery, (newVal) => {
  searchQuery.value = newVal;
});

watch(currentPage, debouncedFetchData);

watch(activeFilters, () => {
   currentPage.value = 1;
    debouncedFetchData();
}, { deep: true });


watch(() => props.activeFilters, (newVal) => {
    activeFilters.value = newVal;
  }, { deep: true });
  
watch(() => props.currentPage, (newVal) => {
    currentPage.value = newVal;
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

</script>

<style scoped>
ion-icon {
  font-size: 16px;
}
</style>