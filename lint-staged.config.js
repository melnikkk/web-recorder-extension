// lint-staged.config.js
export default {
  '**/*.{js,jsx,ts,tsx,json,css,md}': (files) => {
    const filteredFiles = files.filter((file) => !file.includes('node_modules'));

    if (filteredFiles.length === 0) {
      return [];
    }
    return `npm run format`;
  },

  '**/*.{ts,tsx}': (files) => {
    const filteredFiles = files.filter((file) => !file.includes('node_modules'));

    if (filteredFiles.length === 0) {
      return [];
    }

    return 'npm run lint:types';
  },

  '**/*.{js,jsx,ts,tsx}': (files) => {
    const filteredFiles = files.filter((file) => !file.includes('node_modules'));

    if (filteredFiles.length === 0) {
      return [];
    }
    return 'npm run lint:oxc';
  },
};
