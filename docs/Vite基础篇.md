## 预备知识

### 前端工程的痛点

**模块化需求**：业界模块标准非常多，一方面需要落实这些模块标准，保证模块正常加载；另一方面需要兼容不同的模块规范，以适应不同的执行环境

**兼容浏览器，编译高级语法：**由于浏览器的实现规范所限，高级语法需要在浏览器中正常运行，必须转化为浏览器可以理解的形式

**线上代码质量**：考虑代码的`安全性`、`兼容性`、`性能`问题

**开发效率**：项目的冷启动/二次启动时间、热更新时间都可能严重影响开发效率



### 前端构建工具如何解决痛点

**模块化方面：**提供模块加载方案，并兼容不同的模块规范

**语法转译方面：**配合`Sass`、`TSC`、`Babel`等前端工具链，完成高级语法的转译功能，同时对于静态资源也能进行处理，使之能作为一个模块正常加载

**产物质量方面：**在生产环节中，配合`Terser`等压缩工具进行代码压缩和混淆，通过`Tree Shaking`删除未使用的代码，提供对低版本浏览器的语法降级处理

**开发效率方面：**构建工具本身通过各种方式来进行性能优化，包括`使用原生语言Go/Rust`、`no-bundle`等思路，提高系统的启动性能和热更新速度



### Vite的优势

- 模块化方面，Vite基于浏览器原生`ESM`的支持实现`no-bundle`服务模块加载，并且无论是`开发环境`还是`生产环境`，都可以将其他格式的产物(如commonjs)转换为ESM
- 语法转译方面，Vite内置了对TypeScript、JSX、Sass等高级语法的支持，也能够加载各种各样的静态资源，如图片、Worker等
- 产物质量方面，Vite基于成熟的打包工具`Rollup`实现生产环境打包，同时可以配合`Terser`、`Babel`等工具链，可以极大程度保证构建产物的质量



### ES6 Module

ESM是由ECMAScript官方提出的模块化规范，作为一个官方提出的规范，ESM得到了现代浏览器的内置支持，在现代浏览器中，如果在HTML中加入含有`type='module'`属性的script标签，那么浏览器会按照ESM规范来进行`依赖加载`和`模块解析`，这`也是Vite在开发阶段实现no-bundle`的原因，由于模块加载的任务交给了浏览器，即使不打包也可以顺利运行模块代码。



### Webpack为什么不能实现nobundle

平时开发用的都是`webpack-dev-server`，实际上是调用`webpack core`来构建项目，而webpack core正是问题所在，它整体的设计都是基于`bundle`的，包括所有的`loader`和`plugin`都是基于这个约定开发的，所以如果要做esm按需加载，需要重构`webpack core`甚至是重构生态



### 模块化发展历程

1. 在没有模块规范时，主要以`文件划分`、`命名空间`、`立即执行函数`来解决，但最终没有解决模块的加载问题，以及模块之间的依赖关系需要手动维护
2. 又了模块规范时

1. 1. CommonJS是最先出来的，同步加载，拖慢速度，主要用于服务器端
   2. AMD后出，主要用于浏览器端，异步加载，但是没有得到原生支持，需要第三方库来实现，如RequireJS
   3. CMD，阿里的，和AMD类似，需要第三方库SeaJS支持
   4. UMD，不算规范，只是兼容AMD和CommonJS的一个模块化方案，可以同时运行在浏览器和服务端
   5. ESM，官方标准规范，浏览器原生支持，在CommonJS中也支持，可以混搭，跨平台





## Vite初相识

### 项目初始化

```shell
pnpm create vite
```

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131338254.png)

### vite究竟有啥魔力

在`index.html`中我们看到，`body`中除了`root`根节点，还包含了一个声明了`type='module'`的`script`标签，同时src指向了`/src/main.tsx`，此时相当于请求了`http://localhost:3000/src/main.tsx`这个资源，Vite的Dev Server此时会接收到这个请求，然后读取相应的文件内容，进行一定的`中间`处理，最后将处理结果返回给浏览器

```html
<script type="module" src="/src/main.tsx"></script>
```

