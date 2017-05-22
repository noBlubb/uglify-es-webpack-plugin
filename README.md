# Webpack2 with uglify-es as a plugin
Webpack with UglifyJs3 / Harmony for ES6 optimization
- webpack 2.5.1
- uglify-es 3.0.10

Supports source maps using `devtool = 'source-map'` - others untested.

## Warning
- does not keep comments
- no caching or other optimizations
- error handling is untested and minimal
- configuration is not passed through to uglifyes, defaults used