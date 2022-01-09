#!/usr/bin/env node
const prompts = require('prompts')
const execa = require('execa')
const types = require('./types')
const chalk = require('chalk')

const typesList = types.map(type => ({
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
  message: prev => {
    const target = typesList.find(type => type.value === prev)
    return `${target.emoji} ${target.title}`
  },
  validate: value => {
    if (!value) {
      return 'Commit message is required.'
    }
    return true
  }
}

;(async () => {
  let isCanceled = false

  const response = await prompts([
    step_type,
    step_message
  ], {
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
    console.log(chalk.magentaBright(' commit abort. '))
    return false
  }

  const { commit_type, commit_message } = response
  const type = typesList.find(type => type.value === commit_type)
  const msg = `${type.emoji} ${commit_type}: ${commit_message}`

  try {
    const commitResult = await execa('git', ['commit', '-m', msg])
    const branchHashName = commitResult.stdout.match(/\[(.*)\]/).pop()
    const [branchName, branchHash] = branchHashName.split(' ')

    console.log(chalk.green(msg))
    console.log(chalk.bold(branchName), chalk.bgCyanBright.black(` ${branchHash} `))
  } catch (error) {
    if (error.exitCode === 1) console.log(chalk.bgRed.white(' Nothing to commit. '))
    else console.error(error)
  }
})()
