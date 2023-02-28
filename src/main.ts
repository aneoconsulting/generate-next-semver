import { execSync } from 'node:child_process'
import * as core from '@actions/core'
import { determineSemverChange, getGitDiff, loadChangelogConfig, parseCommits } from 'changelogen'
import semver from 'semver'

async function run(): Promise<void> {
  let from = '0.0.0'
  let haveInitialTag = false
  const to = 'main'

  // Get the version from the last tag
  try {
    from = execSync('git describe --abbrev=0 --tags').toString('utf-8').trim()
    haveInitialTag = true
  }
  catch (error) {
    if (error instanceof Error)
      core.debug(error.message)
  }

  try {
    const config = await loadChangelogConfig(process.cwd(), {
      from: haveInitialTag ? from : '',
      to,
    })

    const rawCommits = await getGitDiff(haveInitialTag ? from : '', to)
    const commits = parseCommits(rawCommits, config).filter(
      c =>
        config.types[c.type]
        && !(c.type === 'chore' && c.scope === 'deps' && !c.isBreaking),
    )

    const type = determineSemverChange(commits, config) || 'patch'
    const newVersion = semver.inc(from, type)

    core.setOutput('version', newVersion)
  }
  catch (error) {
    if (error instanceof Error)
      core.setFailed(error.message)
  }
}

run()
