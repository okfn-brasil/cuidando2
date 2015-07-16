({
    // include: "requirejs",
    baseUrl: ".",
    dir: "../build",
    mainConfigFile: "config.js",
    shim: {
        "app/main": ["requirejs"]
    }
})
