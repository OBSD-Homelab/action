import * as core from '@actions/core'
import * as architecture from '../architecture'
import * as os from '../operating_system'
import {Shell, toShell} from './shell'

export class Input {
  private run_?: string
  private operatingSystem_?: os.Kind
  private version_?: string
  private imageURL_?: string
  private shell_?: Shell
  private environmentVariables_?: string
  private architecture_?: architecture.Kind

  get version(): string {
    if (this.version_ !== undefined) return this.version_
    return (this.version_ = core.getInput('version', {
      required: true
    }))
  }

  get imageURL(): string {
    if (this.imageURL_ !== undefined) return this.imageURL_
    const input = core.getInput('image_url')
    const imageURL = input ? input : ''
    return (this.imageURL_ = imageURL)
  }

  get operatingSystem(): os.Kind {
    if (this.operatingSystem_ !== undefined) return this.operatingSystem_
    const input = core.getInput('operating_system', {required: true})
    const kind = os.toKind(input)
    core.debug(`operating_system input: '${input}'`)
    core.debug(`kind: '${kind}'`)
    if (kind === undefined) throw Error(`Invalid operating system: ${input}`)
    return (this.operatingSystem_ = kind)
  }

  get run(): string {
    if (this.run_ !== undefined) return this.run_
    return (this.run_ = core.getInput('run', {required: true}))
  }

  get shell(): Shell {
    if (this.shell_ !== undefined) return this.shell_
    const input = core.getInput('shell')
    const shell = input ? toShell(input) : Shell.default
    if (shell === undefined) throw Error(`Invalid shell: ${input}`)
    return (this.shell_ = shell)
  }

  get environmentVariables(): string {
    if (this.environmentVariables_ !== undefined)
      return this.environmentVariables_

    return (this.environmentVariables_ = core.getInput('environment_variables'))
  }

  get architecture(): architecture.Kind {
    if (this.architecture_ !== undefined) return this.architecture_

    const input = core.getInput('architecture')
    core.debug(`architecture input: '${input}'`)
    if (input === undefined || input === '')
      return (this.architecture_ = architecture.Kind.x86_64)

    const kind = architecture.toKind(input)
    core.debug(`kind: '${kind}'`)

    if (kind === undefined) throw Error(`Invalid architecture: ${input}`)

    return (this.architecture_ = kind)
  }
}
