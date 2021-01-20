/**
 * 编写自定义的webpack配置项，以后webpack打包编译的时候是按照自己配置的内容进行打包编译处理的
 * 这个文件放在根目录下
 * 文件名：webpack.config.js 或 webpackfile.js （自己能识别）
 * 
 * 1. webpack本身基于Node开发，所以配置项的模块处理规则参考CommonJs规范
 */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
// const TerserWebpackPlugin = require('terser-webpack-plugin')

// 配置多页面模版
const htmlPlugins = ['index','login'].map(item => {
   return new HtmlWebpackPlugin({
        template:`./public/${item}.html`,
        filename:`${item}.html`,
        chunks:[item],// 指定当前页面的依赖项
        // chunks:[item,'jquery'],
        minify:{
            collapseWhitespace:true,
            removeComments:true,
            removeAttributeQuotes:true,
            removeEmptyAttributes:true
        }
    })
})

module.exports = {
    // 设置编译模式， development(只合并，不压缩)/production(合并压缩，默认)
    mode:'production',

    // 设置编译的入口文件
    // entry:'./src/main.js',

    // 多入口
    entry:{
        index:'./src/main.js',
        login:'./src/login.js',
        // 如果不像将jq合并在其他js中，想将jquery也单独打包编译成js文件，这么写
        // jquery:'jquery'
    },

    // 设置编译出口文件
    output:{
        // 编译后的文件名[hash]编译时会随机在名字中生成唯一的哈希值，来保证每次编译出的文件是不一样的（防止浏览器缓存问题）
        // filename:'bundle,[hash].min.js',
        // filename:'bundle.min.js',

        // [name]多入口配置的属性名 index/login
        filename:'[name].[hash].min.js',

        // 输出目录(绝对路径)
        path:path.resolve(__dirname,'build'),
        
    },

    // 配资dev-server,编译后的结果放在计算机内存中，并不会像之前的webpack命令一样，把编译后的东西放到build下，
    // dev-server仅仅是在开发模式下，随时编译并且预览的，项目要部署的时候，还是需要基于webpack编译打包的
    devServer:{
        // 端口
        port:3000,
        // 开启gzip压缩
        compress:true,
        // 指定资源访问路径
        contentBase:path.resolve(__dirname,"build"),
        // 自动打开浏览器
        open:true,
        // 开启热更新
        hot:true,
        // proxy跨域代理
        proxy:{
            '/':'http://127.0.0.1:8888'
        }
    },

    // 在webpack中使用插件
    plugins:[
        // 配置指定的html页面模版（后期编译时会把编译好的资源文件自动导入到我们的页面模版中）
        // new HtmlWebpackPlugin({
        //     // 模版路径
        //     template:'./public/index.html',
        //     // 编译后生成的文件名
        //     filename:'index.html',
        //     // 是否把编译的资源文件导入到页面中，设置hash值（清除强缓存，和output中hash值一样，保留一个hash即可）
        //     // hash:true,
        //     // 把模版中的html代码也进行压缩编译（配置规则）项目常用
        //     minify:{
        //         // 删除标签之间的空格
        //         collapseWhitespace:true,
        //         // 去除注释
        //         removeComments:true,
        //         // 去除div属性的双引号,div="xxx"
        //         removeAttributeQuotes:true,
        //         // 去除空属性 <div class="aa" id=""></div> id整体会被删除
        //         removeEmptyAttributes:true

        //     }
        // }),

        ...htmlPlugins,

        // 每次打包都把之前打包的清空
        new CleanWebpackPlugin(),

        new MiniCssExtractPlugin({
            filename:'[name].[hash].min.css'
        })
    ],

    // 配置weboack加载器 loader
    module:{
        // 设置规则和处理方式 默认执行顺序：从右到左，从下到上
        rules:[
            {
                // 匹配哪些文件基于处理
                test:/\.(css|less)$/i,
                use:[
                    // "style-loader",
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    // "less-loader"
                // 不同写法，options可以添加额外的配置
                    {
                        loader:"less-loader",
                        options:{

                        }
                    }
                ]
            }
        ]
    },

    // 配置webpack优化项
    optimization:{
        // 设置压缩方式
        minimizer:[
            // 压缩css
            new OptimizeCssAssetsWebpackPlugin(),
            // 压缩Js
            new UglifyjsWebpackPlugin({
                cache:true,// 是否使用缓存
                parallel:true, // 是否是并发编译
                sourceMap:true, //启动源码映射（方便调试）
            }),

            // 实际操作报错--不清楚原因！
            // new TerserWebpackPlugin() 

        ]
    }
}
