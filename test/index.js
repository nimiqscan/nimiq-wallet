const assert = require('assert')
const NimiqWallet = require('../dist/index.cjs.js').default
const seed = '8f8008e763cf691e2c7a2ca4027ec7a180d4f3d6df7f5c49ee1f0ab1599ae8172ce617a9aef427f4c294cfb3c79ff0264a835ef2c48a62ba5e68e271a174607500'

// address: NQ49 MYQS MT0B 7QYP H4BQ NP9C REDY UXM7 4VC2
const myWallet = NimiqWallet.fromMasterKey(seed)
const tx = myWallet.generateTransaction({
  to: 'NQ49 GMD0 FDKS 9HTY DQQ7 M8D4 P2TN 5CN0 TDU9',
  value: 50000,
  fee: 0,
  height: 170619
})

describe('Nimiq Wallet', function () {
  it('Can get user friendly address', () => {
    const addr = myWallet.getAddress()
    assert.strictEqual(addr, 'NQ49 MYQS MT0B 7QYP H4BQ NP9C REDY UXM7 4VC2')
  })

  it('Can generate tx', () => {
    const hex = tx.toHex()
    const txId = tx.hash()
    assert.strictEqual(hex, '002ce617a9aef427f4c294cfb3c79ff0264a835ef2c48a62ba5e68e271a1746075855a07b67a4c77f6e307aa1a4b8b762b2c0db789000000000000c350000000000000000000029a7b2a13c3f304b827247f6ec70c5a3e293fe0c47500004953a5807632b5587247c809382950ed77a8131c5834110575ba613d88f0972245b1ea9f122fbcad9302d005')
    assert.strictEqual(txId, '276538c25768846401da051e75f0ffa4f3bdc4ec5cb9573e4866cce8017a019e')
  })
})
