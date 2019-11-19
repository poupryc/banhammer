import pathToRegexp from 'path-to-regexp'

/**
 * Splits a list into sub-lists stored in an object, based on the result of
 * calling a String-returning function on each element, and grouping the
 * results according to values returned.
 * @param fn custom logic Function
 * @param list array to group
 * @return grouped object
 */
export function groupBy<T>(fn: (a: T) => string, list: T[]) {
  var result: Record<string, T[]> = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var key = fn(item)

    if (!result[key]) {
      result[key] = []
    }

    result[key].push(item)
  }

  return result
}

/**
 * Upper first string letter
 * @param s string to upper the first letter
 * @return string with the first letter in capital
 */
export const upperFirst = (s: string) => `${s[0].toUpperCase()}${s.substr(1)}`

type PathToRegexpOption = pathToRegexp.ParseOptions & pathToRegexp.RegExpOptions

/**
 * Format arguments from command usage
 * @param usage command usage
 * @param options pathToRegexpOption
 * @return
 */
export function extractUsage(usage: string, options: PathToRegexpOption) {
  const keys = pathToRegexp.parse(usage ? usage : '', options)

  return keys
    .map(k =>
      typeof k !== 'string' ? (k.optional ? `[${k.name}]` : `<${k.name}>`) : k
    )
    .join(' ')
}

/**
 * Throw error if the value is false
 * @param value value
 * @param message message
 */
export const assert = (value: boolean, message: string) => {
  if (value === false) throw new Error(message)
}
