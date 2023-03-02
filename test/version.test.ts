import { describe, expect, it } from 'vitest'
import { generateNewVersion, incrementVersion } from '../src/version'

describe('version', () => {
  describe('incrementVersion', () => {
    it('should return the next patch version', () => {
      const currentVersion = '1.0.0'

      const newVersion = incrementVersion(currentVersion, 'patch')

      expect(newVersion).toBe('1.0.1')
    })

    it('should return the next minor version', () => {
      const currentVersion = '1.0.0'

      const newVersion = incrementVersion(currentVersion, 'minor')

      expect(newVersion).toBe('1.1.0')
    })

    it('should return the next major version', () => {
      const currentVersion = '1.0.0'

      const newVersion = incrementVersion(currentVersion, 'major')

      expect(newVersion).toBe('2.0.0')
    })

    it('should return a first version', () => {
      const currentVersion = ''

      const newVersion = incrementVersion(currentVersion, 'patch')

      expect(newVersion).toBe('0.0.1')
    })
  })

  describe('generateNewVersion', () => {
    it('should return the current version', async () => {
      const currentVersion = '1.0.0'

      const newVersion = await generateNewVersion(currentVersion, {
        to: 'main',
        releaseBranch: 'main',
        edge: false,
        numberOfCommits: 0,
        shortHash: '',
      })

      expect(newVersion).toBe('1.0.0')
    })

    it('should return the current version with edge on main branch', async () => {
      const currentVersion = '1.0.0'

      const newVersion = await generateNewVersion(currentVersion, {
        to: 'main',
        releaseBranch: 'main',
        edge: true,
        numberOfCommits: 2,
        shortHash: 'azerty',
      })

      expect(newVersion).toBe('1.0.0-edge.2.azerty')
    })

    it('should return the current version with edge on a feature branch', async () => {
      const currentVersion = '1.0.0'

      const newVersion = await generateNewVersion(currentVersion, {
        to: 'feature/my-feature',
        releaseBranch: 'main',
        edge: true,
        numberOfCommits: 2,
        shortHash: 'azerty',
      })

      expect(newVersion).toBe('1.0.0-featuremyfeature.2.azerty')
    })
  })
})
