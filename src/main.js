import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { useTheme } from './theme/theme';

const app = createApp(App)

app.use(router)

const { applyTheme } = useTheme();
applyTheme(); // Apply initial theme

app.mount('#app')