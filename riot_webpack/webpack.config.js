var webpack = require('webpack')

module.exports = {
    cache: true,
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
            { test: /\.png$/, include: /assets/, loader: "file" },
            { test: /\.css$/, include: /src/, loader: 'style!css' },
            { test: /\.sass$/, include: /src/, loader: 'style!css!sass?indentedSyntax' },
            { test: /\.html$/, include: /src/, loader: 'riotjs' },
            // { test: /\.es5\.js5$/, include: /src/, loader: 'script' },
            { test: /\.js$/,
              exclude: /\.es5\.js$/,
              include: /src/,
              loader: 'babel',
              query: {modules: 'common'} }
        ]
    },
    plugins: [
      new webpack.ProvidePlugin({
          riot: 'riot',
          leaflet: 'leaflet',
          'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
      }),
      new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
    ],
    devServer: {
        port: 5555
    },
    devtool: "source-map"
}
