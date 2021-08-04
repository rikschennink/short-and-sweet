import { babel } from '@rollup/plugin-babel';
import license from 'rollup-plugin-license';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const isProduction = !process.env.ROLLUP_WATCH;

const pkg = require('./package.json');
const banner = `
${pkg.name} v${pkg.version} - ${pkg.description}
Copyright (c) ${new Date().getFullYear()} ${pkg.author}
`;

const config = {
    watch: {
        clearScreen: false,
    },

    input: 'src/short-and-sweet.js',

    output: [
        {
            format: 'esm',
            sourcemap: false,
            plugins: isProduction ? [terser()] : [],
            file: 'dist/short-and-sweet.module.js',
        },
        {
            sourcemap: false,
            format: 'umd',
            name: 'shortAndSweet',
            plugins: isProduction ? [terser()] : [],
            file: 'dist/short-and-sweet.min.js',
        },
    ],
    plugins: [
        babel({
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env'],
        }),
        isProduction && license({ banner }),
        !isProduction && serve(),
        !isProduction &&
            livereload({
                watch: 'dist',
            }),
    ],
};

export default config;
