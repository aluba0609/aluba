let path=require('path');
let HtmlWebpackPlugin=require('html-webpack-plugin');
let MiniCssExtractPlugin=require('mini-css-extract-plugin');
let {CleanWebpackPlugin} = require('clean-webpack-plugin');
let webpack=require('webpack');
let OptimizeCss=require('optimize-css-assets-webpack-plugin')
let UglifyjsPlugin=require('uglifyjs-webpack-plugin')

module.exports={
    optimization:{
        minimizer:[
            new UglifyjsPlugin({
                cache:true,
                parallel:true,//并发压缩多个文件
                sourceMap:true
            }),
            new OptimizeCss()
        ]
    },
    devServer:{
        hot:true,
        progress:true,
        port:3000,
        contentBase:'./',
        compress:true,
        open:false,
        filename:"index.html"
    },
    mode:"development",
    entry:{
        index:'./src/index.js'
    },
    output:{
        filename:"[name].[hash].js",
        path:path.resolve(__dirname,'dist')
    },
    plugins:[

        //需要提前压缩好文件
        new webpack.DllReferencePlugin({
            context:__dirname,
            manifest: require('./dll/mainfest.json'),
            extensions:['.json']
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:'index.html',
            minify:{
                removeAttributeQuotes:true,//删除HTML双引号
                collapseWhitespace:true,//html折叠成一行
            },
            hash:true,//js会加上hash
        }),
        new MiniCssExtractPlugin({
            filename:'[name].[hash].css'
        }),
        new webpack.ProvidePlugin({//为每个模块提供jquery
            '$':'jquery'
        })
    ],
    module:{
        noParse:/jquery/,//不去解析jQuery中的依赖库，前提需要知道该库没有依赖其他库
        rules:[//默认 loader 从右到左 从下到上
            // {
            //     test:/\.js$/,
            //     use:{
            //         loader:'eslint-loader',
            //         options:{
            //             enforce:'pre'//强制在最先执行  或者 post 在普通loader后面执行
            //         }
            //     }
            // },
            {
                test:/\.js&/,//normal 普通的loader
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[
                            '@babel/preset-env'
                        ],
                        plugins: [
                            "@babel/plugin-proposal-class-properties",//处理class语言
                            "@babel/plugin-transform-runtime",//处理promise gen
                            "@babel/preset-react",//处理react语法
                        ]
                    }
                    
                },
                exclude:/node_modules/,
                include:path.resolve(__dirname,'src')
            },
            {
                test:/\.css$/,
                use:[//css-loader负责@import style-loader负责插入到head标签中
                    MiniCssExtractPlugin.loader,
                        // {
                        //     loader:'style-loader',
                        //     options:{
                        //         insertAt:'top',//样式插入到最前面(head标签)
                        //     }
                        // },
                        'css-loader'
                    ]
            },
            {
                test:/\.less$/,
                use:[//css-loader负责@import style-loader负责插入到head标签中
                        {
                            loader:'style-loader',
                            // options:{
                            //     insertAt:'top',//样式插入到最前面(head标签)
                            // }
                        },
                        'css-loader',
                        'less-loader'//负责less转换成css
                    ]
            }, 
            {
                test:/\.(png|jpg|gif)$/,
                use:[
                        {
                            loader:'url-loader',
                            options:{//当我们的图片 小于多少K的时候 用base 64 来转化 否则用file-loader产生真实图片
                                limit:20*1024
                            }
                        },
                        // {
                        //     loader:'file-loader',
                        // }
                ]
            },
            {
                test:/\.html$/,//能够把html写死的img  URL  更换成打包后的url
                loader:'html-withimg-loader'
            }
        ]
    },
    watch:true,
    watchOptions:{
        poll:1000,//每秒询问次数
        aggregateTimeout:500,//防抖，停止更改后500秒内触发打包
        ignored:/node_modules/,//忽略监控文件
    },
    resolve:{
        modules:[path.resolve(__dirname,'node_modules')],
        alias:{//别名 

        },
        mainFields:['style','main'],//json文件里面的入口文件
        mainFiles:['index.js'],//入口文件的名字
        extensions:['.js','.css','.json','.vue']
    }
    // externals:{//阻止import $ from "jquery"的打包
    //     jquery:'$'
    // }
}