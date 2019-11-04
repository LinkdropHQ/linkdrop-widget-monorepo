import { getImages } from 'helpers'

export default function ({
  balanceFormatted,
  balance,
  address,
  symbol,
  decimals,
  type,
  price,
  image,
  tokenId
}) {
  let icon
  if (type === 'erc20' && symbol !== 'ETH') {
    icon = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address.toLowerCase()}/logo.png`
  } else if (type === 'erc721') {
    icon = image
  } else if (symbol === 'ETH') {
    icon = getImages({ src: 'ether' }).image
  }
  return {
    balanceFormatted: balanceFormatted && Number(balanceFormatted),
    balance,
    tokenAddress: address,
    icon,
    image,
    symbol,
    decimals,
    tokenId,
    type,
    price,
    name: symbol
  }
}
