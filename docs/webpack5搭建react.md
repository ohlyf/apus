## 预备知识

`webpack` 配置主要分为七种：`entry(入口)` 、`output(出口)` 、`loader(转换)` 、`plugin(插件)` 、`mode(模式)` 、`resolve(解析)` 、`optimization(优化)` 

### 含义

#### 1. `entry` 

 入口是指依赖关系图的开始，从入口开始寻找依赖，打包构建，`webpack` 允许一个或多个入口配置，一般都是`src` 下的`index.js` 作为入口

```js
export default {
  entry: './src/index.js'
}
```

```js
export default {
  entry: {
    index: './src/index.js',
    other: './src/other.js'
  }
}
```

#### 2. `output`

配置`webpack` 打包的出口，可配置`打包后的位置` 、`打包后的文件名` 

```js
export default {
  output: {
    path: path.resolve(__dirname,'dist'),
    filename: '[name].bundle.js'
  }
}
```

#### 3. `loader` 

`webpack` 自带`JavaScript` 和`JSON` 文件的打包构建能力，无需额外配置，其他文件则需要安装`loader` 或`plugin` 进行处理

```js
export default {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

#### 4. `plugin` 

给予某些文件格式一条龙服务

```js
export default {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
}
```

#### 5. `mode` 

`webpack5`提供了模式选择，包括`开发模式` 、`生产模式` 、`空模式` ，并且对不同模式做了对应的内置优化，可以通过配置模式让项目性能更优

```js
export default {
  mode: 'development'
}
```

#### 6. `resolve` 

`resolve` 用于设置模块如何解析，常用配置：

- `alias` 配置别名，简化模块引入
- `extensions` 在引入模块时可不带后缀
- `symlinks` 用于配置`nom link` 是否生效，禁用可提升编译速度  —— 在`pnpm` 使用有问题

```js
export default {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.d.ts'],
    alias: {
      '@': './'
    },
    symlinks: false
  }
}
```

#### 7. `optimization` 

`optimization` 用于自定义`webpack` 的内置优化配置，一般用于`生产模式` 提升性能，常用配置：

- `minimize` 是否需要压缩`bundle` 
- `minimizer` 配置要锁工具，如`TerserPlugin` 、`OptimizeCSSAssetsPlugin` 
- `splitChunks` 拆分`bundle` 
- `runtimeChunk` 是否需要将所有生成`chunk` 之间共享的运行时文件拆分出来

```js
export default {
  optimization: {
    minimizer: [
      new CSSMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      // 重复打包问题
      cacheGroups: {
        verdors: {
          // node_modulesl里的代码
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendors',
          priority: 10,
          enforce: true
        }
      }
    }
  }
}
```





## 实践基础篇

### 基础配置

#### 1. 新建项目目录

![image-20230112110711287](https://raw.githubusercontent.com/ohlyf/img-url/master/202301121107366.png)

#### 2. 改`commonjs` 为`esm` 

进入`package.json` 删掉`main:index.js` 改为`type:module` 和`module:index.js` 

![image-20230112112549159](https://raw.githubusercontent.com/ohlyf/img-url/master/202301121125177.png)

#### 3. 安装插件

```js
npm i webpack-merge webpack webpack-cli -D
```

#### 4. 添加基本配置结构

```js
// webpack.common.js

export default{
  
}
```

```js
// webpack.dev.js

import { merge } from "webpack-merge";
import common from './webpack.common.js';

export default merge(common, {
  
})
```

```js
// webpack.prod.js

import { merge } from "webpack-merge";
import common from './webpack.common.js';

export default merge(common, {
  
})
```

#### 5. 配置入口(entry)

入口只需要在公共配置`common` 中配置

```js
// webpack.common.js

export default{
   entry: {
    index: './src/index.js'
	 }
}
```

#### 6. 配置出口(output)

生产环境的`output` 需要通过`contenthash` 值来区分版本和变动，以达到缓存的效果，而本地为了构建效率，则不需要引入`contenthash` 

占位符作用：

- [name]- chunk name,如果`chunk` 没有名称，则会使用其`id` 作为名称
- [contenthash] - 输出文件内容的`md4-hash` 

**先封装`resolveApp`** 封装路径函数

```js
// config/paths.js

import * as fs from "fs";
import * as path from "path";

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

export { resolveApp };