浏览器并不能识别TSX语法呀，也无法直接import css文件，又怎么执行代码呢，这就归功于`Vite Dev Server`所做的`中间处理`了，也就是说，在读取到`main.tsx`文件的内容之后，Vite会对文件的内容进行编译成浏览器可以识别的代码，与此同时，一个import语句即代表一个HTTP请求，Vite Dev Server会读取本地文件，返回浏览器可以解析的代码，当浏览器解析到新的import语句，又回发出新的请求，以此类推，直到所有的资源都加载完成



### no-bundle真正的含义

利用浏览器原生ES模块的支持，实现开发阶段的Dev Server，进行模块的按需加载，而不是`先完整打包再进行加载`



## 接入CSS方案

### 社区对CSS的解决方案

1. `CSS预处理器`：主流的包括`Sass/Scss`、`Less`和`Stylus`
2. `CSS Modules`：能将CSS类名处理成哈希值，这样就可以避免同名的情况下`样式污染`的问题
3. `CSS后处理器PostCSS`：用来解析和处理CSS代码，可以实现的功能例如`px`转`ren`，自动加属性前缀等
4. `CSS in JS`，主流的有`emotion`、`styled-components`等，基本包含`CSS 预处理器`和`CSS Modules`的各项优点，非常灵活，解决了开发体验和全局样式污染的问题
5. CSS原子化框架，如`Tailwind CSS`、`Windi CSS`通过类名来指定样式，大大简化了样式写法，提高了样式开发的效率，主要解决了`原生CSS开发体验`的问题



### 配置Sass

```shell
pnpm i sass -D
```

css文件名以`scss`结尾

全局`variable.scss`的自动引入方案，即不再需要在各个文件中引入`variable.scss`

```typescript
// vite.config.ts
import {normalizePath} from 'vite'
// 如果类型报错，需要安装@types/node:  pnpm i @types/node -D
import path from 'path'

// 全局scss文件的路径
// 用normalizePath解决window下的路径问题
const variablePath=normalizePath(path.resolve('./src/variable.scss'))

export default defineConfig({
  // css 相关的配置
  css:{
    preprocessOptions:{
      scss:{
        // additionalData的内容会在每个scss文件的开头自动引入
        additionalData:`@import "${variablePath}";`
      }
    }
  }
})
```



### 配置CSS Modules

直接将`index.scss`更名为`index.module.scss`，然后改动引入，标签的类名就会被处理成哈希值的形式

自定义哈希值格式：

```typescript
// vite.config.ts
export default{
  css:{
    modules:{
      // 一般我们可以通过generateScopedName属性来对生成的类名进行自定义
    	// 其中，name表示当前文件名，local表示类名
      generateScopedName:"[name]__[local]__[hash:base64:5]"
    },
  }
}
```



### 配置PostCSS

```shell
pnpm i autoprefixer -D
```

自动加前缀的插件

```typescript
// vite.config.ts 增加如下的配置
import autoprefixer from 'autoprefixer'

export default{
  css:{
    // 进行PostCSS配置
    postcss:{
      plugins:[
        autoprefixer({
          // 指定目标浏览器
          overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
        })
        ]
    }
  }
}
```





## 代码规范

### ESLint

```shell
pnpm i eslint -D
```

执行ESLint的初始化命令，并进行如下的命令行交互：

```shell
npx eslint --init
```

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131338262.png)

### .eslintrc.js核心配置解读

#### `parser-解析器`

**ESLint底层默认使用**`**Espree**`**来进行AST解析，这个解析器目前基于**`**Acron**`**来实现，但是不支持TS，所以社区提供了**`**@ typescrip-eslint/parser**`**这个解决方案，专门为了TS的解析而诞生，将**`**TS**`**代码转化为**`**Espree**`**能够识别的格式即**`**Estree**`**，然后在Eslint下通过**`**Espree**`**进行格式检查，以此兼容了TS语法**

#### `parserOptions-解析器选项`

- ecmaVersion：可以配置`ES+数字`或`ES+年份`，也可以直接配置为`latest`，启用最新的ES语法
- sourceType：默认为`script`，如果使用ES Module则应设置为`module`
- ecmaFeatures：标识想使用的额外语言特性，如开启`jsx`

#### `rules-具体代码规则`

```javascript
quotes: ["error", "single"],
```

- `off`或`0`：表示关闭规则
- `warn`或`1`：表示开启规则，不过违背规则后只抛出warning，而不会导致程序退出
- `error`或`2`：表示开启规则，不过违背规则后抛出error，程序会退出

