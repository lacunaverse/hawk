require('esbuild')
    .build({
        entryPoints: ['./src/index.ts', './src/metrics.ts'],
        bundle: true,
        outdir: 'dist/scripts/',
        minify: true,
        sourcemap: true,
        treeShaking: true,
        watch: true,
        keepNames: true,
    })
    .catch(() => process.exit(1));

require('esbuild')
    .build({
        entryPoints: ['./src/index.css'],
        bundle: true,
        outdir: 'dist/styles/',
        minify: true,
        treeShaking: true,
        watch: true,
        keepNames: true,
    })
    .catch(() => process.exit(1));
