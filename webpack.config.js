module.exports = {
    resolve: {
        extensions: ['.es6.js', '.js', '']
    },

    entry: './app/scripts/main.es6.js',

    output: {
        filename: 'app/dist/main.js'
    },

    module: {
        loaders: [
            {
                test: /\.es6.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};
