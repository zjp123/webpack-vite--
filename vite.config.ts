import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// vite-plugin-imp 该插件按需加载存在部分样式丢失的情况
// import vitePluginImp from "vite-plugin-imp";
// import styleImport from 'vite-plugin-style-import'
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import'
import mkcert from 'vite-plugin-mkcert'
// import reactRefresh from '@vitejs/plugin-react-refresh'
const path = require('path')
const darkThemeVars = require("antd/dist/default-theme")



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
          // reactRefresh(),
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
              // additionalData: '@import "./src/index.css";',
              modifyVars: {
                "hack": `true;@import "${require.resolve("antd/lib/style/color/colorPalette.less")}";`,
                ...darkThemeVars,
                "@primary-color": " #327EF8",
                "link-color": " #327EF8",
                "border-radius-base": "2px"
              }
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


