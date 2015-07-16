({
    // include: "requirejs",
    baseUrl: ".",
    dir: "../build",
    mainConfigFile: "config.js",
    shim: {
        "app/main": ["requirejs"]
    },
    modules: [
        {
            name: "app/main"
        }
    ],
    // skipDirOptimize: true
    insertRequire: ['app/main']
})
