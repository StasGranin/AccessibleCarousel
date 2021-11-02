const TsconfigPathsPlugin  = require('tsconfig-paths-webpack-plugin');
const path = require('path');

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

module.exports = {
	mode: 'development',
	entry: './src/app.tsx',
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		plugins: [
			new TsconfigPathsPlugin({
				configFile: path.join(__dirname, 'tsconfig.json')
			})
		]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public'),
		publicPath: '/'
	},
	devServer: {
		port: 3000,
		hot: true,
		open: 'http://localhost:3000',
		static: {
			directory: path.join(__dirname, 'public'),
		},
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: [{
					loader: "babel-loader",
					options: {
						configFile: path.join(__dirname, '.babelrc')
					}
				}]
			},
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader']
			}
		]
	}
};