import cli from './commands/index'
import where from './commands/where'
import yargs from 'yargs'

type Args = {
  init?: boolean
  where?: boolean
}

export async function run (args: string[]): Promise<void> {
  const argv = yargs(args)
    .options({
      'where': {
        alias: 'w',
        describe: 'Show config file path.'
      }
    })
    .help()
    .argv as Args
  if (argv.where) {
    where()
  } else {
    cli()
  }
}
