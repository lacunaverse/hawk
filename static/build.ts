require('esbuild')
    .build({
        entryPoints: [
            './src/scripts/index.ts',
            './src/scripts/metrics.ts',
            './src/scripts/metrics-edit.ts',
            './src/scripts/view.ts',
        ],
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
        entryPoints: ['./src/styles/index.css', './src/styles/metrics.css', './src/styles/view.css'],
        bundle: true,
        outdir: 'dist/styles/',
        minify: true,
        treeShaking: true,
        watch: true,
        keepNames: true,
    })
    .catch(() => process.exit(1));
