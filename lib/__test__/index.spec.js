const KoaException = require('../index')

test('Handling client errors', async () => {
  let err = null
  const next = async () => {
    err = new Error()
    err.code = 400
    throw err
  }

  const options = {
    errorLogger: jest.fn(),
    clientErrorHandler: jest.fn(ctx => {
      ctx.status = 400
      ctx.type = 'text/plain; charset=utf-8'
      ctx.body = 'Client error'
    })
  }

  const mw = KoaException(options)

  const ctx = {}

  await mw(ctx, next)

  const loggerCalls = options.errorLogger.mock.calls
  const loggerArgs = loggerCalls[0]
  const clientErrorHandlerCalls = options.clientErrorHandler.mock.calls
  const clientErrorHandlerArgs = options.clientErrorHandler.mock.calls[0]

  expect(loggerCalls.length).toBe(1)
  expect(loggerArgs.length).toBe(3)
  expect(clientErrorHandlerCalls.length).toBe(1)
  expect(clientErrorHandlerArgs.length).toBe(2)
  expect(clientErrorHandlerArgs[1]).toBe(err)
  expect(loggerArgs[0]).toBe('[CLIENT ERROR]')
  expect(loggerArgs[1]).toBe(err)
  expect(loggerArgs[2]).toEqual(clientErrorHandlerArgs[0])
})

test('Handling server errors - development', async () => {
  let err = null
  const next = async () => {
    err = new Error()
    err.code = 500
    throw err
  }

  const options = {
    errorLogger: jest.fn(),
    production: false,
    serverErrorHandler: jest.fn(ctx => {
      ctx.status = 500
      ctx.type = 'text/plain; charset=utf-8'
      ctx.body = 'Server error'
    })
  }

  const mw = KoaException(options)

  const ctx = {}

  await mw(ctx, next)

  const loggerCalls = options.errorLogger.mock.calls
  const loggerArgs = loggerCalls[0]
  const serverErrorHandlerCalls = options.serverErrorHandler.mock.calls
  const serverErrorHandlerArgs = options.serverErrorHandler.mock.calls[0]

  expect(loggerCalls.length).toBe(1)
  expect(loggerArgs.length).toBe(3)
  expect(serverErrorHandlerCalls.length).toBe(1)
  expect(serverErrorHandlerArgs.length).toBe(2)
  expect(serverErrorHandlerArgs[1]).toBe(err)
  expect(loggerArgs[0]).toBe('[SERVER ERROR]')
  expect(loggerArgs[1]).toBe(err)
  expect(loggerArgs[2]).toEqual(serverErrorHandlerArgs[0])
})

test('Handling server errors - production', async () => {
  let err = null
  const next = async () => {
    err = new Error()
    err.code = 500
    throw err
  }

  const options = {
    errorLogger: jest.fn(),
    serverErrorHandler: jest.fn(ctx => {
      ctx.status = 500
      ctx.type = 'text/plain; charset=utf-8'
      ctx.body = 'Server error'
    }),
    fallback: jest.fn(ctx => {
      ctx.fallback = true
    })
  }

  const mw = KoaException(options)

  const ctx = {}

  await mw(ctx, next)

  const loggerCalls = options.errorLogger.mock.calls
  const loggerArgs1 = loggerCalls[0]
  const loggerArgs2 = loggerCalls[1]
  const serverErrorHandlerCalls = options.serverErrorHandler.mock.calls
  const fallbackCalls = options.fallback.mock.calls
  const fallbackArgs = fallbackCalls[0]

  expect(loggerCalls.length).toBe(2)
  expect(loggerArgs1.length).toBe(3)
  expect(loggerArgs1[0]).toBe('[SERVER ERROR]')
  expect(loggerArgs1[1]).toBe(err)
  expect(loggerArgs1[2]).toBe(ctx)
  expect(loggerArgs2.length).toBe(1)
  expect(loggerArgs2[0]).toBe('FALLBACK')
  expect(serverErrorHandlerCalls.length).toBe(0)

  expect(fallbackCalls.length).toBe(1)
  expect(fallbackArgs.length).toBe(2)
  expect(fallbackArgs[0].fallback).toBe(true)
  expect(fallbackArgs[1]).toBe(err)
})
