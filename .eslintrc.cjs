module.exports = {
  root: true,
  extends: ["expo"],
  overrides: [
    {
      files: [
        "**/__tests__/**/*.{js,jsx}",
        "**/*.{spec,test}.{js,jsx}",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
