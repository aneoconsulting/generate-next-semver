import { getLastGitTag } from 'changelogen'
import semver from 'semver'

export const getCurrentVersion = async (): Promise<string> => {
  const from = await getLastGitTag()

  return from.replace(/^v/, '')
}

export const incrementVersion = (current: string, type: semver.ReleaseType): string => {
  if (!current)
    return semver.inc('0.0.0', type) ?? '0.0.0'

  return semver.inc(current, type) ?? current
}
