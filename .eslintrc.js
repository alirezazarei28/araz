module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
  parser: "babel-eslint",
  settings: {
    "import/resolver": {
      project: "{}",
    },
  },
};
