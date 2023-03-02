import * as core from '@actions/core'
import { determineSemverChange, getCurrentGitRef, getGitDiff, loadChangelogConfig, parseCommits } from 'changelogen'
import { generateNewVersion, getCurrentVersion, incrementVersion } from './version'

async function run(): Promise<void> {
  try {
    const releaseBranch = core.getInput('release_branch')
    const edge = core.getInput('is_edge') === 'true'

    const from = await getCurrentVersion()
    const to = await getCurrentGitRef()

    core.info(`Current version: ${from}`)
    core.info(`Current branch: ${to}`)

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
    const nextVersion = incrementVersion(from, type)

    const newVersion = await generateNewVersion(nextVersion, {
      to,
      releaseBranch,
      edge,
      numberOfCommits: rawCommits.length,
      shortHash: rawCommits[rawCommits.length - 1].shortHash,
    })

    core.setOutput('version', newVersion)
  }
  catch (error) {
    if (error instanceof Error)
      core.setFailed(error.message)
  }
}

run()
