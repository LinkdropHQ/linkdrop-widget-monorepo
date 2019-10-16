const ls = (typeof window === 'undefined' ? {} : window).localStorage

export default ({ sessionKeyStore, avatar, chainId }) => {
  const lsData = JSON.parse((ls && ls.getItem && ls.getItem('userData')) || '{}')
  lsData[`_${chainId}`] = {
    sessionKeyStore
  }
  if (ls && ls.setItem) {
    ls.setItem('avatar', avatar)
    ls.setItem('userData', JSON.stringify(lsData))
  }
}
