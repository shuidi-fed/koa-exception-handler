
/**
 * According to the http status code to determine whether it is a client request error
 *
 * @param {number} code
 * @return {boolean}
 */
const isClientError = exports.isClientError = code => code >= 400 && code < 500

/**
 * @param {object} [options]
 * @param {functoin} [options.logger] Custom logger function
 * @param {boolean} [options.production] Specify whether it is a production environment
 * @param {function} [options.clientErrorHandler] Execute when a client request error occurs
 * @param {function} [options.serverErrorHandler] Execute when a server error occurs
 * @param {function} [options.fallback] Executed when an error occurs in the server of the production environment
 */
module.exports = options => {
  const {
    errorLogger = console.error,
    clientErrorHandler,
    serverErrorHandler,
    fallback
  } = options
  let { production } = options

  production = (production != undefined && production != null) // eslint-disable-line
    ? production
    : process.env.NODE_ENV !== 'development'

  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      // Handling client errors
      if (isClientError(err.code)) {
        errorLogger('[CLIENT ERROR]', err, ctx)

        if (clientErrorHandler) {
          clientErrorHandler(ctx, err)
        } else {
          responseError(ctx, err.code, err.toString())
        }
        return
      }

      errorLogger('[SERVER ERROR]', err, ctx)

      // Handling server errors
      if (!production) {
        if (serverErrorHandler) {
          serverErrorHandler(ctx, err)
        } else {
          responseError(ctx, err.code || 500, err.toString())
        }
        return
      }

      // Production environment fallback
      if (fallback) {
        errorLogger('FALLBACK')
        fallback(ctx, err)
      }
    }
  }
}

function responseError (ctx, status, errorString) {
  ctx.status = status
  ctx.type = 'text/plain; charset=utf-8'
  ctx.body = `${isClientError(status) ? 'Client' : 'Server'} error: ` + errorString
}
