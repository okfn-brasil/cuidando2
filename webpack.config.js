var webpack = require('webpack')

function getConfig() {
    var env = process.env.CONFIG_FILE_ENV
    var configFile = ''
    if (env) {
        configFile = 'config_' + env + '.js'
    } else {
        configFile = 'config.js'
    }
    console.log("Using this config file: ", configFile)
    return __dirname + '/configs/' + configFile
}

module.exports = {
    cache: true,
    resolve: { alias: {config: getConfig(),
                       assets: __dirname + '/assets/'} },
    entry: {
      app: './src/index.js',
      vendor: './src/vendor.js',
    },
    output: {
        path: './dist/',
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            // { test: /\.png$/, include: /assets/, loader: "file" },
            { test: /\.png$/, include: /node_modules/, loader: "file" },
            // { test: /\.(png|otf|svg)$/, loader: "file" },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.scss$/, include: /src/, loader: 'style!css!sass' },
            { test: /\.sass$/, include: /src/, loader: 'style!css!sass?indentedSyntax' },
            { test: /\.html$/, include: /src/, loader: 'riotjs' },
            { test: /\.js$/,
              exclude: /\.es5\.js$/,
              // include: /src/,
              include: [ /configs/, /src/ ],
              loader: 'babel',
              query: {
                  modules: 'common',
                  // loose: ['es6.classes'],
                  // loose: ['all'],
                  // optional: 'runtime',
              }
            }
            // ,{ test: /\.(png|otf|svg)$/, include: /assets/, loader: "url-loader?limit=100000" }
            ,{ test: /cluster\.svg$/, include: /assets/, loader: "url-loader?limit=100000" }
        ]
    },
    plugins: [
      new webpack.ProvidePlugin({
          riot: 'riot',
          leaflet: 'leaflet',
          regeneratorRuntime: 'regeneratorRuntime',
          // TODO: carregar como os outros polyfills
          // fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
      }),
      new webpack.optimize.CommonsChunkPlugin(
          /* chunkName= */"vendor",
          /* filename= */"vendor.bundle.js")
    ],
    devServer: {
        port: 5001
    },
    // devtool: "source-map"
    devtool: "source-map"
}
