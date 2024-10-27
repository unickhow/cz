import prompts from 'prompts'
import execa from 'execa'
import { commitTypes } from '../helper'
import picocolors from 'picocolors'

const typesList = commitTypes.map(type => ({
  title: type.name,
  description: `${type.emoji} ${type.description}`,
  value: type.value,
  emoji: type.emoji
}))

const step_type = {
  type: 'autocomplete',
  name: 'commit_type',
  message: 'Pick a commit type.',
  choices: typesList,
  fallback: 'No matched type.'
}

const step_message = {
  type: 'text',
  name: 'commit_message',
  message: (prev: string) => {
    const target = typesList.find(type => type.value === prev)!
    return `${target.emoji} ${target.title}`
  },
  validate: (value: string) => {
    if (!value) {
      return 'Commit message is required.'
    }
    return true
  }
}

const step_description = {
  type: 'text',
  name: 'commit_description',
  message: 'Commit description (optional)',
  initial: '',
  validate: (value: string) => {
    if (value.length > 100) {
      return 'Description is too long.'
    }
    return true
  }
}

export default async () => {
  let isCanceled = false
  const order = [
    step_type,
    step_message,
    step_description
  ].filter(Boolean) as any // TODO: fix type
  const response = await prompts(order, {
    onSubmit: (prompt, answers) => {
      if (answers === undefined) {
        isCanceled = true
        return true
      }
    },
    onCancel: (prompt) => {
      isCanceled = true
      return false
    }
  })

  if (isCanceled) {
    console.log(picocolors.magenta(' commit abort. '))
    return false
  }

  const { commit_type, commit_message, commit_description } = response
  const type = typesList.find(type => type.value === commit_type)!
  const commitTitle = `${type.emoji} ${commit_type}: ${commit_message}`

  try {
    const commands = commit_description ? ['commit', '-m', commitTitle, '-m', commit_description] : ['commit', '-m', commitTitle]
    const commitResult = await execa('git', commands)
    const branchHashName = commitResult.stdout.match(/\[(.*?)\]/)!.pop()!
    const [branchName, branchHash] = branchHashName.split(' ')
    console.log('-----------------------------------------------------------')
    console.log(picocolors.dim(commitResult.stdout))
    if (commitResult.stderr !== '') {
      console.log('-----------------------------------------------------------')
      console.log(picocolors.dim(commitResult.stderr))
    }
    console.log('-----------------------------------------------------------')
    console.log(`${picocolors.bgGreen(picocolors.bold(' Title       '))} ${picocolors.green(commitTitle)}`)
    if (commit_description) {
      console.log(`${picocolors.bgGreen(picocolors.bold(' Description '))} ${picocolors.green(commit_description)}`)
    }
    console.log(`${picocolors.bgGreen(picocolors.bold(' Commit hash '))} ${picocolors.bold(picocolors.cyan(` ${branchHash} `))} (${picocolors.italic(picocolors.green(branchName))})`)
  } catch (error: any) {
    console.log(picocolors.red(error.stderr))
    if (error.exitCode === 1) console.log(picocolors.bgRed(' No changes added to commit. '))
    else console.error(error)
  }
}
