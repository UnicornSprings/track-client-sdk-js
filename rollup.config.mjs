export default {
    input: 'src/main.js',
    output: {
        file: 'dist/main.cjs',
        format: 'cjs',
    },
    external: ['axios'],
};
