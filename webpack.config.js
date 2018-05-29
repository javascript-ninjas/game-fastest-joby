module.exports = {
    entry: './app/scripts/main.js',

    output: {
        filename: 'app/dist/main.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|vendors)/,
                loader: 'babel-loader'
            }
        ]
    }
};
