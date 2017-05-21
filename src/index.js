/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const UglifyJS = require("uglify-es");

class UglifyJsPlugin {
    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {
        compiler.plugin("compilation", (compilation) => {
            compilation.plugin("optimize-chunk-assets", (chunks, callback) => {
                for (let chunk of chunks) {
                    for (let file of chunk.files) {
                        const asset = compilation.assets[file];

                        let result = UglifyJS.minify({file: asset.source()}, this.options);
                        if (result.error) {
                            compilation.errors.push(new Error(file + " from UglifyJs\n" + JSON.stringify(result.error)));
                        } else {
                            compilation.assets[file] = {
                                source: () => result.code,
                                size: () => result.code.length
                            }
                        }
                    }
                }

                callback();
            });
        });
    }
}

module.exports = UglifyJsPlugin;