import { getGitDiff, getLastGitTag } from 'changelogen'
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

export const generateNewVersion = async (from: string, type: semver.ReleaseType, options: GenerateNewVersionOptions): Promise<string> => {
  const incrementedVersion = incrementVersion(from, type)

  if (options.edge) {
    const serializedBranch = useSlugify(options.to)
    const rawCommits = await getGitDiff(from, options.to)
    const lastCommitHash = rawCommits[rawCommits.length - 1].shortHash

    // On the release branch
    if (options.releaseBranch === options.to)
      return `${incrementedVersion}-edge.${rawCommits.length}.${lastCommitHash}`

    // On a feature branch
    if (options.releaseBranch !== options.to)
      return `${incrementedVersion}-${serializedBranch}.${rawCommits.length}.${lastCommitHash}`
  }

  return incrementedVersion
}