```

**配置`dev`出口+模式+`source-map`**  

```js
import { merge } from "webpack-merge";
import common from "./webpack.common.js";
import { resolveApp } from "./paths.js";

export default merge(common, {
  output: {
    filename: "[name].bundle.js",

    path: resolveApp("dist"),

    clean: true,
  },
  mode: "development",
  // 开发环境，开启 source map，编译调试
  devtool: "eval-cheap-module-source-map",
});

```

**配置`prod`出口+模式** 

```js
import { merge } from "webpack-merge";
import common from "./webpack.common.js";
import { resolveApp } from "./paths.js";

export default merge(common, {
  output: {
    // bundle 文件名称 【只有这里和开发环境不一样】
    filename: "[name].[contenthash].bundle.js",

    // bundle 文件路径
    path: resolveApp("dist"),

    // 编译前清除目录
    clean: true,
  },
  mode: "production",
});

```

#### 7. 配置`html` 

**安装插件**

```js
npm i html-webpack-plugin -D
```

**新增`public/index.html`** 添加`div#root` 为后续做准备，方便对`html` 进行修改

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

**修改`webpack.common.js`** 

```js
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  entry: {
    index: "./src/index.js",
  },
  plugins: [
    // 生成html，自动引入所有bundle
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

```

#### 8. 配置`devServer` 

- `webpack-dev-server` 提供了一个基本的`web server` ，并且支持重新加载
- `webpack-dev-server` 默认配置`compress:true` ，为每个静态文件开启`gzip` 

**安装**

```shell
npm i webpack-dev-server -D
```

**修改`webpack.dev.js`** 

```js
import { merge } from "webpack-merge";
import common from "./webpack.common.js";
import { resolveApp } from "./paths.js";

export default merge(common, {
  output: {
    filename: "[name].bundle.js",

    path: resolveApp("dist"),

    clean: true,
  },
  mode: "development",
  // 开发环境，开启 source map，编译调试
  devtool: "eval-cheap-module-source-map",
  
  devServer: {
    // 告诉服务器位置
    static: {
      directory: resolveApp("dist"),
    },
    port: 1012,
    hot: true,
  },
});

```



#### 9. 配置打包命令试试

进入`package.json` 配置打包命令

```json
"scripts": {
  	"dev": "webpack serve --config config/webpack.dev.js",
    "build": "webpack --config config/webpack.prod.js",
},
```

**运行`dev`** 配置了`webpack serve` 不会再打包，而是直接启服务器了

```shell
pnpm run dev
```

