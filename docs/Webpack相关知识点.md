#### Webpack相对于`Gulp`、`Grunt`、`RequireJS`等的优势：

`webpack`忽略具体资源类型之间的差异，将所有代码/非代码文件都统一看作`Module`-模块对象，以相同的`加载`、`解析`、`依赖处理`、`优化`、`合并流程`实现打包，并借助`Loader`、`Plugin`两种开发接口将资源差异处理逻辑转交由社区实现，实现`统一资源构建模型`，优点：

- 所有的资源都是`Module`，所以可以用同一套代码实现诸多特性，包括：` 代码压缩`、`Hot Module Replacement`、`缓存`等
- 打包时，资源与资源之间非常容易实现信息互换，例如可以轻易在`HTML`插入` Base64`格式的图片
- 借助`Loader`，`Webpack`几乎可以用任意方式处理任意类型的资源，例如可以用`Less`、`Stylus`、`Sass`等预编译CSS代码



#### Webpack除了基础构建能力之外提供的工程化工具：

- 基于`Module Federation`的微前端方案
- 基于`webpack-dev-server`的Hot Module Replacement
- 基于`Terser`、`Tree-shaking`、`SplitChunks`等工具的JavaScript代码压缩、优化、混淆方案
- 基于`lazyCompilation`的延迟编译功能
- 有利于提升应用性能的异步模块加载能力
- 有利于提升构建性能的持久化缓存能力
- 内置`JavaScript`、`JSON`、二进制资源解析、生成能力



#### Webpack与打包流程强相关的配置项：

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131349755.png)

- 输入输出：

- - `entry`：用于定义项目入口文件，webpack会从这些入口文件开始按图索骥找出所有项目文件
  - `context`：项目执行上下文路径
  - `output`：配置产物输出路径、名称等

- 模块处理：

- - `resolve`：用于配制模块路径解析规则，可用于帮助webpack更精确、高效地找到制定模块
  - `module`：用于配制模块加载规则，例如针对什么类型的资源需要使用哪些`Loader`进行处理
  - `externals`：用于声明外部资源，webpack会直接忽略这部分资源，跳过这些资源的解析、打包操作

- 后处理：

- - `optimization`：用于控制如何优化产物包体积，内置`Dead Code Elimination`、`Scope Hoisting`、`代码混淆`、`代码压缩`等功能
  - `target`：用于配制编译产物的目标运行环境，支持web、node、electron等值，不同值最终产物会有所差异
  - `mode`：编译模式短语，支持`development`、`production`等值，可以理解为一种声明环境的短语



#### Webpack提升研发效率的工具：

- 开发效率类：

- - `watch`：用于配制持续监听文件变化，持续构建
  - `devtool`：用于配制产物`Sourcemap`生成规则
  - `devServer`：用于配制与HMR强相关的开发服务器规则

- 性能优化类：

- - `cache`：webpack5之后，该项用于控制如何缓存编译过程信息与编译结果
  - `performance`：用于配制当产物大小超过阈值时，如何通知开发者

- 日志类：

- - `stats`：用于精准地控制编译过程的日志内容，在做比较细致的性能调试时非常有用
  - `infrastructureLogging`：用于控制日志输出方式，例如可以通过该配制将日志输出到磁盘文件

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131349955.png)



#### 工具类与流程类配置有什么区别？分别有什么特点？

1. 流程类主要控制webpack打包编译过程的各个流程
2. 工具类独立于webpack编译过程，提供一些额外的功能使得工程更易于使用，例如devtool的sourcemap，让索引位置更方便。



#### `style-loader`与`mini-css-extract-plugin`实现的效果有什么区别？对页面性能会产生什么影响？

- `style-loader`：会在js主程序中注入`runningtime`代码，配合`HTMLWebpackPlugin`，动态以style标签注入样式，且支持`hmr`
- `mini-css-extract-plugin`：将css打包成独立的文件，不支持`hmr`
- 性能影响：

- - `style-loader`由于混合在js中，代码的颗粒度很大，无论js或css变动会导致缓存失效，并且不能利用异步加载，会导致页面卡顿
  - `mini-css-extract-plugin`因为是link引入所以不会影响，且没有注入多余的js代码



#### SSR带来的问题

- 更高的架构复杂度，这意味着更高的维护、扩展、学习成本
- Node与浏览器环境不完全匹配，部分浏览器特定的代码，只能在某些生命周期钩子函数中使用；一些外部扩展库可能需要特殊处理，才能在SSR中运行
- 组件要求更高，需要兼容`Node.js`Server运行环境
- 服务端负载更高，毕竟相较于纯粹提供静态资源涩SPA形式，SSR需要在Node进程中执行大量CPU运算以渲染HTML片段



#### React JSX经过webpack转换后的结果与vue SFC转换结果极为相似，为何vue不能复用babel而选择开发一个独立的`vue-loader`插件

- `jsx`只是`React.createElement`的语法糖，本质上还是`js`，react组件本质上是`React.createElement(type,[props],[...children])`的层层嵌套，不需要额外的`loader`去加载，只需要`plugin`处理函数调用
- `vue SFC`是全新的文件，需要通过`loader`去加载模块源码，进行转换



## 常用loader&plugin

### 图像 - 导入

#### `file-loader`：将图像引用转换为`url`语句并生成图片文件

```javascript
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.(png|jpg)$/,
-     use: ['file-loader']
+     type: 'asset/resource'
    }],
  },
};
```

#### `url-loader`：有两种表现形式，对于小于阈值`limit`的图像转换为`base64`编码，大于则调用`file-loader`进行加载

```javascript
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.(png|jpg)$/,
-     use: [{
-       loader: 'url-loader',
-       options: {
-         limit: 1024
-       }
-     }]
+     type: "asset",
+     parser: {
+        dataUrlCondition: {
+          maxSize: 1024 // 1kb
+        }
+     }
    }],
  },
};
```

#### `raw-loader`：不做任何转译，只是简单将文件内容复制到产物中，适用于svg场景

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.svg$/i,
-       use: ['raw-loader']
+       type: "asset/source"
      },
    ],
  },
};
```

### 图像-压缩

##### image-webpack-loader：

```javascript
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.(gif|png|jpe?g|svg)$/i,
      // type 属性适用于 Webpack5，旧版本可使用 file-loader
      type: "asset/resource",
      use: [{
        loader: 'image-webpack-loader',
        options: {
          // jpeg 压缩配置
          mozjpeg: {
            quality: 80
          },
        }
      }]
    }],
  },
};
```

### 图像-雪碧图

#### webpack-spritesmith：将图片合成为一张雪碧图减少请求次数

```javascript
module.exports = {
  // ...
  resolve: {
    modules: ["node_modules", "assets"]
  },
  plugins: [
    new SpritesmithPlugin({
      // 需要
      src: {
        cwd: path.resolve(__dirname, 'src/icons'),
        glob: '*.png'
      },
      target: {
        image: path.resolve(__dirname, 'src/assets/sprite.png'),
        css: path.resolve(__dirname, 'src/assets/sprite.less')
      }
    })
  ]
};
```