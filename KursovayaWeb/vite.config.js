import { defineConfig } from "vite";

export default defineConfig({
  // Указываем папку frontend как корневую для нашего сервера
  root: "./frontend",

  server: {
    port: 5173,
    open: true, // Автоматически открывать браузер при запуске
  },

  build: {
    // Папка для сборки готового проекта будет создана на уровне выше frontend
    outDir: "../dist",
    emptyOutDir: true,
  },
});
