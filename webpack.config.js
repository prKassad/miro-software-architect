const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = env => {
  const mode = env && env.production ? "production" : "development";
  console.log("Mode: ", mode);

  return {
    mode,
    devtool: mode === "development" ? "inline-source-map" : false,
    entry: {
      index: "./src/Index.ts",
      sidebar: "./src/Sidebar.tsx",
      library: "./src/Library.ts",
      notAuthorized: "./src/NotAuthorized.ts",
      generator: "./src/Generator.tsx"
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/[name].[contenthash].js"
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      https: true,
      http2: true,
      port: 9000,
      // hot: false,
      inline: false
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "index.html",
        chunks: ["index"]
      }),
      new HtmlWebpackPlugin({
        template: "./public/sidebar.html",
        filename: "sidebar.html",
        chunks: ["sidebar"]
      }),
      new HtmlWebpackPlugin({
        template: "./public/library.html",
        filename: "library.html",
        chunks: ["library"]
      }),
      new HtmlWebpackPlugin({
        template: "./public/not-authorized.html",
        filename: "not-authorized.html",
        chunks: ["notAuthorized"]
      }),
      new HtmlWebpackPlugin({
        template: "./public/auth-success.html",
        filename: "auth-success.html"
      }),
      new HtmlWebpackPlugin({
        template: "./public/generator.html",
        filename: "generator.html",
        chunks: ["generator"]
      })
    ]
  };
};