#### `plugins`

```javascript
// .eslintrc.js
module.exports = {
  // 添加 TS 规则，可省略`eslint-plugin`
  plugins: ['@typescript-eslint']
}
```

ESLint本身没有内置TS的代码规则，这个时候ESLint的插件系统就派上用场了，我们需要通过添加ESLint插件来增加一些特定的规则，比如添加`@ typescript-eslint/eslint-plugin`来扩展一些关于TS代码的规则：

添加了插件后只是扩展了ESLint本身的规则集，但ESLint默认`并没有开启`这些规则的校验，如果要开启或者调整这些规则，需要在rules中进行配置：

```javascript
// .eslintrc.js
module.exports = {
  // 开启一些 TS 规则
  rules: {
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
  }
}
```

#### `extends-继承配置`

extends相当于`继承`另外一份ESLint配置，主要三种情况：

1. 从ESLint本身继承
2. 从类似`eslint-config-xxx`的npm包继承
3. 从ESLint插件继承

```javascript
// .eslintrc.js
module.exports = {
   "extends": [
     // 第1种情况 
     "eslint:recommended",
     // 第2种情况，一般配置的时候可以省略 `eslint-config`
     "standard"
     // 第3种情况，可以省略包名中的 `eslint-plugin`
     // 格式一般为: `plugin:${pluginName}/${configName}`
     "plugin:react/recommended"
     "plugin:@typescript-eslint/recommended",
   ]
}
```

有了继承，我们就不需要手动一一开启了

#### `env和globals`

这两个配置分别表示`运行环境`和`全局变量`，在指定的运行环境中会预设一些全局变量，比如：

```javascript
// .eslint.js
module.export = {
  "env": {
    "browser": "true",
    "node": "true"
  }
}
```

