module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: {
          version: "3.19.1",
          proposals: true
        },
        targets: {
          node: "14",
          esmodules: true
        },
        modules: false
      }
    ]
  ]
}
