module.exports = {
  tabWidth: 2,
  semi: false,
  singleQuote: false,
  trailingComma: "none",
  overrides: [
    {
      files: "*.md",
      options: {
        proseWrap: "always",
        printWidth: 100
      }
    }
  ]
}
