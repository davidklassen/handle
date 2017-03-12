import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import ejs from 'ejs';
import MemFS from 'memory-fs'
import es2015preset from 'babel-preset-es2015';
import stage0preset from 'babel-preset-stage-0';
import transformRuntime from 'babel-plugin-transform-runtime';
import transformRegenerator from 'babel-plugin-transform-regenerator';
import asyncFuncs from 'babel-plugin-syntax-async-functions';
import asyncToGenerator from 'babel-plugin-transform-async-to-generator';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import {walk} from "./utils/walk";
import settings from './settings';
// FIXME: see https://github.com/webpack/loader-utils/issues/56 should be removed after babel-loader fixes this issue
process.noDeprecation = true;


const wrapper = path.join(__dirname, 'wrapper.tpl.js');


export default async (service) => {
    return new Promise((resolve, reject) => ejs.renderFile(wrapper, { path: service.src, accountId: settings.accountId }, (err, str) => {
        if (err) {
            return reject(err);
        }

        const entry = `./_wrapper.${service.name}.js`;

        const plugins = [];

        if (service.include) {
            plugins.push(new CopyWebpackPlugin(service.include));
        }

        fs.writeFileSync(entry, str);

        const compiler = webpack({
            target: 'node',
            externals: {
                'aws-sdk': 'aws-sdk',
                'handle': 'handle-externals'
            },
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        loader: 'babel-loader',
                        exclude: [/node_modules/],
                        query: {
                            presets: [es2015preset, stage0preset],
                            plugins: [
                                transformRuntime,
                                transformRegenerator,
                                asyncFuncs,
                                asyncToGenerator
                            ]
                        }
                    }
                ]
            },
            entry: entry,
            output: {
                path: '/',
                filename: 'index.js',
                libraryTarget: 'commonjs2'
            },
            plugins,
            resolve: {
                modules: ["node_modules", __dirname + '/../node_modules']
            },
            resolveLoader: {
                modules: ["web_loaders", "web_modules", "node_loaders", "node_modules", __dirname + '/../node_modules']
            }
        });

        compiler.outputFileSystem = new MemFS();

        compiler.run((err, stats) => {
            if (err) {
                fs.unlinkSync(entry);
                return reject(err);
            }

            const jsonStats = stats.toJson();

            if (jsonStats.errors.length > 0) {
                fs.unlinkSync(entry);
                return reject(stats.toString({
                    chunks: false,
                    colors: true
                }));
            }

            fs.unlinkSync(entry);

            const files = walk('/', compiler.outputFileSystem);

            const res = files.reduce((m, el) => {
                m[el] = compiler.outputFileSystem.readFileSync(el);

                return m;
            }, {});

            resolve(res);
        });
    }));
};
