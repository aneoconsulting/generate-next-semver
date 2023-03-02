import * as core from '@actions/core'
import { determineSemverChange, getCurrentGitRef, getGitDiff, loadChangelogConfig, parseCommits } from 'changelogen'
import { generateNewVersion, getCurrentVersion } from './version'

async function run(): Promise<void> {
  try {
    const releaseBranch = core.getInput('release-branch')
    const edge = Boolean(core.getInput('release-edge'))

    const from = await getCurrentVersion()
    const to = await getCurrentGitRef()

    const config = await loadChangelogConfig(process.cwd(), {
      from,
      to,
    })

    const rawCommits = await getGitDiff(from, to)
    const commits = parseCommits(rawCommits, config).filter(
      c =>
        config.types[c.type]
        && !(c.type === 'chore' && c.scope === 'deps' && !c.isBreaking),
    )

    const type = determineSemverChange(commits, config) || 'patch'

    const newVersion = await generateNewVersion(from, type, {
      to,
      releaseBranch,
      edge,
      lastCommitSha: rawCommits[rawCommits.length - 1].sha,
    })

    core.setOutput('version', newVersion)
  }
  catch (error) {
    if (error instanceof Error)
      core.setFailed(error.message)
  }
}

run()
