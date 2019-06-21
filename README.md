#  

## Project setup
```
npm i 

npm run dev 
```
基于vue-cropper封装的 海报相框生成工具

实现功能

1. 生成带相框的图片(最基本的)
2. 图片手势放大缩小
3. 图片旋转
4. 切换选择相框

项目集成:
1. 需要 引入 `vue-cropper`
2. 把相框模板放置到 `public/img/bg`内替换原来的模板文件. 
3. 修改 Poster.vue 文件里 模板的数量 `BGCOUNT = `你的模板数量
4. 拷贝 Poster.vue 到你的工程目录下 按照vue的方式引入 完事



线上体验地址(手机效果更佳):
https://hu6.me/vote/201904/#/poster

扫码体验:

![img](/qrcode.png)