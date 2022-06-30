const path = require('path');
const fs = require('fs');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

const root = path.resolve(__dirname, '..');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    include: path.resolve(root, 'src'),
    use: 'babel-loader',
  });

  config.module.rules.forEach(r => {
    if (r.oneOf) {
        r.oneOf.forEach(o => {
            if (o.use && o.use.loader && o.use.loader.includes('babel-loader')) {
                o.include = [
                    path.resolve(root, 'src'),
                    path.resolve('.'),
                    path.resolve('node_modules/@ui-kitten/components'),
                ]
            }
        })
    }
})

return config;
};