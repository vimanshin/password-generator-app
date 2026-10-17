import path from 'node:path';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

const fontExtensions = ['eot', 'otf', 'ttf', 'woff', 'woff2'];
const imageExtensions = [
  'avif',
  'gif',
  'ico',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'webp',
];

// Тип: описание файла, которое Rolldown передаёт в assetFileNames.
// Описываем только поле, которое реально читаем: TypeScript проверяет форму,
// а не имя типа, и сам сверит это описание с настоящим типом Rolldown.
type AssetInfo = {
  names: string[];
};

// Функция: определяет папку для каждого собранного asset
// Принимает: информацию о файле от Vite
// Возвращает: шаблон итогового пути внутри dist
const getAssetOutputPath = (assetInfo: AssetInfo): string => {
  // ?? '' нужен из-за noUncheckedIndexedAccess: индекс массива даёт string | undefined.
  const assetName = assetInfo.names[0] ?? '';
  const assetExtension = path.extname(assetName).slice(1).toLowerCase();

  if (fontExtensions.includes(assetExtension)) {
    return 'assets/fonts/[name]-[hash][extname]';
  }

  if (imageExtensions.includes(assetExtension)) {
    return 'assets/images/[name]-[hash][extname]';
  }

  if (assetExtension === 'css') {
    return 'assets/css/[name]-[hash][extname]';
  }

  return 'assets/[name]-[hash][extname]';
};

export default defineConfig({
  // Базовый путь сайта. Для деплоя в подпапку (например, GitHub Pages)
  // поменяйте на '/имя-репозитория/' — иначе ссылки вида /icons.svg не найдутся.
  base: '/password-generator-app/',

  plugins: [ViteImageOptimizer()],

  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },

  build: {
    // Не превращаем маленькие изображения в base64 внутри CSS или JavaScript.
    assetsInlineLimit: 0,

    rolldownOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: getAssetOutputPath,
      },
    },
  },
});
