# 启动项目
该项目利用vue3+vite+typescript仿照trello的一个团队合作的项目
```js
npm i
npm run dev
```
# 在线体验
[在线体验链接](http://101.201.143.127/#/)

# 实现功能
- 看板拖拽
- 任务卡片管理
- 邀请人和被邀请人
- websocket实时变化
- 更改颜色背景




- ！！仅供学习使用

# 开发规范

- Vuex 中要存储一些全局状态，页面级得状态不要存进去，尽量用上页面中得 ref 和 reactive

- Vuex 中所有的状态改变必须调用 commit，不要直接赋值改变。

- 想要把 Vuex 中的状态取出来响应式，必须使用 computed 属性。

- 所有函数接口封装在 api.ts 中，所有类型封装在 globalInterface.ts 中。必须强类型定义。

- 所有页面加载时，必须加过渡动画或者骨架屏。使用 useRequest 这个 hooks 去捕捉 loading 状态。

- 能解决的类型不要写 any！！！

- 父子组件用传值方法和函数回调，不要放到Vuex里一把梭

- src下的引入都用@
