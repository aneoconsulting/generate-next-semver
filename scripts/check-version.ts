import { createRegExp, digit, oneOrMore } from 'magic-regexp'

function main() {
  const args = process.argv.slice(2)

  if (args.length !== 1)
    throw new Error('Expected exactly one argument')

  const version = args[0]

  if (!version)
    throw new Error('Expected a version')

  const versionRegExp = createRegExp(oneOrMore(digit)
    .and('.')
    .and(oneOrMore(digit))
    .and('.')
    .and(oneOrMore(digit)).at.lineStart().at.lineEnd(),
  )

  const match = version.match(versionRegExp)

  if (!match)
    throw new Error('Expected a valid version')
}

try {
  main()
}
catch (error) {
  console.error(error)
  process.exit(1)
}
