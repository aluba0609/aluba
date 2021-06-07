let path = require('path');
let webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: {
        react: ['react','react-dom']
    },
    output: {
        filename: "_dll_[name].js",
        path: path.resolve(__dirname, 'dll'),
        library:'_dll_[name]'
    },
    plugins: [

        //需要提前压缩好文件
        new webpack.DllPlugin({
            name: '_dll_[name]', //这里对应着library的名字_dll_[name] 
            context: __dirname,
            //json任务清单存放着当前变量 的路径清单,就去_dll_[name].js查找对应的压缩代码
            path: path.resolve(__dirname, 'dll', 'mainfest.json'),
        })
    ]
}