const path = require('path');
const htmlWebpackPlugin=require("html-webpack-plugin")

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    // JS 执行入口文件
    entry: {
        main:'src/main.js'
    },
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        filename: 'bundle.js',
        // 输出文件都放到 dist 目录下
        path: path.resolve(__dirname, './dist'),
    },
    module: {
        rules: [{
                test: '/\.js$/',
                use: {
                    loader: ['babel-loader'],
                    cacheDirectory: true,
                },
                //至，命中src里面的文件
                include: [path.resolve(__dirname, 'src')],
                // enforce:'post' 的含义是把该 Loader 的执行顺序放到最后
                // enforce 的值还可以是 pre，代表把 Loader 的执行顺序放到最前面
                enforce: 'post',
                noparse:()=>{
                    return ['jquery','chartjs']
                }
            },
            {
                test: ['/\.css$/', '/\.scss$/'],
                // 处理顺序为从后到前，即先交给 sass-loader 处理，再把结果交给 css-loader 最后再给 style-loader。
                loader: ['style-loader', 'sass-loader', 'css-loader'],
                // 排除 node_modules 目录下的文件
                enclude: [path.resolve(__dirname, 'node_modules')]
            },
            {
                // 对非文本文件采用 file-loader 加载
                test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
                use: ['file-loader'],
            },
        ]
    },
    resolve:{
        //resolve.modules 配置 Webpack 去哪些目录下寻找第三方模块，
        //默认是只会去 node_modules 目录下寻找。 
        //有时你的项目里会有一些模块会大量被其它模块依赖和导入，
        //由于其它模块的位置分布不定，针对不同的文件都要去计算被导入模块文件的相对路径， 
        //这个路径有时候会很长，就像这样 import '../../../components/button' 
        //这时你可以利用 modules 配置项优化，假如那些被大量导入的模块都在 ./src/components 目录下，把 modules 配置成
        modules:['node_modules'],
        //也就是说当遇到 require('./data') 这样的导入语句时，Webpack 会先去寻找 ./data.js 文件，如果该文件不存在就去寻找 ./data.json 文件， 如果还是找不到就报错。
        extensions: ['.js', '.json'],
        enforceExtension:true,//必须带文件类型
        enforceModuleExtension:false//兼容  第三方模块中大多数导入语句没带文件后缀
    },
    Plugin:[
        new htmlWebpackPlugin({
            filename:{main}
        })
    ]
};