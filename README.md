


# 前端多语言切换

利用文档碎片渲染dom, 整体替换dom树; 实现多语言切换的功能

[查看示例]( http://www.yuanjingzhuang.com/multi-language-switching/.)


# 使用方法

## 引入
```html
<script src="./js/language.js"></script>
```
## 创建Language对象
```js
new Language(选择器, 语言数据)
```

## 插值表达式
```html
<h1>{{ 变量名 }}</h1>
```

## 自定义指令
```html
<h1 lang="变量"></h1>
```
## 属性
```html
<input lang-placeholder="变量" />
```