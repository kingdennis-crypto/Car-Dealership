/** @type {import('@types/tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  content: [
    // Or if using `src` directory:
    './src/**/*.{ts,tsx}',
    './public/**/*.html',
    './node_modules/flowbite-react/**/*.js',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}
