module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: {
          version: 3,
          proposals: true
        },
        targets: {
          node: "14"
        },
        modules: false
      }
    ]
  ],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          test: "./test",
          src: "./src",
          packageJson: "./package.json"
        }
      }
    ]
  ]
}
