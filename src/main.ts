import * as core from '@actions/core'
import { determineSemverChange, getGitDiff, loadChangelogConfig, parseCommits } from 'changelogen'
import { getCurrentVersion, incrementVersion } from './version'

async function run(): Promise<void> {
  try {
    const from = await getCurrentVersion()
    const to = 'main'

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

    const newVersion = incrementVersion(from, type)

    core.setOutput('version', newVersion)
  }
  catch (error) {
    if (error instanceof Error)
      core.setFailed(error.message)
  }
}

run()
