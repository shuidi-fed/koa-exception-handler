# koa-exception

> Customizable koa exception (error) handling middleware

## 用法

```js
const Koa = require('koa')
const koaException = require('koa-exception')

const app = new Koa()

app.use(koaException(options))
```

## options

### options.logger

自定义 `logger` 函数。

- Type: `function`
- Default: `console.error`

### options.production

指定是否是生成环境，它能够控制当服务端发生错误时中间件的行为。

- Type: `boolean`
- Default: `process.env.NODE_ENV !== 'development'`

**当 `options.production` 为 `false` 时，如果服务端发生错误，则执行 `options.fallback` 函数，而不会响应错误到客户端。当然，你可以在 `options.fallback` 中实现你期望的行为。**

### optioins.clientErrorHandler

当客户端发生错误时执行的处理函数。

- Type: `function`
- Default: `undefined`
- arguments:
  - ctx `Koa context`
  - err `error` - 错误对象

- 例子：

```js
app.use(koaException({
  clientErrorHandler: (ctx, err) => {
    ctx.status = err.code
    ctx.type = 'text/plain; charset=utf-8'
    ctx.body = 'Client error: ' + err.toString()
  }
}))
```

### optioins.serverErrorHandler

在非生产环境下，当服务端发生错误时执行的处理函数

- Type: `function`
- Default: `undefined`
- arguments:
  - ctx `Koa context`
  - err `error` - 错误对象

用法参考 `optioins.clientErrorHandler`

### optioins.fallback

类似于 `optioins.serverErrorHandler`，只不过，`optioins.fallback` 是在生产环境下，当服务端发生错误时执行的处理函数。

- Type: `function`
- Default: `undefined`
- arguments:
  - ctx `Koa context`
  - err `error` - 错误对象