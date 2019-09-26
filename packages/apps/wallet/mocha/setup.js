/* global global, require */

require('@babel/register')({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  include: [/node_modules\/@linkdrop\/commons/]
})

global.MASTER_COPY = '1'
global.FACTORY = '1'
global.CLAIM_HOST = 'http://claim.linkdrop.io'
global.API_HOST_MAINNET = 'http://mainnet.linkdrop.io'
global.API_HOST_RINKEBY = 'http://rinkeby.linkdrop.io'
global.API_HOST_GOERLI = 'http://goerli.linkdrop.io'
global.INITIAL_BLOCK_MAINNET = 0
global.INITIAL_BLOCK_RINKEBY = 0
global.INITIAL_BLOCK_GOERLI = 0
global.AUTH_CLIENT_ID = '1919191'
global.AUTH_API_KEY = '676767'
global.AUTH_DISCOVERY_DOCS = '[]'
global.AUTH_SCOPE_CONTACTS = ''
global.AUTH_SCOPE_DRIVE = ''
global.INFURA_PK = '123'
global.DEFAULT_CHAIN_ID = 4
