const fetch = require('node-fetch')
const NimiqWallet = require('../dist/index.cjs.js').default

// strategy enlist away hurt adjust firm antenna toss rocket away side rural
// NQ95 539J MQY1 QYES MVUE 6444 0C91 DK4F U0P6
const mnemonic = 'strategy enlist away hurt adjust firm antenna toss rocket away side rural'
const wallet = NimiqWallet.fromMnemonic(mnemonic)

async function getCurrentHeight () {
  const res = await fetch('https://api-2.rawtx.io/v1/nim/blocks')
  const j = await res.json()
  const total = j.totalItems
  return total
}

async function generateTransactions () {
  const height = await getCurrentHeight()
  const tx = wallet.generateTransaction({
    to: 'NQ49 GMD0 FDKS 9HTY DQQ7 M8D4 P2TN 5CN0 TDU9',
    value: 0.1 * 1e5,
    fee: 0.01 * 1e5,
    height
  })

  console.log(tx.toHex())
}

generateTransactions()
