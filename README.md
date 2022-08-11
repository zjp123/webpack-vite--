# webpack-vite--
开发和打包时，node版本需要升级到v16的版本，安装依赖时，node版本需要是v14版本，有的依赖在高版本node下可能有问题。

swiper8，怎么使用都没有问题，swiper@6.8.4,页面使用时css问题：

SwiperSlide组件内需要用div包裹一层样式才能生效如：
 ```js
<SwiperSlide>
    <div className="desc-box"> // 需要用这个desc-box  div包裹一下，如果是swiper8就不需要
        <div className="examSiteType">科二考场</div>
        <div className="content">
          <div className="examSiteAmount">
            <span className="title">考试数量</span>
            <span className="data">102</span>
          </div>
          <div className="siteDeviceCount">
            <span className="title">考台数量</span>
            <span className="data">102</span>
          </div>
          <div className="stuPassRate">
            <span className="title">考生通过率</span>
            <span className="data">102</span>
          </div>
          <div className="avgExamTime">
            <span className="title">平均考试时长</span>
            <span className="data">102</span>
          </div>
        </div>
  </div>
</SwiperSlide>

对应的css写法：

.swiper_box {
      padding: 0 30px;
      .desc-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 30px;
        .examSiteType {
          width: 30px;
          height: 100px;
          padding: 2px;
          color: white;
          font-size: 15px;
          text-align: center;
          background-color: rgba(178, 217, 254, 0.18);
          border: 1px solid transparent;
          border-radius: 4px;
        }

        .content {
          display: flex;
          flex: 1;
          justify-content: space-between;
          padding-left: 20px;

          > div {
            display: flex;
            flex-direction: column;

            .title {
              color: #badfff;
              font-size: 22px;
            }

            .data {
              color: #ffffff;
              font-size: 50px;
            }
          }
        }
      }
    }



```
swiper6.8.4页面布局结构：




vite 不用下载less-loader，直接安装less就行

consola :  https://blog.csdn.net/weixin_42164539/article/details/123388542


npm i @vitejs/plugin-react-refresh

// vite.config.js
import reactRefresh from '@vitejs/plugin-react-refresh'

export default {
  plugins: [reactRefresh()]
}


swiper8版本有问题，需要降到swiper@6.8.4版本
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'


代码中  使用时修改：
<Swiper 
            // modules={[Autoplay]} modules是7以上才有的
            spaceBetween={10} 
            slidesPerView={1} 
            autoplay={{delay: 8000}} 
            loop
            
引入时修改：
import SwiperCore, {Autoplay} from 'swiper'
SwiperCore.use([Autoplay])


引入第三方css库
import '~swiper/swiper-bundle.css'


引入路径最好不要使用相对路径加上@符号，动态引入时，需要使用相对路径
function getImageUrl(path: any) {
  return new URL(`../../assets/svg${path}.svg`, import.meta.url).href
}


vite 开启https 
npm install -g mkcert   https://blog.csdn.net/xfjpeter/article/details/121480873--不用这个了

npm install vite-plugin-imp -D

import vitePluginImp from "vite-plugin-imp";

mkcert()---然后输入sudo密码




静态文件引入如图片svg啥的，不能使用require，那是webpack的语法
import imgUrl from './img.png'

https://vitejs.cn/guide/assets.html#the-public-directory--配置链接



vite中没有process.env 变量，全部替换为import.meta.env

通过生成，.env.development文件配置开发环境变量，通过.env.production，配置生产环境

require('..../xxx.js/ts)啥的统一用 import 引入

vite.config配置文件
```js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// vite-plugin-imp 该插件按需加载存在部分样式丢失的情况
// import vitePluginImp from "vite-plugin-imp";
// import styleImport from 'vite-plugin-style-import'
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import'
import mkcert from 'vite-plugin-mkcert'
import reactRefresh from '@vitejs/plugin-react-refresh'
const path = require('path')



export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  // console.log(env, 'lllll')
  return {
        resolve: {
          alias: {
            '@': path.join(__dirname, 'src'),
            '#': path.join(__dirname, 'types')
          }
        },
        server: {
          https: true
        },
        build: {
          // 压缩
          minify: env.VITE_NODE_ENV === 'production' ? 'esbuild' : false,
          // minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
        },
        define: {
          // 'process.env.NODE_ENV': '"production"'
            // "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
            // "process.env.NODE_ENV": '"development"',
            // 'process.env.NODE_ENV': '"development"'
        },
        plugins: [
          reactRefresh(),
          mkcert(),
          react(),
          createStyleImportPlugin({
            // 引入AntD3样式
            resolves: [AntdResolve()],
            libs: [
              // 引入AntD4样式
              {
                libraryName: 'antd4',
                esModule: true,
                resolveStyle: (name) => {
                  // vite开发模式下，此处路径需要额外加node_modules，很奇怪，暂时没有深究原因
                  return `node_modules/antd/es/${name}/style/index`
                },
              },
            ],
          })
          // styleImport({
          //   libs: [
          //     {
          //       libraryName: 'antd',
          //       esModule: true,
          //       resolveStyle: (name) => {
          //         return `antd/es/${name}/style/index`;
          //       },
          //     },
          //   ],
          // }),
          // vitePluginImp({
          //   libList: [
          //     {
          //       libName: "antd",
          //       style: (name) => {
          //         if (name === "col" || name === "row") {
          //           return "antd/lib/style/index.less";
          //         }
          //         return `antd/es/${name}/style/index.less`;
          //       },
          //     },
          //   ],
          // }),
        ],
        css: {
          preprocessorOptions: {
            less: {
              javascriptEnabled: true,
              // modifyVars: themeVariables,
            },
          },
        }
  }
})


// https://vitejs.dev/config/
// export default ({ mode }) => {
//   // const huanjing = loadEnv(mode, process.cwd()).VITE_NODE_ENV
//   return defineConfig({
//     resolve: {
//       alias: {
//         '@': path.join(__dirname, 'src'),
//         '#': path.join(__dirname, 'types')
//       }
//     },
//     build: {
//       // 压缩
//       minify: process.env.VITE_NODE_ENV === 'production' ? 'esbuild' : false,
//     },
//     // define: {
//     //   // 'process.env.NODE_ENV': 'process.env.NODE_ENV',
//     //   'process.env': {
//     //     NODE_ENV: huanjing
//     //   }
//     // },
//     plugins: [
//       react(),
//       vitePluginImp({
//         libList: [
//           {
//             libName: "antd",
//             style: (name) => {
//               if (name === "col" || name === "row") {
//                 return "antd/lib/style/index.less";
//               }
//               return `antd/es/${name}/style/index.less`;
//             },
//           },
//         ],
//       }),
//     ],
//     css: {
//       preprocessorOptions: {
//         less: {
//           javascriptEnabled: true,
//           // modifyVars: themeVariables,
//         },
//       },
//     },
//     // resolve:{
//     //   //设置路径别名
//     //   alias: {
//     //     '@': path.resolve(__dirname, 'src'),
//     //     '*': path.resolve('')
//     //     },
//     // },
//   })
// }






tsconfig配置文件

{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "./",
    "paths": {
      "@/*":["src/*"],
      "#/*":["types/*"]
    },
    "types": [
      "vite/client"
    ]
  },
  // "include": ["src"],
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "*.d.ts",
  ],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```



