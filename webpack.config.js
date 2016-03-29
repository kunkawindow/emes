var webpack = require("webpack");
var path = require("path");
var _ = require("lodash");

module.exports = {
    watch: false,
    devtool: "source-map",
    context: __dirname + "",
    entry: {
        emes: ["./src/main"]
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].js",
        libraryTarget: "var"
    },
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".scss"],
        alias: {
            "lodash": path.join(__dirname, "node_modules/lodash/lodash.min.js"),
            "react": path.join(__dirname, "node_modules/react/dist/react.min.js"),
            "react-dom": path.join(__dirname, "node_modules/react-dom/dist/react-dom.min.js"),
            "material-design-icons": path.join(__dirname, "node_modules/material-design-icons/iconfont/material-icons.css")
        }
    },
    modulesDirectories: [
        path.join(__dirname, "node_modules"),
        path.join(__dirname, "bower_components")
    ],
    module: {
        loaders: [
            {
                test: /(\.ts$|\.tsx$)/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass"
            },
            {
                test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
                loader: "url?limit=200000"
            }
        ]
    }
};