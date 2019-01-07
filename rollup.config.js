import pkg from './package.json';
import babel from 'rollup-plugin-babel';

export default {
    input: 'index.js',
    output: [
        {
            file: pkg.module,
            format: 'es'
        },
        {
            file: pkg.main,
            format: 'cjs'
        }
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [ babel() ] 
}