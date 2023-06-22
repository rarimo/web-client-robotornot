import { camelCase, isPlainObject, snakeCase } from 'lodash-es'

type CaseConverter = (value: string) => string

/**
 * Deeply convert all resource object keys to the camel case.
 * Can be used to convert JsonApi data object keys.
 */
export function toCamelCaseDeep<T extends object>(object: T): T {
  return convertCaseDeep(object, camelCase)
}

/**
 * Deeply convert all resource object keys to the snake case
 * Can be used to convert JsonApi parameters object keys.
 */
export function toSnakeCaseDeep<T extends object>(object: T): T {
  return convertCaseDeep(object, snakeCase)
}

function toCase(value: string, converter: CaseConverter) {
  return value
    .split('.')
    .map(str => converter(str))
    .join('.')
}

function convertCaseDeep<T extends object>(
  object: T,
  converter: CaseConverter,
): T {
  if (Array.isArray(object)) {
    const res = object.map(obj => convertCaseDeep(obj, converter))
    return res as unknown as T
  }

  if (isPlainObject(object)) {
    const convertedObject: Record<string, unknown> = {}

    Object.keys(object).forEach(key => {
      const objectRecord = object as Record<string, T>
      convertedObject[toCase(key, converter)] = convertCaseDeep(
        objectRecord[key],
        converter,
      )
    })

    return convertedObject as T
  }

  return object
}
