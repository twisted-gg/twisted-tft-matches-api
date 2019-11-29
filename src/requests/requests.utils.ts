import * as rp from 'request-promise'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'

const json = true
const enum errors {
  NOT_FOUND = 404
}

function errorHandler (e) {
  const { error } = e
  if (!error) {
    throw new InternalServerErrorException()
  }
  const status = error.statusCode
  const message = error.message
  switch (status) {
    case errors.NOT_FOUND:
      throw new NotFoundException(message)
    default:
      throw e
  }
}

export async function request (options: rp.OptionsWithUri, baseUri: string) {
  options = {
    ...options,
    uri: `${baseUri}/${options.uri}`,
    json
  }
  try {
    return await rp(options)
  } catch (e) {
    errorHandler(e)
  }
}
