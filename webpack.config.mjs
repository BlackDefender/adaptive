import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import HtmlMinimizerPlugin from 'html-minimizer-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import path from 'path';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import browserSyncConfig from './bs-config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));


const pathEntries = (dirPath, extension, outputDirName) => {
    const points = {};
    fs.readdirSync(dirPath, { withFileTypes: true })
        .filter((dirent) => dirent.isFile())
        .forEach((dirent) => {
            const fileName = path.basename(dirent.name, extension);
            points[`${outputDirName}${path.sep}${fileName}`] = path.resolve(__dirname, dirPath + path.sep + dirent.name);
        });
    return points;
};

const stylePath = path.join('src', 'scss');
const jsPath = path.join('src', 'js');
const styleEntryPoints = pathEntries(stylePath, '.scss', 'css');
const jsEntryPoints = pathEntries(jsPath, '.js', 'js');
const entryPoints = { ...jsEntryPoints, ...styleEntryPoints };

const getConfig = () => ({
    mode: process.env.NODE_ENV,
    entry: entryPoints,
    context: path.resolve(__dirname),
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        chunkFormat: 'array-push',
    },
    stats: {
        assets: false,
        entrypoints: false,
        hash: false,
        version: false,
        modules: false,
        builtAt: true,
    },
    watchOptions: {
        aggregateTimeout: 200,
        ignored: ['node_modules/**'],
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                type: 'asset/resource',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    'css-loader',
                    'postcss-loader',
                    'resolve-url-loader',
                    'sass-loader',
                    'sass-bulk-import-loader',
                ],
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    corejs: { version: 3 },
                                    useBuiltIns: 'usage',
                                },
                            ],
                        ],
                    },
                },
            },
        ],
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/templates',
                    to: 'templates',
                    noErrorOnMissing: true,
                },
            ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new HtmlMinimizerPlugin(),
        ],
    },
});

export default (env, argv) => {
    process.env.NODE_ENV = argv.mode || 'development';
    const config = getConfig();
    if (process.env.BrowserSync === 'true' && browserSyncConfig.proxy !== 'http://domain.sample/') {
        config.plugins.push(new BrowserSyncPlugin(browserSyncConfig));
    }
    config.devtool = process.env.NODE_ENV === 'development' ? 'eval-cheap-module-source-map' : 'source-map';
    return config;
};
