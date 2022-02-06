module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: {
          version: "3.21.0",
          proposals: true
        },
        targets: {
          node: "16",
          esmodules: true
        },
        modules: false
      }
    ]
  ]
}
