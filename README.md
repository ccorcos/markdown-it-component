# markdown-it-component

> Arbitrary component tag plugin for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.

`[hello]{name: "world"}` => `<hello name="world">`

## Getting Started


```bash
npm install markdown-it markdown-it-component --save
```

```js
var md = require('markdown-it')().use(require('markdown-it-component'))
md.render('[hello]{name: "world"}') // => '<hello name="world">'
```
