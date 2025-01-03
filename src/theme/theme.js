import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useLocalStorage } from '../services/localStorageService';

export const useTheme = () => {
  const { getItem, setItem } = useLocalStorage();
  const theme = ref(getItem('theme') || 'system');

  const updateTheme = (newTheme) => {
    theme.value = newTheme;
    setItem('theme', newTheme);
    // applyTheme(); // No need to call it here, watch effect will handle it
  };

  const applyTheme = () => {
    const html = document.documentElement;
    html.classList.remove('dark', 'light');
    if (theme.value === 'dark') {
      console.log('dark mode applied');
      html.classList.add('dark');
    } else if (theme.value === 'light') {
      html.classList.add('light');
      console.log('light mode applied')
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      html.classList.add('dark');
    }
  };

  onMounted(() => {
    applyTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
  });

  onUnmounted(() => {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', applyTheme);
  });

  // Watch for changes in the theme ref and apply the theme
  watch(theme, () => {
    applyTheme();
  }, { immediate: true }); // Apply theme on initial load as well

  return { theme, updateTheme, applyTheme };
};