let path=require('path');
let HtmlWebpackPlugin=require('html-webpack-plugin');
let MiniCssExtractPlugin=require('mini-css-extract-plugin');
let {CleanWebpackPlugin} = require('clean-webpack-plugin');
let webpack=require('webpack');
const { loader } = require('mini-css-extract-plugin');
module.exports={
    devServer:{
        progress:true,
        port:3000,
        contentBase:'./dist',
        compress:true
    },
    mode:"development",
    entry:'./src/index.js',
    output:{
        filename:"bundle.[hash].js",
        path:path.resolve(__dirname,'dist')
    },
    plugins:[
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
            filename:'main.[hash].css'
        }),
        new webpack.ProvidePlugin({//为每个模块提供jquery
            '$':'jquery'
        })
    ],
    module:{
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
                            "@babel/plugin-transform-runtime"//处理promise gen
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
    // externals:{//阻止import $ from "jquery"
    //     jquery:'$'
    // }
}