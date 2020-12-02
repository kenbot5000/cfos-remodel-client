module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: ["@nuxtjs", "plugin:vue/recommended", "plugin:nuxt/recommended"],
  plugins: [
    "vuetify"
  ],
  // add your custom rules here
  rules: {}
};
