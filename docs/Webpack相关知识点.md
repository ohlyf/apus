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



## `webpack` 持久化缓存原理

那么，为什么开启持久化缓存之后，构建性能会有如此巨大的提升呢？

一言蔽之，Webpack5 会将首次构建出的 Module、Chunk、ModuleGraph 等对象序列化后保存到硬盘中，后面再运行的时候，就可以跳过许多耗时的编译动作，直接复用缓存数据。

回过头来看看 Webpack 的构建过程，大致上可划分为三个阶段。

![image.png](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131539861.awebp)

- 初始化，主要是根据配置信息设置内置的各类插件。

- Make - 构建阶段，从

   

  ```
  entry
  ```

   

  模块开始，执行：

  - 读入文件内容；
  - 调用 Loader 转译文件内容；
  - 调用 [acorn](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Facorn) 生成 AST 结构；
  - 分析 AST，确定模块依赖列表；
  - 遍历模块依赖列表，对每一个依赖模块重新执行上述流程，直到生成完整的模块依赖图 —— ModuleGraph 对象。

- Seal - 生成阶段，过程：

  - 遍历模块依赖图，对每一个模块执行：
    - 代码转译，如 `import` 转换为 `require` 调用；
    - 分析运行时依赖。
  - 合并模块代码与运行时代码，生成 chunk；
  - 执行产物优化操作，如 Tree-shaking；
  - 将最终结果写出到产物文件。

过程中存在许多 CPU 密集型操作，例如调用 Loader 链加载文件时，遇到 babel-loader、eslint-loader、ts-loader 等工具时可能需要重复生成 AST；分析模块依赖时则需要遍历 AST，执行大量运算；Seal 阶段也同样存在大量 AST 遍历，以及代码转换、优化操作，等等。假设业务项目中有 1000 个文件，则每次执行 `npx webpack` 命令时，都需要从 0 开始执行 1000 次构建、生成逻辑。

而 Webpack5 的持久化缓存功能则将构建结果保存到文件系统中，在下次编译时对比每一个文件的内容哈希或时间戳，未发生变化的文件跳过编译操作，直接使用缓存副本，减少重复计算；发生变更的模块则重新执行编译流程。缓存执行时机如下图：

![image.png](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131539076.awebp)

如图，Webpack 在首次构建完毕后将 Module、Chunk、ModuleGraph 三类对象的状态序列化并记录到缓存文件中；在下次构建开始时，尝试读入并恢复这些对象的状态，从而跳过执行 Loader 链、解析 AST、解析依赖等耗时操作，提升编译性能。



## 多进程打包

## 使用 Thread-loader

[Thread-loader](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.js.org%2Floaders%2Fthread-loader%2F) 与 HappyPack 功能类似，都是以多进程方式加载文件的 Webpack 组件，两者主要区别：

1. Thread-loader 由 Webpack 官方提供，目前还处于持续迭代维护状态，理论上更可靠；
2. Thread-loader 只提供了一个 Loader 组件，用法简单很多；
3. HappyPack 启动后会创建一套 Mock 上下文环境 —— 包含 `emitFile` 等接口，并传递给 Loader，因此对大多数 Loader 来说，运行在 HappyPack 与运行在 Webpack 原生环境相比没有太大差异；但 Thread-loader 并不具备这一特性，所以要求 Loader 内不能调用特定上下文接口，兼容性较差。

说一千道一万，先来看看基本用法：

1. 安装依赖：

```Bash
yarn add -D thread-loader
```

1. 将 Thread-loader 放在 `use` 数组首位，确保最先运行，如：

```JavaScript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["thread-loader", "babel-loader", "eslint-loader"],
      },
    ],
  },
};
```

启动后，Thread-loader 会在加载文件时创建新的进程，在子进程中使用 `loader-runner` 库运行 `thread-loader` 之后的 Loader 组件，执行完毕后再将结果回传到 Webpack 主进程，从而实现性能更佳的文件加载转译效果。

以 Three.js 为例，使用 Thread-loader 前，构建耗时大约为 11000ms 到 18000ms 之间，开启后耗时降低到 8000ms 左右，提升约37%。

此外，Thread-loader 还提供了一系列用于控制并发逻辑的配置项，包括：

- `workers`：子进程总数，默认值为 `require('os').cpus() - 1`；
- `workerParallelJobs`：单个进程中并发执行的任务数；
- `poolTimeout`：子进程如果一直保持空闲状态，超过这个时间后会被关闭；
- `poolRespawn`：是否允许在子进程关闭后重新创建新的子进程，一般设置为 `false` 即可；
- `workerNodeArgs`：用于设置启动子进程时，额外附加的参数。

使用方法跟其它 Loader 一样，都是通过 `use.options` 属性传递，如：

```JavaScript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: 2,
              workerParallelJobs: 50,
              // ...
            },
          },
          "babel-loader",
          "eslint-loader",
        ],
      },
    ],
  },
};
```

不过，Thread-loader 也同样面临着频繁的子进程创建、销毁所带来的性能问题，为此，Thread-loader 提供了 `warmup` 接口用于前置创建若干工作子进程，降低构建时延，用法：

