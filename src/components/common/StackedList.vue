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

      <div v-if="filterable && Object.keys(filterCategories).length > 0" class="flex flex-wrap gap-2">
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
                 {{ category }}
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
</template>

<script setup>
import { defineProps, computed, ref, watch, defineEmits, onBeforeMount } from 'vue';
import Dropdown from './Dropdown.vue';
import DropdownItem from './DropdownItem.vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [],
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

const applyFilter = (columnKey, category) => {
  const filterExists = activeFilters.value.some(
    (filter) => filter.column === columnKey && filter.category === category
  );
  if (!filterExists) {
    activeFilters.value = [...activeFilters.value, { column: columnKey, category }];
    emit('update:activeFilters', activeFilters.value);
  }
};

const removeFilter = (index) => {
  activeFilters.value.splice(index, 1);
  emit('update:activeFilters', activeFilters.value);
};

const clearFilters = () => {
  activeFilters.value = [];
  emit('update:activeFilters', activeFilters.value);
};

const filteredDataBeforeSearch = computed(() => {
  if (activeFilters.value.length === 0) {
    return props.data;
  }
  return props.data.filter(item =>
    activeFilters.value.some(filter => {
      const filterConfig = props.filterCategories[filter.column];
      let itemValue;

      if (Array.isArray(filterConfig)) {
        // Simple filtering on a direct property
        itemValue = item[filter.column];
      } else if (typeof filterConfig === 'object' && filterConfig !== null && filterConfig.key) {
        // Filtering on a nested property
        const keys = filterConfig.key.split('.');
        itemValue = keys.reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), item);
      } else {
        // Fallback or error handling if the configuration is unexpected
        itemValue = item[filter.column];
      }

      return itemValue === filter.category;
    })
  );
});

const filteredData = computed(() => {
  if (!searchQuery.value) {
    return filteredDataBeforeSearch.value;
  }
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return filteredDataBeforeSearch.value.filter(item => {
    const columnsToSearch = props.searchColumns || Object.keys(item);
    return columnsToSearch.some(key => {
      const value = item[key];
      return value !== null && value !== undefined && value.toString().toLowerCase().includes(lowerCaseQuery);
    });
  });
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / props.pageSize));

const displayedData = computed(() => {
  const startIndex = (currentPage.value - 1) * props.pageSize;
  const endIndex = startIndex + props.pageSize;
  return filteredData.value.slice(startIndex, endIndex);
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