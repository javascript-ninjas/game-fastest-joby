const path = require('path');

module.exports = {
    entry: './app/scripts/main.js',

    output: {
        path: path.resolve('app/dist/'),
        filename: 'main.js'
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
