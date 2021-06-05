let path=require('path');
let HtmlWebpackPlugin=require('html-webpack-plugin');
let MiniCssExtractPlugin=require('mini-css-extract-plugin');
let {CleanWebpackPlugin} = require('clean-webpack-plugin');
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
        })
    ],
    module:{
        rules:[
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
                test:/\.js&/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[
                            '@babel/preset-env'
                        ],
                        // plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                    
                }
            }
            
        ]
    }
}