```JavaScript
const threadLoader = require("thread-loader");

threadLoader.warmup(
  {
    // 可传入上述 thread-loader 参数
    workers: 2,
    workerParallelJobs: 50,
  },
  [
    // 子进程中需要预加载的 node 模块
    "babel-loader",
    "babel-preset-es2015",
    "sass-loader",
  ]
);
```

执行效果与 `HappyPack.ThreadPool` 相似，此处不再赘述。

与 HappyPack 相比，Thread-loader 有两个突出的优点，一是产自 Webpack 官方团队，后续有长期维护计划，稳定性有保障；二是用法更简单。但它不可避免的也存在一些问题：

- 在 Thread-loader 中运行的 Loader 不能调用 `emitAsset` 等接口，这会导致 `style-loader` 这一类加载器无法正常工作，解决方案是将这类组件放置在 `thread-loader` 之前，如 `['style-loader', 'thread-loader', 'css-loader']`；
- Loader 中不能获取 `compilation`、`compiler` 等实例对象，也无法获取 Webpack 配置。

这会导致一些 Loader 无法与 Thread-loader 共同使用，大家需要仔细加以甄别、测试。



## 并行打包问题

理论上，并行确实能够提升系统运行效率，但 Node 单线程架构下，所谓的并行计算都只能依托与派生子进程执行，而创建进程这个动作本身就有不小的消耗 —— 大约 600ms，对于小型项目，构建成本可能可能很低，引入多进程技术反而导致整体成本增加，因此建议大家按实际需求斟酌使用上述多进程方案。



## 深入理解 Chunk

Chunk 是 Webpack 内部一个非常重要的底层设计，用于组织、管理、优化最终产物，在构建流程进入生成(Seal)阶段后：

1. Webpack 首先根据 `entry` 配置创建若干 Chunk 对象；
2. 遍历构建(Make)阶段找到的所有 Module 对象，同一 Entry 下的模块分配到 Entry 对应的 Chunk 中；
3. 遇到异步模块则创建新的 Chunk 对象，并将异步模块放入该 Chunk；
4. 分配完毕后，根据 SplitChunksPlugin 的启发式算法进一步对这些 Chunk 执行**裁剪、拆分、合并、代码调优**，最终调整成运行性能(可能)更优的形态；
5. 最后，将这些 Chunk 一个个输出成最终的产物(Asset)文件，编译工作到此结束。

![image.png](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131627869.awebp)

可以看出，Chunk 在构建流程中起着承上启下的关键作用 —— 一方面作为 Module 容器，根据一系列默认 **分包策略** 决定哪些模块应该合并在一起打包；另一方面根据 `splitChunks` 设定的 **策略** 优化分包，决定最终输出多少产物文件。

**Chunk 分包结果的好坏直接影响了最终应用性能**，Webpack 默认会将以下三种模块做分包处理：

- Initial Chunk：`entry` 模块及相应子模块打包成 Initial Chunk；
- Async Chunk：通过 `import('./xx')` 等语句导入的异步模块及相应子模块组成的 Async Chunk；
- Runtime Chunk：运行时代码抽离成 Runtime Chunk，可通过 [entry.runtime](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.js.org%2Fconfiguration%2Fentry-context%2F%23dependencies) 配置项实现。

Runtime Chunk 规则比较简单，本文先不关注，但 Initial Chunk 与 Async Chunk 这种略显粗暴的规则会带来两个明显问题：

1. **模块重复打包：**

假如多个 Chunk 同时依赖同一个 Module，那么这个 Module 会被不受限制地重复打包进这些 Chunk，例如对于下面的模块关系：

![image.png](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131627015.awebp)

示例中 `main/index` 入口(`entry`)同时依赖于 `c` 模块，默认情况下 Webpack 不会对此做任何优化处理，只是单纯地将 `c` 模块同时打包进 `main/index` 两个 Chunk：

![image.png](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131627053.awebp)

1. **资源冗余 & 低效缓存：**

Webpack 会将 Entry 模块、异步模块所有代码都打进同一个单独的包，这在小型项目通常不会有明显的性能问题，但伴随着项目的推进，包体积逐步增长可能会导致应用的响应耗时越来越长。归根结底这种将所有资源打包成一个文件的方式存在两个弊端：

- **资源冗余**：客户端必须等待整个应用的代码包都加载完毕才能启动运行，但可能用户当下访问的内容只需要使用其中一部分代码
- **缓存失效**：将所有资源达成一个包后，所有改动 —— 即使只是修改了一个字符，客户端都需要重新下载整个代码包，缓存命中率极低

这两个问题都可以通过更科学的分包策略解决，例如：

- 将被多个 Chunk 依赖的包分离成独立 Chunk，防止资源重复；
- `node_modules` 中的资源通常变动较少，可以抽成一个独立的包，业务代码的频繁变动不会导致这部分第三方库资源缓存失效，被无意义地重复加载。

为此，Webpack 专门提供了 `SplitChunksPlugin` 插件，用于实现更灵活、可配置的分包，提升应用性能。

