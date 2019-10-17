module.exports = shipit => {
  require('shipit-deploy')(shipit)

  const network = process.argv[2]
  const PM2_APP_NAME = `wallet-widget-${network}`
  let CUSTOM_PORT

  if (network === 'mainnet') CUSTOM_PORT = 13001
  else if (network === 'rinkeby') CUSTOM_PORT = 13004
  else if (network === 'ropsten') CUSTOM_PORT = 13003
  else if (network === 'xdai') CUSTOM_PORT = 13100

  shipit.initConfig({
    default: {
      repositoryUrl: 'git@github.com:LinkdropHQ/huskiapp.git',
      keepReleases: 3
    },
    rinkeby: {
      deployTo: 'wallet-widget/rinkeby',
      servers: 'root@rinkeby.linkdrop.io',
      branch: 'dev'
    },
    ropsten: {
      deployTo: 'wallet-widget/ropsten',
      servers: 'root@rinkeby.linkdrop.io',
      branch: 'dev'
    },
    mainnet: {
      deployTo: 'wallet-widget/mainnet',
      servers: 'root@rinkeby.linkdrop.io',
      branch: 'dev'
    },
    xdai: {
      deployTo: 'wallet-widget/xdai',
      servers: 'root@rinkeby.linkdrop.io',
      branch: 'dev'
    }
  })

  shipit.blTask('installDependencies', async () => {
    await shipit.remote(
      `cd ${
        shipit.releasePath
      } && yarn cache clean && cd packages/contracts && yarn install`
    )
    shipit.log('Installed yarn dependecies')
  })

  shipit.task('copyConfig', async () => {
    await shipit.copyToRemote(
      '../config/config.json',
      `wallet-widget/${network}/current/packages/server/config/config.json`
    )
  })

  shipit.task('build', async () => {
    await shipit.remote(`cd ${shipit.releasePath} && yarn build`)
  })

  shipit.blTask('stopApp', async () => {
    try {
      await shipit.remote(
        `cd ${
          shipit.releasePath
        } && pm2 stop ${PM2_APP_NAME} && pm2 delete ${PM2_APP_NAME}`
      )
      shipit.log('Stopped app process')
    } catch (err) {
      shipit.log('No previous process to restart. Continuing.')
    }
  })

  shipit.blTask('startApp', async () => {
    await shipit.remote(
      `cd ${
        shipit.releasePath
      } && CUSTOM_PORT=${CUSTOM_PORT} pm2 start --name ${PM2_APP_NAME} npm -- run server`
    )
    shipit.log('Started app process')
  })

  shipit.on('updated', () => {
    shipit.start(['installDependencies'])
  })

  shipit.on('published', () => {
    shipit.start(['copyConfig', 'build', 'stopApp', 'startApp'])
  })
}
