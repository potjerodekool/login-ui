module.exports = {
  mount: {
    public: '/',
    src: '/_dist_/',
  },
  plugins: [
    '@snowpack/plugin-vue',
    '@snowpack/plugin-vue/plugin-tsx-jsx.js',
    '@snowpack/plugin-dotenv',
  ],
  devOptions: {
    /* ... */
    hostname: '192.168.178.59'
  },
  buildOptions: {
    /* ... */
    baseUrl: '/login'
  },
  alias: {
    /* ... */
  },
};
