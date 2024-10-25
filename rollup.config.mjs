import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';
import babel from '@rollup/plugin-babel';

export default [
    {
        input: 'src/editor.jsx',
        output: [{
            file: 'dist/mediacontrols-editor.js',
            format: 'iife',
            name: 'MediaControlsEditor',
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
            file: 'dist/mediacontrols-settings.js',
            format: 'iife',
            name: 'MediaControlsSettingsr',
        }],
        plugins: [
            resolve(),
            commonjs(),
            css({ output: 'mediacontrols-settings.css' }),
        ],
    },
    {
        input: 'src/preview.js',
        output: [{
            file: 'dist/mediacontrols-preview.js',
            format: 'iife',
            name: 'MediaControlsPreviewr',
        }],
        plugins: [
            resolve(),
            commonjs(),
        ],
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
            css({ output: 'mediacontrols.css' }),
        ]
    }
];