如上述，就会启用浏览器和NodeJS环境，这两个环境中的一些全局变量(如`window`、`global`）会同时启用



有些全局变量是业务代码引入的第三方库所声明的，这里就需要在`globals`配置中声明全局变量了，每个全局变量的配置值都有三种情况：

1. `writable`或者`true`，表示变量可重写
2. `readonly`或者`false`，表示变量不可重写
3. `off`，表示禁用该全局变量

例如`jquery`：

```typescript
// .eslintrc.js
module.exports = {
  "globals": {
    // 不可重写
    "$": false, 
    "jQuery": false 
  }
}
```



### Prettier

```shell
pnpm i prettier -D
```

在项目根目录新建`.prettierrc.js`配置文件，填写如下：

```javascript
// .prettierrc.js
module.exports = {
  printWidth: 80, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2, // 一个 tab 代表几个空格数，默认为 2 个
  useTabs: false, //是否使用 tab 进行缩进，默认为false，表示用空格进行缩减
  singleQuote: true, // 字符串是否使用单引号，默认为 false，使用双引号
  semi: true, // 行尾是否使用分号，默认为true
  trailingComma: "none", // 是否使用尾逗号
  bracketSpacing: true // 对象大括号直接是否有空格，默认为 true，效果：{ a: 1 }
};
```

接下来我们将`Prettier`集成到现有的`ESLint`工具中，首先安装工具包：

```shell
pnpm i eslint-config-prettier eslint-plugin-prettier -D
```

其中`eslint-config-prettier`用来覆盖ESLint本身的规则配置，而`eslint-plugin-prettier`则用于让Prettier来接管`eslint --fix`即修复代码的能力



在`.eslintrc.js`配置接入prettier：

```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    // 1. 接入 prettier 的规则
    'prettier',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  // 2. 加入 prettier 的 eslint 插件
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    // 3. 注意要加上这一句，开启 prettier 自动修复的功能
    'prettier/prettier': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'react/react-in-jsx-scope': 'off'
  },
  settings: {
    react: {
      version: 'detect' // 不支持react最新版时
    },
    typescript: {
      version: 'detect'
    }
  }
};
```

#### 在Vite中接入ESLint

```javascript
pnpm i vite-plugin-eslint -D
```

然乎在`vite.config.ts`中接入：

```typescript
import viteEslint from 'vite-plugin-eslint'

{
  plugins:[
    viteEslint()
  ]
}
```



### 接入Stylelint

支持CSS预处理器

```shell
pnpm i stylelint stylelint-prettier stylelint-config-prettier stylelint-config-recess-order stylelint-config-standard stylelint-config-standard-scss -D
```

在`.stylelintrc.js`中使用这些工具套件：

```javascript
// .stylelintrc.js
module.exports = {
  // 注册 stylelint 的 prettier 插件
  plugins: ['stylelint-prettier'],
  // 继承一系列规则集合
  extends: [
    // standard 规则集合
    'stylelint-config-standard',
    // standard 规则集合的 scss 版本
    'stylelint-config-standard-scss',
    // 样式属性顺序规则
    'stylelint-config-recess-order',
    // 接入 Prettier 规则
    'stylelint-config-prettier',
    'stylelint-prettier/recommended'
  ],
  // 配置 rules
  rules: {
    // 开启 Prettier 自动格式化功能
    'prettier/prettier': true
  }
};
```

rule三种配置方式

- `null`，表示关闭规则
- 一个简单值如`true`表示开启规则，但并不作过多的定制
- 一个数组，包含两个元素，即`[简单值，自定义配置]`，第一个元素为简单值，第二个元素用来进行更精细化的配置规则



#### vite集成Stylelint

```shell
pnpm i @amatlash/vite-plugin-stylelint -D
```

配置

```javascript
// vite.config.ts
import viteStylelint from '@amatlash/vite-plugin-stylelint';

// 具体配置
{
  plugins: [
    // 省略其它插件
    viteStylelint({
      // 对某些文件排除检查
      exclude: /windicss|node_modules/
    }),
  ]
}
```



### Husky+lint-staged的Git提交工作流

#### 提交前的代码lint检查

安装：

```shell
pnpm i husky -D
```

 配置：

1. 初始化 Husky: npx husky install，并将 husky install作为项目启动前脚本，如:

```javascript
{
  "scripts": {
    // 会在安装 npm 依赖后自动执行
    "prepare": "husky install"
  }
}
```

1. 添加 Husky 钩子，在终端执行如下命令:

```shell
npx husky add .husky/pre-commit "npm run lint"
```

#### 不做全量检查，只检查暂存区的文件

安装：

```shell
pnpm i -D lint-staged
```

配置：

```json
// package.json
{
  "lint-staged": {
    "**/*.{js,jsx,tsx,ts}": [
      "npm run lint:script",
      "git add ."
    ],
    "**/*.{scss}": [
      "npm run lint:style",
      "git add ."
    ]
  }
}
```

接下来我们需要在 Husky 中应用lint-stage，回到.husky/pre-commit脚本中，将原来的npm run lint换成如下脚本:

```javascript
npx --no -- lint-staged
```



#### 提交时的commi信息规范

安装：

```shell
pnpm i commitlint @commitlint/cli @commitlint/config-conventional -D
```

新建`.commitlintrc.js`:

```javascript
// .commitlintrc.js
module.exports = {
  extends: ["@commitlint/config-conventional"]
};
```

提交规范：

```javascript
<type>: <subject>
```

常用`type`值：

- `feat`：添加新功能
- `fix`：修复Bug
- `chore`：一些不影响功能的更改
- `docs`：专指文档的修改
- `perf`：性能方面的优化
- `refactor`：代码重构
- `test`：添加一些测试代码等

接下来我们将commitlint的功能集成到 Husky 的钩子当中，在终端执行如下命令即可:

```javascript
npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"
```



## 静态资源

#### 配置路径别名

```javascript
// vite.config.ts
import path from 'path';

{
  resolve: {
    // 别名配置
    alias: {
      '@assets': path.join(__dirname, 'src/assets')
    }
  }
}
```

#### svg组件方式加载

安装：

```shell
pnpm i vite-plugin-svgr -D
```

vite配置：

```javascript
// vite.config.ts
import svgr from 'vite-plugin-svgr';

{
  plugins: [
    // 其它插件省略
    svgr()
  ]
}
```

TS配置：

```javascript
// tsconfig.json
{
  "compilerOptions": {
    // 省略其它配置
    "types": ["vite-plugin-svgr/client"]
  }
}
```

项目中使用

```javascript
import { ReactComponent as ReactLogo } from '@assets/icons/logo.svg';

export function Header() {
  return (
    // 其他组件内容省略
     <ReactLogo />
  )
}
```

#### JSON加载

Vite已经内置了对JSON文件的解析，底层使用`@ rollup/pluginutils`和`dataToEsm`方法将JSON对象转换为一个包含各种具名导出的ES模块，如下：

```javascript
import {version} from '../../../package.json'
```

不过可以在配置文件禁用按名倒入的方式：

```javascript
// vite.config.ts

{
  json: {
    stringify: true
  }
}
```

这样会将JSON的内容解析为`export default JSON.parse('xxx')`，这样会失去`按名导出`的能力，不过在JSON数据量较大的时候，可以优化解析性能



#### 其他静态资源

除了上述的一些资源格式，Vite也对下面几类格式提供了内置的支持：

- 媒体类：包括`mp4`、`webm`、`ogg`、`mp3`、`wav`、`flac`和`aac`
- 字体类文件：包括`woff`、`woff2`、`eot`、`ttf`和`otf`
- 文本类：包括`webmanifest`、`pdf`和`txt`

也就是说，可以在Vite将这些类型的文件当作一个ES模块来导入使用，如果项目中还存在其他格式的静态资源，可以通过`assetsInclude`配置来让Vite支持加载

```javascript
// vite.config.ts

{
  assetsInclude: ['.gltf']
}
```



#### 特殊资源后缀

Vite中引入静态资源时，也支持在路径最后加上一些特殊的query后缀，包括：

- `?url`：表示获取资源的路径，这在只想获取文件路径而不是内容的场景将会很有用
- `?raw`：表示获取资源的字符串内容，如果你只想拿到资源的原始内容，可以使用这个后缀
- `?inline`：表示资源强制内联，而不是打包成单独的文件





## 生产环境

#### 自定义部署域名

我们需要区分生产环境和开发环境的地址，配置：

```javascript
// vite.config.ts
const isProduction =process.env.NODE_ENV==='production'

// 填入项目的CDN域名地址
const prodURL='xxxx'


// 具体配置
{
  base: isProduction ? prodURL:'/'
}

// .env.development
NODE_ENV=development

// .env.production
NODE_ENV=production
```

#### 静态资源区分开发环境和生产环境

在项目根目录新增`.env`文件

```javascript
// 开发环境优先级: .env.development > .env
// 生产环境优先级: .env.production > .env
// .env 文件
VITE_IMG_BASE_URL=https://my-image-cdn.com
```



然后进入`src/vite-env.d.ts`增加类型声明：

```tsx
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // 自定义的环境变量
  readonly VITE_IMG_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

值得注意的是，如果某个环境变量要在Vite中通过`import.meta.env`访问，那么它必须以`VITE_`开头，如`VITE_IMG_BASE_URL`，接下来我们来使用：

```javascript
<img src={new URL('./logo.png', import.meta.env.VITE_IMG_BASE_URL).href} />
```



#### 静态资源是否打成base64

Vite内置的优化方案是：

- \>=4kb，则提取成单独的文件
- <4kb，则作为base64格式的字符串内联

自定义：

```javascript
// vite.config.ts
{
  build: {
    // 8 KB
    assetsInlineLimit: 8 * 1024
  }
}
```

svg格式的文件不受这个临时值的影响，始终会打包成单独的文件，因为它和普通格式的图片不一样，需要动态设置一些属性





### 图片压缩

安装：

```shell
pnpm i vite-plugin-imagemin -D
```

在Vite配置文件中引入：

```javascript
//vite.config.ts
import viteImagemin from 'vite-plugin-imagemin';

{
  plugins: [
    // 忽略前面的插件
    viteImagemin({
      // 无损压缩配置，无损压缩下图片质量不会变差
      optipng: {
        optimizationLevel: 7
      },
      // 有损压缩配置，有损压缩下图片质量可能会变差
      pngquant: {
        quality: [0.8, 0.9],
      },
      // svg 优化
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    })
  ]
}
```

打包效果：

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131338264.png)



### 将svg打包成雪碧图

安装：

```shell
pnpm i vite-plugin-svg-icons -D
```

配置：

```typescript
// vite.config.ts
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

{
  plugins: [
    // 省略其它插件
    createSvgIconsPlugin({
      iconDirs: [path.join(__dirname, 'src/assets/icons')]
    })
  ]
}
```

在`src/components`目录下新建`SvgIcon`组件：

```tsx
// SvgIcon/index.tsx
export interface SvgIconProps {
  name?: string;
  prefix: string;
  color: string;
  [key: string]: string;
}

export default function SvgIcon({
  name,
  prefix = 'icon',
  color = '#333',
  ...props
}: SvgIconProps) {
  const symbolId = `#${prefix}-${name}`;

  return (
    <svg {...props} aria-hidden="true">
      <use href={symbolId} fill={color} />
    </svg>
  );
}
```

对Header组件进行更改：

```tsx
// index.tsx
const icons = import.meta.globEager('../../assets/icons/logo-*.svg');
const iconUrls = Object.values(icons).map((mod) => {
  // 如 ../../assets/icons/logo-1.svg -> logo-1
  const fileName = mod.default.split('/').pop();
  const [svgName] = fileName.split('.');
  return svgName;
});

// 渲染 svg 组件
{iconUrls.map((item) => (
  <SvgIcon name={item} key={item} width="50" height="50" />
))}
```

最后在`src/main.tsx`中添加一行代码

```tsx
import 'virtual:svg-icons-register';
```



## 玩转预构建

### 依赖预构建主要做了两件事

一是将其他格式(如CommonJS）的产物转换为ESM格式，使其在浏览器通过`<script type='module'></script>`的方式正常加载

二是打包第三方库的代码，将各个第三方库分散的文件合并到一起，减少HTTP请求数量，避免页面加载性能劣化



自动开启的预构建，预构建产物在`node_modules/.vite`目录下，会设置浏览器强制缓存，过期时间一年，以下3个地方都没有改动，Vite将一直使用缓存文件：

1. package.json的`dependencies`字段
2. 各种包管理器的lock文件
3. `optimizeDeps`配置内容

### 手动开启

少数场景下我们不希望使用本地的缓存文件，比如需要调试某个包的预构建产物，推荐使用下面任意一种方法清理缓存：

1. 删除`node_modules/.vite`目录
2. 在Vite配置文件中，将`optimizeDeps.force`设为`true`
3. 命令行执行`npx vite --force`或者`npx vite optimize`

Vite项目的启动可以分为两步，第一步是依赖预构建，第二部才是Dev Server的启动，`npx vite optimize`相比于其他的方案，仅仅完成第一步的功能



### 预构建自定义参数

预构建的配置项都集中在`vite.config.ts`下的`optimizeDeps`中，下面是一些选项：

#### 入口文件——entries

即`optimizeDeps.entries`，通过这个参数自定义预构建的入口文件。默认情况下，第一次启动时，Vite会默认抓取项目中所有的HTML文件，如`index.html`，将HTML文件作为应用入口，然后根据入口文件扫描出项目中用到的第三方依赖，最后对这些依赖逐个进行编译



当扫描HTML文件的行为无法满足需求的时候，比如项目入口为`vue`格式文件时，就需要通过`entries`来配置了

```javascript
// vite.config.ts
{
  optimizeDeps: {
    // 为一个字符串数组
    entries: ["./src/main.vue"];
  }
}
```

当然，entries 配置也支持 [glob 语法](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmrmlnc%2Ffast-glob)，非常灵活，如:

```javascript
// 将所有的 .vue 文件作为扫描入口
entries: ["**/*.vue"];
```

#### 添加一些依赖——include

include决定了可以强制预构建的依赖项，使用如下:

```javascript
// vite.config.ts
optimizeDeps:{
  // 配置为一个字符串数组，将`lodash-es` 和 `vue` 两个包强制进行预构建
	include:['lodash-es','vue']
}
```

它在使用上并不难，真正难的地方在于，如河找到合适它的使用场景，Vite会根据应用入口（`entries`)自动搜集依赖，然后进行预构建。



#### 是不是说明Vite可以百分百准确地收集到所有的依赖呢？

并不是，某些情况下Vite默认的扫描行为并不完全可靠，这就需要联合配置`include`来达到完美的预构建效果了，预构建需要`include`的场景如下：

##### 场景一：动态import

在某些动态import的场景下，由于Vite天然按需加载的特性，经常会导致某些依赖只能在运行时被识别出来：

```javascript
// src/locales/zh_CN.js
import objectAssign from "object-assign";
console.log(objectAssign);

// main.tsx
const importModule = (m) => import(`./locales/${m}.ts`);
importModule("zh_CN");
```

在这个例子中，动态import的路径只有运行时才能确定，无法在与构建阶段被扫描出来，因此，我们在访问项目时控制台会出现下面的日志信息：

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131340850.png)

上图意思：Vite运行时发现了新的依赖，之后重新进行依赖预构建，并刷新页面，这个过程叫`二次预构建`，二次预构建成本比较淡，会严重拖慢应用的加载速度，因此，我们要尽量避免运行时的`二次预构建`，就可以通过`include`参数提前声明需要按需加载的依赖：

```javascript
// vite.config.ts
{
  optimizeDeps: {
    include: [
      // 按需加载的依赖都可以声明到这个数组里
      "object-assign",
    ];
  }
}
```

##### 场景二：某些包被手动exclude

如下所示：

```javascript
// vite.config.ts
{
  optimizeDeps: {
    exclude: ["@loadable/component"];
  }
}
```

手动排除了预构建的包，`@ loadable/component`本身具有ESM格式的产物，但他的某个依赖`hoist-non-react-statics`的产物并没有提供ESM格式，导致运行时加载错误



这时候`include`配置就派上了用场，我们可以强制对`hoist-non-react-statics`这个间接依赖进行预构建

```javascript
// vite.config.ts
{
  optimizeDeps: {
    include: [
      // 间接依赖的声明语法，通过`>`分开, 如`a > b`表示 a 中依赖的 b
      "@loadable/component > hoist-non-react-statics",
    ];
  }
}
```



## 自定义ESBuild行为

Vite提供了`esbuildOptions`参数来让我们自定义ESBuild本身的配置，常用的场景是加入一些Esbuild插件：

```javascript
// vite.config.ts
{
  optimizeDeps: {
    esbuildOptions: {
       plugins: [
        // 加入 Esbuild 插件
      ];
    }
  }
}
```

### 特殊情况：第三方包出现问题怎么办？

由于我们无法保证第三方包的代码质量，在某些情况下我们会遇到莫名的第三方库报错，例如`react-virtualized`库，这个库被许多组件库用到，但是他的ESM产物有明显问题，在Vite进行预构建的时候会直接抛出这个错误：

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131338295.png)

原因是这个库的ES产物莫名其妙多出一行无用的代码：

```javascript
// WindowScroller.js 并没有导出这个模块
import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";
```

解决方案：

#### 1. 改第三方库代码

我们可以使用`patch-package`这个库来解决这类问题，一方面，它能记录第三方库代码的改动，另一方面也能将改动同步到团队每个成员，`patch-package`官方只支持npm和yarn，而不支持pnpm，不过社区提供了`pnpm`版本，

```javascript
pnpm i @milahu/patch-package -D
```

注意：要改动的包在package.json中必须声明确定的版本，不能有`~`或者`^`的前缀

接着，进入第三方库的代码中进行修改，先删掉无用的import语句，再在命令行输入：

```javascript
npx patch-package react-virtualized
```

现在根目录会多出`patches`目录记录第三方包内容的更改，随后我们在`package.json`的`scripts`中增加如下内容：

```javascript
{
  "scripts": {
    // 省略其它 script
    "postinstall": "patch-package"
  }
}
```

这样一来，每次安装依赖的时候都会通过`postinstall`脚本自动应用patches的修改，解决了团队协作的问题



#### 2. 加入Esbuild插件

第二种方式是通过Esbuild插件修改指定模块的内容，这里展示一下新增的配置内容：

```javascript
// vite.config.ts
const esbuildPatchPlugin = {
  name: "react-virtualized-patch",
  setup(build) {
    build.onLoad(
      {
        filter:
          /react-virtualized\/dist\/es\/WindowScroller\/utils\/onScroll.js$/,
      },
      async (args) => {
        const text = await fs.promises.readFile(args.path, "utf8");

        return {
          contents: text.replace(
            'import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";',
            ""
          ),
        };
      }
    );
  },
};

// 插件加入 Vite 预构建配置
{
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildPatchPlugin];
    }
  }
}
```



### 预构建技术解决的2个问题

1. 模块格式兼容问题
2. 海量模块请求的问题