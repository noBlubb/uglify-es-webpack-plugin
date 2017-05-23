/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Authors
 - Tobias Koppers @sokra
 - Raffael Stahl  @noBlubb
 */

const UglifyEs = require('uglify-es');
const RawSource = require("webpack-sources").RawSource;
const SourceMapSource = require("webpack-sources").SourceMapSource;

class UglifyEsPlugin {
    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {
        compiler.plugin('compilation', (compilation) => {
                const withSourceMap = compilation.options.devtool !== false;

                compilation.plugin('optimize-chunk-assets', (chunks, callback) =>
                    UglifyEsPlugin.optimize(compilation, chunks, callback, withSourceMap)
                );
            }
        );
    }

    static optimize(compilation, chunks, callback, withSourceMap) {
        for (let chunk of chunks) {
            for (let file of chunk.files) {
                const asset = compilation.assets[file];
                const [source, map] = UglifyEsPlugin.extract(asset, withSourceMap);
                const result = UglifyEsPlugin.process(file, source, withSourceMap);

                if (result.error) {
                    compilation.errors.push(UglifyEsPlugin.exception(file, result.error));
                } else {
                    if (withSourceMap) {
                        compilation.assets[file] = new SourceMapSource(result.code, file, result.map, source, map);
                    } else {
                        compilation.assets[file] = new RawSource(result.code);
                    }
                }
            }
        }

        callback();
    }

    /**
     * Extract source and optional source map from the asset
     *
     * @see https://github.com/webpack/webpack-sources#sourceandmap
     *
     * @param {Object}  asset
     * @param {Boolean} withSourceMap
     * @returns {Array}
     */
    static extract(asset, withSourceMap) {
        if (!withSourceMap) {
            return [asset.source(), undefined];
        }

        if (asset.sourceAndMap) {
            const sourceAndMap = asset.sourceAndMap();
            return [sourceAndMap.source, JSON.stringify(sourceAndMap.map)];
        } else {
            return [asset.source(), JSON.stringify(asset.map())];
        }
    }

    /**
     * Pass a file through UglifyEs
     *
     * @param {String}  filename      filename
     * @param {String}  source        content of the file
     * @param {Boolean} withSourceMap enable sourcemap output
     * @returns {Object}
     */
    static process(filename, source, withSourceMap) {
        const options = withSourceMap ? {sourceMap: {filename, root: ''}} : {};

        return UglifyEs.minify({[filename]: source}, options);
    }

    /**
     * Transform UglifyEs errors for webpack (maybe not even required?)
     *
     * @param file
     * @param uglyError
     */
    static exception(file, uglyError) {
        const error = new Error(
            `UglifyEsPlugin - ${file}\n` +
            JSON.stringify(uglyError)
        );

        error.name = 'UglifyEsProcessingError';

        return error;
    }
}

module.exports = UglifyEsPlugin;