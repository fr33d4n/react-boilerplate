const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const pkg = require('./package.json');

/* QUE SON Y COMO SE USAN LOS ALIAS Y LOS PLUINS DE WEBPACK:
 * Los ALIAS se usan para poder hacer imports o requires de ciertos módulos usando un alias. Por ejemplo,
 * si tengo una carpeta en src/utils/utils.js puedo crear un alias 'utilities': path.resolve(__dirname, './src/utils/utils.js')
 * y así hacer import('utilities'). Mas info: https://webpack.js.org/configuration/resolve/
 *
 * Los PLUGINS nos permiten modificar el comportamiento de react. Hay muchos plugins, pero los mas interesantes son:
 * - Provide: Nos permite definir variabes globales que se usan sin import ni require. Siempre que webpack encuentre una de esas variables,
 * automáticamente cargará el módulo correspondiente. Mas info en https://webpack.js.org/plugins/provide-plugin/
 * - Copy: Nos permite copiar carpetas o ficheros al build final de webpack. Mas info: https://webpack.js.org/plugins/copy-webpack-plugin/
 * - Define: Nos permite definir constantes globales que varian en tiempo de build. Por ejemplo,
 * si quisieramos tener en el código la versión:
 * new webpack.DefinePlugin({ VERSION: webpack.DefinePlugin.runtimeValue(Date.now, true) }) nos definiría una
 * constante VERSION, global y accesible
 * en todo el código. Podemos también sobreescribir valores ya existentes como process.env.ENVIRONMENT y demás.
 * Mas info: https://webpack.js.org/plugins/define-plugin/
 */

const DEVELOPMENT = 'development';
function applyDefaultConfig(config, env) {
    const newConfig = { ...config };
    newConfig.resolve.alias = {
        ...config.resolve.alias,
        '@store': path.resolve(__dirname, 'src/store'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@actions': path.resolve(__dirname, 'src/actions'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@config': path.resolve(__dirname, 'src/configs', env),
        '@routes': path.resolve(__dirname, 'src/routes'),
    };

    newConfig.resolve.extensions = ['.js', '.jsx', '.json'];

    newConfig.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            'window.bankiaConfig': '@config',
        }),
    ];

    return newConfig;
}

function applyDevelopmentConfig(config) {
    const newConfig = { ...config };

    newConfig.plugins = [
        ...config.plugins,
        new webpack.EnvironmentPlugin({
            MOCKS: false,
        }),
    ];

    newConfig.output = {
        ...config.output,
    };

    return newConfig;
}

function applyProductionConfig(config) {
    const newConfig = { ...config };

    newConfig.plugins = [
        ...config.plugins,
        new CopyPlugin({
            patterns: [{ from: 'public/assets', to: 'assets', context: '' }],
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            hash: true,
            template: './public/index.html',
        }),
    ];

    newConfig.entry = path.resolve(__dirname, 'src/index.jsx');

    newConfig.output = {
        ...config.output,
        filename: `[name].${pkg.version}.js`,
        chunkFilename: `[id].${pkg.version}.js`,
        library: 'bor-bdt-react',
        libraryTarget: 'umd',
        publicPath: '/oficina/particulares/bower_components/oip-bor-bdt-react/build/',
    };

    newConfig.optimization = {
        ...config.optimization,
        splitChunks: {
            ...config.optimization.splitChunks,
            chunks: 'async',
        },
        runtimeChunk: false,
    };

    return newConfig;
}

module.exports = function override(config, env) {
    const overridenConfig = applyDefaultConfig(config, env);

    if (env === DEVELOPMENT) {
        return applyDevelopmentConfig(overridenConfig);
    }

    return applyProductionConfig(overridenConfig);
};
