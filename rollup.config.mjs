import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';
import babel from '@rollup/plugin-babel';

const pluginSlug = 'mediacontrols';

export default [
    {
        input: 'src/editor.jsx',
        output: [{
            file: `dist/${pluginSlug}-editor.js`,
            format: 'iife',
            name: `${pluginSlug}Editor`,
            globals: {
                'react': 'wp.element',
                'react-dom': 'wp.element'
            }
        }],
        plugins: [
            resolve(),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                presets: ['@babel/preset-react'],
                exclude: 'node_modules/**'
            })
        ],
        external: ['react', 'react-dom'] // Exclude React from the editor bundle
    },
    {
        input: 'src/settings.js',
        output: [{
            file: `dist/${pluginSlug}-settings.js`,
            format: 'iife',
            name: `${pluginSlug}Settings`,
        }],
        plugins: [
            resolve(),
            commonjs(),
            css({ output: `${pluginSlug}-settings.css` }),
        ],
    },
    {
        input: 'src/main.js', // Frontend script entry point
        output: [{
            file: `dist/${pluginSlug}-main.js`,
            format: 'iife',
            name: `${pluginSlug}Main`,
        }],
        plugins: [
            resolve(),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                presets: ['@babel/preset-env'],
                exclude: 'node_modules/**'
            }),
            css({ output: `${pluginSlug}-main.css` }),
        ]
    }
];
