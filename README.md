# koa-exception

> Customizable koa exception (error) handling middleware

## Usage

```js
const Koa = require('koa')
const koaException = require('koa-exception')

const app = new Koa()

app.use(koaException(options))
```

## options

### options.logger

Customize `logger` function.

- Type: `function`
- Default: `console.error`

### options.production

Specifies whether it is a production environment that controls the behavior of the middleware when an error occurs on the server side.

- Type: `boolean`
- Default: `process.env.NODE_ENV !== 'development'`

**When `options.production` is `true`, if an error occurs on the server, the `options.fallback` function is executed without sending an error to the client. Of course, you can implement the behavior you expect in `options.fallback`.**

### optioins.clientErrorHandler

The handler that is executed when an error occurs on the client.

- Type: `function`
- Default: `undefined`
- arguments:
  - ctx `Koa context`
  - err `error` - Instance of `Error`

- example:

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

In a **non-production** environment, the handler executed when an error occurs on the server side.

- Type: `function`
- Default: `undefined`
- arguments:
  - ctx `Koa context`
  - err `error` - Instance of `Error`

Usage reference `optioins.clientErrorHandler`.

### optioins.fallback

Similar to `optioins.serverErrorHandler`, except that `optioins.fallback` is a handler that is executed in the production environment when an error occurs on the server side.

- Type: `function`
- Default: `undefined`
- arguments:
  - ctx `Koa context`
  - err `error` - Instance of `Error`