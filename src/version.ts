import { getLastGitTag } from 'changelogen'
import semver from 'semver'
import type { GenerateNewVersionOptions } from './types'
import { useSlugify } from './slugify'

export const getCurrentVersion = async (): Promise<string> => {
  const from = await getLastGitTag()

  return from.replace(/^v/, '')
}

export const incrementVersion = (current: string, type: semver.ReleaseType): string => {
  if (!current)
    return semver.inc('0.0.0', type) ?? '0.0.0'

  return semver.inc(current, type) ?? current
}

export const generateNewVersion = async (version: string, options: GenerateNewVersionOptions): Promise<string> => {
  if (options.edge) {
    const serializedBranch = useSlugify(options.to)

    // On the release branch
    if (options.releaseBranch === options.to)
      return `${version}-edge.${options.numberOfCommits}.${options.shortHash}`

    // On a feature branch
    if (options.releaseBranch !== options.to)
      return `${version}-${serializedBranch}.${options.numberOfCommits}.${options.shortHash}`
  }

  return version
}
