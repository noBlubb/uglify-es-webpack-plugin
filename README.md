# Webpack2 with uglify-es as a plugin
Webpack with UglifyJs3 / Harmony for ES6 optimization. Tested with: 
- webpack 2.5.1
- uglify-es 3.0.10

## Installation
`npm install uglify-es-webpack-plugin` or `yarn add uglify-es-webpack-plugin`

## Usage
```javascript
// webpack.config.js

const UglifyEsPlugin = require('uglify-es-webpack-plugin');

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = 'source-map';

    module.exports.plugins = (module.exports.plugins || []).concat([
        new UglifyEsPlugin()
    ]);
}
```

Supports source maps using `devtool = 'source-map'` - others untested.

Make sure to not use `-p` anymore, as it will try to use the built-in UglifyJs plugin. Use 

`NODE_ENV='production' webpack --progress`
 
 or the `--env` flag to set up your webpack configuration. 

## Warning
- does not keep comments
- no caching or other optimizations
- error handling is untested and minimal
- configuration is not passed through to uglify-es, defaults are used