![image-20230112153340822](https://raw.githubusercontent.com/ohlyf/img-url/master/202301121533848.png)



**运行`build`** 可以看到`dist` 目录下打包结果

```shell
pnpm run build
```

![image-20230112153519178](https://raw.githubusercontent.com/ohlyf/img-url/master/202301121535204.png)

![image-20230112153537859](https://raw.githubusercontent.com/ohlyf/img-url/master/202301121535891.png)

#### 10. 配置`cross-env` 

通过`cross-env` 后续可以区分`开发环境` 和`生产环境` 

**安装**

```shell
npm i cross-env -D
```

**修改`package.json`**

```json
"scripts": {
    "dev": "cross-env NODE_ENV=development webpack serve --config config/webpack.dev.js",
    "build": "cross-env NODE_ENV=production webpack --config config/webpack.prod.js",
},
```



### 进阶配置

#### 1. 加载图片

由于原先的`file-loader` `url-loader` 等很热门，所以`webpack5` 将至内置了，只需要使用`Assetmodules` 

```js
// webpack.common.js

import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolveApp } from "./paths.js";

export default {
  entry: {
    index: "./src/index.js",
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: [resolveApp("src")],
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    // 生成html，自动引入所有bundle
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

```

**往`inde.js`引入图片打包试试**

```js
// index.js

import "./assets/images/pic2.jpeg";
```

![image-20230112155337828](https://raw.githubusercontent.com/ohlyf/img-url/master/202301121553869.png) 

#### 2. 加载`less` 

**安装`loader`** 

```shell
npm i css-loader style-loader less less-loader -D
```

**修改`webpack.common.js`** 

```js
import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolveApp } from "./paths.js";

export default {
  entry: {
    index: "./src/index.js",
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: [resolveApp("src")],
        type: "asset/resource",
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  plugins: [
    // 生成html，自动引入所有bundle
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

```

由于`style-loader`已经将`css` 插入`js` 了，所以打包查看不到`css` 



#### 3. 配置`React+TypeScript` 

**安装**

```shell
pnpm i react react-dom @types/react @types/react-dom typescript esbuild-loader -D
```

**添加`tsconfig.json`** 

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "ESNext",
    "target": "ESNext",
    "jsx": "react",
    "allowJs": true,
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

**新建`src/index.tsx`** 

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

**新建`src/App.tsx`** 

```tsx
import React from "react";
import "./style.css";
import "./index.less";

function App() {
  return (
    <div>
      <h1>hello</h1>
      <h2>world</h2>
    </div>
  );
}

export default App;

```

**修改`webpack.common.js`** 

```js
import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolveApp } from "./paths.js";

export default {
  entry: {
    index: "./src/index.tsx",
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: [resolveApp("src")],
        type: "asset/resource",
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(js|ts|jsx|tsx)$/,
        include: resolveApp("src"),
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "tsx",
              target: "esNext",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 生成html，自动引入所有bundle
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  resolve: {
    extensions: [".tsx", "ts", ".js"],
  },
};

```

#### 运行试试

```shell
pnpm run dev
```

**进入`localhost:1012`** 

![image-20230112163947475](https://raw.githubusercontent.com/ohlyf/img-url/master/202301121639523.png)

可以看到`React` 组件已经渲染出来



## 实践优化篇

### 效率工具

#### 1. 编译进度条

**安装**

```shell
pnpm i progress-bar-webpack-plugin chalk -D
```

**修改`webpack.common.js`** 

```js
import HtmlWebpackPlugin from "html-webpack-plugin";
import ProgressBarPlugin from "progress-bar-webpack-plugin";
import chalk from "chalk";
import { resolveApp } from "./paths.js";

export default {
  entry: {
    index: "./src/index.tsx",
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: [resolveApp("src")],
        type: "asset/resource",
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(js|ts|jsx|tsx)$/,
        include: resolveApp("src"),
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "tsx",
              target: "esNext",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 生成html，自动引入所有bundle
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    // 进度条
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
    }),
  ],
  resolve: {
    extensions: [".tsx", "ts", ".js"],
  },
};

```

#### 2. 编译速度分析

**安装**

```shell
pnpm i speed-measure-webpack-plugin -D
```

**修改`webpack.common.js`**

```js
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";
const smp = new SpeedMeasurePlugin();

export default smp.wrap({
  // ...webpack config...
})
```



### 优化开发

#### 1. 热更新

**安装**

```shell
pnpm i @pmmmwh/react-refresh-webpack-plugin react-refresh -D
```

**修改`webpack.dev.js`** 

```js
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import webpack from "webpack";

export default{
   plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
}
```

#### 2. cache

`webpack5` 可以通过配置`持久化缓存` ，来改善构建速度

**修改`webpack.common.js`** 

```js
export default {
  cache: {
    type: "filesystem"
  }
}
```

#### 3. 限定构建范围

使用`include` 限定资源范围

```js
export default {
  module: {
    rules: [
       {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          include: [resolveApp("src")],
          type: "asset/resource",
      	},
    ]
  }
}
```

#### 4. 优化`resolve` 配置

- 取别名`alias` 

```js
// webpack.common.js

export default {
  resolve: {
        alias: {
          '@': './src'
        },
    }
}
```

- 省略后缀`extensions` 

```js
export default {
  resolve: {
    extensions: ['.tsx','.ts','.js']
  }
}
```

- 制定需要解析的目录`modules` 

```js
export default {
  resolve: {
    modules: [
      'node_modules',
      resolveApp('src')
    ]
  }
}
```

- 是否使用`symlinks` 

```js
export default {
  resolve: {
    symlinks: false
  }
}
```

#### 5. 排除依赖`Externals` 

例如项目中使用了`lodash` 让它排除

```js
// webpack.common.js

export default {
  externals: {
    lodash: {
      commonjs: "lodash",
      commonjs2: "lodash",
      amd: "lodash",
      root: "_"
    }
  }
}
```



### 减少打包体积

#### 1. JS代码压缩

**安装**

```shell
pnpm i terser-webpack-plugin -D
```

**修改`webpack.prod.js`**

```js
import { merge } from "webpack-merge";
import common from "./webpack.common.js";
import TerserPlugin from "terser-webpack-plugin";
import { resolveApp } from "./paths.js";

export default merge(common, {
  output: {
    // bundle 文件名称 【只有这里和开发环境不一样】
    filename: "[name].[contenthash].bundle.js",

    // bundle 文件路径
    path: resolveApp("dist"),

    // 编译前清除目录
    clean: true,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
  },
  mode: "production",
});

```

#### 2. CSS压缩

**安装**

```shell
pnpm i css-minimizer-webpack-plugin -D
```

**修改`webpack.prod.js`** 

```js
import { merge } from "webpack-merge";
import common from "./webpack.common.js";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import { resolveApp } from "./paths.js";

export default merge(common, {
  output: {
    // bundle 文件名称 【只有这里和开发环境不一样】
    filename: "[name].[contenthash].bundle.js",

    // bundle 文件路径
    path: resolveApp("dist"),

    // 编译前清除目录
    clean: true,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerPlugin({
        parallel: 4,
      }),
    ],
  },
  mode: "production",
});

```



### 代码分离

#### 1. 抽离重复代码

**修改`webpack.prod.js`** `splitChunks` 

```js
import { merge } from "webpack-merge";
import common from "./webpack.common.js";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import { resolveApp } from "./paths.js";

export default merge(common, {
  output: {
    // bundle 文件名称 【只有这里和开发环境不一样】
    filename: "[name].[contenthash].bundle.js",

    // bundle 文件路径
    path: resolveApp("dist"),

    // 编译前清除目录
    clean: true,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerPlugin({
        parallel: 4,
      }),
    ],
    splitChunks: {
      // include all types of chunks
      chunks: "all",
      // 重复打包问题
      cacheGroups: {
        // node_modules里的代码
        // 第三方模块
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 10, // 优先级
          enforce: true,
        },
        // 公共模块
        common: {
          name: "common", // chunk名称
          priority: 0, // 优先级
          minSize: 0, // 公共模块的大小限制
          minChunks: 2, // 公共模块最少复用过几次
        },
      },
    },
  },
  mode: "production",
});

```

#### 2. `CSS` 文件分离

**安装**

```shell
pnpm i mini-css-extract-plugin -D
```

**修改`webpack.common.js` ** 使用时间分析有问题，只有删掉时间分析，`loader` 选项中不能使用`boolean&&P{}` 只有`boolean?{}:{}` 

```js
import HtmlWebpackPlugin from "html-webpack-plugin";
import ProgressBarPlugin from "progress-bar-webpack-plugin";

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import chalk from "chalk";

import { resolveApp } from "./paths.js";
const isEnvProduction = process.env.NODE_ENV === "production";

export default {
  entry: {
    index: "./src/index.tsx",
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: [resolveApp("src")],
        type: "asset/resource",
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.less$/,
        use: [
          isEnvProduction
            ? ({
                loader: "style-loader",
                options: {
                  esModule: false,
                },
              },
              {
                loader: MiniCssExtractPlugin.loader,
              })
            : {
                loader: "style-loader",
              },
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(js|ts|jsx|tsx)$/,
        include: resolveApp("src"),
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "tsx",
              target: "esNext",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 生成html，自动引入所有bundle
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    // 进度条
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
    }),
    // 分离css
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    extensions: [".tsx", "ts", ".js"],
    alias: {
      "@": resolveApp("src"),
    },
    modules: [resolveApp("src"), "node_modules"],
  },
  cache: {
    type: "filesystem", // 使用文件缓存
  },
};

```

#### 3. 最小化`entry chunk` 

**修改`webpack.prod.js`** 通过下面的配置，为运行时代码创建一个额外的`chunk` ，减少`entry chunk` 体积，提高性能

```js
export default {
  optimization: {
        runtimeChunk: true,
      },
   };
}
```



### ### 加快加载速度

#### 1. 按需加载

使用`import()` 语法懒加载

```js
export default function App(){
  return (
  	<div>
    	<button onClick={()=>import('lodash')}>按需加载</button>
		</div>
  )
}
```

#### 2. 浏览器缓存

`webpack` 支持根据资源内容，创建`hash id` ，当资源内容发生变化时，将创建新的`hash id` 

**配置`JS bundle hash`** 

```js
// webpack.common.js

export default {
  output: {
    filename: isEnvProduction ? '[name].[contenthash].bundle.js':'[name].bundle.js'
  }
}
```

**配置`CSS bundle hash`** 

```js
// webpack.common.js

export default {
  plugins: [
    new MiniCssExtractPlugin({
       filename: isEnvProduction ? "[name].[hash:8].css" : "[name].css",
    })
  ]
}
```



**配置`optimization.moduleIds`** 让公共包`splitChunks` 的`hash` 不因新的依赖而改变，减少非必要的`hash` 变动

```js
// webpack.prod.js

export default {
   optimization: {
    moduleIds: 'deterministic',
  }
}
```



### 总结：

- 在小型项目中，添加过多的优化配置，作用不大，反而会因为额外的`loader` 、`plugin` 增加构建时间
- 在加快构建时间方面，作用最大的是配置`cache` ，可大大加快二次构建速度
- 在减小打包体积方面，作用最大的是`压缩代码` 、`分离重复代码` 、`Tree Shaking` 可最大幅度减小打包体积
- 在加快加载速度方面，`按需加载` 、`浏览器缓存` 、`CDN` 效果都很显著

### ## 自定义篇

#### 自定义`loader` 

自定义一个解析`md` 的`loader` 

> 参考地址：[构建webpack5知识体系【近万字总结】 - 掘金 (juejin.cn)](https://juejin.cn/post/7062899360995999780#heading-33)

**准备工作**

![image-20230112194714696](https://raw.githubusercontent.com/ohlyf/img-url/master/202301121947754.png)

**配置`webpack.common.js`** 

```js
     {
        test: /\.md$/,
        use: [
          {
            loader: resolveApp("loaders") + "/html-color-loader.cjs",
            options: {
              text: "world",
            },
          },
          {
            loader: resolveApp("loaders") + "/md-loader.cjs",
            options: {
              headerIds: false,
            },
          },
        ],
      },
```



**添加`md-loader.cjs`** 用于转换成`html` 

```js
const marked = require("marked");

function markdownLoader(source) {
  // 获取配置的options
  const options = this.getOptions();
  const html = marked.parse(source, options);
  return JSON.stringify(html);
}
module.exports = markdownLoader;

```

**添加`html-color-loader.cjs` ** 用于自定义某些操作

```js
function htmlColorLoader(source) {
  // 获取配置的options
  const options = this.getOptions();
  const newStr = source.replace("hello", `<span>hello ${options.text}</span>`);
  const code = `module.exports = ${newStr}`;
  return code;
}

module.exports = htmlColorLoader;

```

**使用**

```js
// src/index.tsx

import html from "../index.md";
document.getElementById("root").innerHTML = html;
```

![image-20230112195153910](https://raw.githubusercontent.com/ohlyf/img-url/master/202301121951972.png)



### 自定义`plugin` 

#### `webpack` 插件组成

- 一个具名`JavaScript` 函数
- 在它的原型上定义`apply` 方法
- 指定一个触及到`webpack` 本身的事件钩子
- 操作`webpack` 内部的实例特定数据
- 在实现功能后调用`webpack` 提供的`callback` 

插件由一个构造函数实例化出来，构造函数定义`apply` 方法，在安装插件时，`apply` 方法会被`webpack compiler` 调用一次，`apply` 方法可以接收一个`webpack compiler` 对象的引用，从而可以在回调函数中访问到`compiler` 对象

#### 实现一个输出文件夹大小的`plugin` 

**修改`webpack.common.js`** 

```js
import BundleSizePlugin from "../plugin/BundleSizePlugin.cjs";

 plugins: [
    // 输出文件夹大小
    new BundleSizePlugin({
      limit: 3,
    }),
  ],
```

**新增`plugin/BundleSizePlugin.cjs`** 

```js
const { statSync } = require("fs");
const { resolve } = require("path");

class BundleSizePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { limit } = this.options;
    compiler.hooks.done.tap(`BundleSizePlugin`, (stats) => {
      const { path } = stats.compilation.outputOptions;
      const bundlePath = resolve(path);
      const { size } = statSync(bundlePath);
      const bundleSize = size;
      if (bundleSize < limit) {
        console.log(
          "输出success-----bundleSize:",
          bundleSize,
          "\n limit:",
          limit,
          "小于限制大小"
        );
      } else {
        console.log(
          "输出error-----bundleSize:",
          bundleSize,
          "\n limit:",
          limit,
          "超出限制大小"
        );
      }
    });
  }
}

module.exports = BundleSizePlugin;

```

**效果**

![image-20230113101740043](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131017139.png)

