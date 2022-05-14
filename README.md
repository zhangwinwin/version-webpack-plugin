# @zww/version-webpack-plugin
生成版本信息的wepback插件

## Install
npm: 
```js
npm i @zww/version-webpack-plugin -D
```
yarn:
```js
yarn add @zww/version-webpack-plugin -D
```

## Use
```js
const VersionWebpackPlugin = require('@zww/version-webpack-plugin');

const compiler = webpack({
    ...
    plugins: [
        new VersionWebpackPlugin({
            mode: 'production'
        })
    ]
})
```