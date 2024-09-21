import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';
import babel from '@rollup/plugin-babel';

export default [
    {
        input: 'src/editor.jsx', // Editor script entry point
        output: [{
            file: 'dist/editor.js',
            format: 'iife',
            name: 'CustomAttributeEditor',
            globals: {
                'react': 'wp.element', // Use WordPress' React version
                'react-dom': 'wp.element' // Adjust if necessary
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
        input: 'src/index.js', // Frontend script entry point
        output: [{
            file: 'dist/mediacontrols.js',
            format: 'iife',
            name: 'mediacontrolsFrontend'
        }],
        plugins: [
            resolve(),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                presets: ['@babel/preset-env'],
                exclude: 'node_modules/**'
            }),
            css({ output: 'mediacontrols.css' }), // Correct path for CSS output
        ]
    }
];
