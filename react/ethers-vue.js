
const { createApp } = Vue


const multicall_abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "getCurrentBlockTimestamp",
    "outputs": [
      {
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "components": [{ "name": "target", "type": "address" }, { "name": "callData", "type": "bytes" }],
        "name": "calls",
        "type": "tuple[]"
      }
    ],
    "name": "aggregate",
    "outputs": [
      {
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "name": "returnData",
        "type": "bytes[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getLastBlockHash",
    "outputs": [
      {
        "name": "blockHash",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "getEthBalance",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getCurrentBlockDifficulty",
    "outputs": [
      {
        "name": "difficulty",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getCurrentBlockGasLimit",
    "outputs": [
      {
        "name": "gaslimit",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getCurrentBlockCoinbase",
    "outputs": [
      {
        "name": "coinbase",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "blockNumber",
        "type": "uint256"
      }
    ],
    "name": "getBlockHash",
    "outputs": [
      {
        "name": "blockHash",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]


const ethChainId = 1

const MaxInt256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

const addresses = {

  multicall: {
    97: '0x301907b5835a2d723Fe3e9E8C5Bc5375d5c1236A',
    42161: '0x842eC2c7D803033Edf55E478F461FC547Bc54EB2',
    56: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
    1116: '0xE294368ad130919edeEbFD877FD7Bb69b6cC1DDb',
    1: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    66: '0x4Dbb06bCdd902F172ee0Af6182896032f04eE04e',
    109: '0x417Cf56c334CCC2Db9148673819760B7613B5c44'
  },
}
// 0xd49C0Ab3ba5F67FDc0eD7A6c9C166E7bD96d7ADC


const provider = {
  [97]: 'https://bsc-testnet.public.blastapi.io',
  [1]: 'https://eth.llamarpc.com',
  [56]: 'https://bsc.publicnode.com',
  [42161]: 'https://arbitrum-one.public.blastapi.io',
  [66]: 'https://oktc-mainnet.public.blastapi.io',
  [109]: ' https://www.shibrpc.com',
}

// const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(provider[ethChainId])
const simpleRpcProvider = new ethers.providers.JsonRpcProvider(provider[ethChainId])

const getProvider = (chainId) => {
  const simpleRpcProvider = new ethers.providers.JsonRpcProvider(provider[chainId])
  return simpleRpcProvider
}

const multicall = async (chainId, abi, calls) => {
  const multi = new ethers.Contract(addresses.multicall[chainId], multicall_abi, getProvider(chainId))
  const itf = new ethers.utils.Interface(abi)

  const calldata = calls.map((call) => ({
    target: call.address.toLowerCase(),
    callData: itf.encodeFunctionData(call.name, call.params),
  }))

  const { returnData } = await multi.aggregate(calldata)

  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

  return res
}



const match = (value) => {
  return value.match(/reverted[:|A-z|\-|\s|0-9]+/)?.toString()
}


const toFixed = (value) => {
  const { utils, bingNumber } = ethers
  // ethers.bingNumber.from(value).mul(1000)

  return Math.floor(Number(utils.formatUnits(ethers.BigNumber.from(value).mul(1000), 18))) / 1000
}



const requestPublicData = async (chainId, account) => {
  const { utils } = ethers

  const mintCalls = ['totalClaimable', 'claimPrice', 'claimAmount', 'minClamins', 'maxClamins', 'claimPeriodEnd', 'claimPeriodStart', 'userClaimLimit'].map((method) => {
    return {
      address: addresses.mint[chainId],
      name: method,
      params: [],
    }
  })

  const mainCalls = [
    {
      address: addresses.multicall[chainId],
      name: 'getEthBalance',
      params: [account],
    },
    {
      address: addresses.mint[chainId],
      name: 'userClaims',
      params: [account],
    },
    {
      address: addresses.token[chainId],
      name: 'allowance',
      params: [addresses.isApp[chainId], addresses.mint[chainId]],
    },
    {
      address: addresses.towMint[chainId],
      name: 'totalClaimable',
      params: [],
    },
    {
      address: addresses.towMint[chainId],
      name: 'userClaims',
      params: [account],
    },
    {
      address: addresses.oneMint[chainId],
      name: 'totalClaimable',
      params: [],
    },
    {
      address: addresses.oneMint[chainId],
      name: 'userClaims',
      params: [account],
    },
  ]


  const ABI = multicall_abi.concat(mint_ABI).concat(babyBurnToken_ABI)
  const CALLS = mintCalls.concat(mainCalls)

  const result = await multicall(chainId, ABI, CALLS)
  const [

    [totalClaimable],
    [claimPrice],
    [claimAmount],
    [minClamins],
    [maxClamins],
    [claimPeriodEnd],
    [claimPeriodStart],
    [userClaimLimit],
    [balance],
    [userClaims],
    [allowance],
    [twoTotalClaimable],
    [twoUserClaims],
    [oneTotalClaimable],
    [oneUserClaims]
  ] = result

  const claimAmounts = 10710 - Number(twoTotalClaimable.toString())
  const oneClaimAmounts = 10710 - Number(oneTotalClaimable.toString())

  console.log(claimAmounts)
  console.log(result)

  let width = (Number(totalClaimable.toString()) - claimAmounts - oneClaimAmounts) === 10710 ? '0%' : `${Number((10710 - (Number(totalClaimable.toString()) - claimAmounts - oneClaimAmounts)) * 100 / 10710).toFixed(3)}%`
  return {
    user: {

      isApprove: allowance.toString() !== '0',

      totalClaimable: (Number(totalClaimable.toString()) - claimAmounts - oneClaimAmounts),
      claimPrice: Number(utils.formatEther(claimPrice)),
      claimAmount: Number(utils.formatEther(claimAmount)),
      minClamins: Number(minClamins.toString()),
      maxClamins: Number(maxClamins.toString()),
      claimPeriodEnd: Number(claimPeriodEnd.toString()),
      claimPeriodStart: Number(claimPeriodStart.toString()),
      userClaimLimit: Number(userClaimLimit.toString()),
      userClaims: Number(userClaims.toString()) + Number(twoUserClaims.toString()) + Number(oneUserClaims.toString()),
      style: {
        width
      },
      balance: Number(utils.formatEther(balance)),
    }
  }
}
function convertToTimeUnits (seconds) {
  const dayInSeconds = 24 * 60 * 60 * 1000
  const hourInSeconds = 60 * 60 * 1000
  const minuteInSeconds = 60 * 1000

  const days = Math.floor(seconds / dayInSeconds)
  const hours = Math.floor((seconds % dayInSeconds) / hourInSeconds)
  const minutes = Math.floor((seconds % hourInSeconds) / minuteInSeconds)

  return `${days < 10 ? `0${days}` : days} :${hours < 10 ? `0${hours}` : hours} : ${minutes < 10 ? `0${minutes}` : minutes} minute`
}

createApp({
  data () {
    return {
      code: 'zh',
      loading: true,
      link: false,
      showAccount: 'Connect',
      showRef: undefined,
      ref: undefined,
      inviteLink: 'https://zeus404.online/index.html?',
      account: undefined,
      inputAmount: '',
      mintValue: '',
      mintValueZeus: 0,
      style1: {
        background: 'linear-gradient(92deg, #df2512, #f1b611)'
      },
      style2: {
        background: '#9E9E9E'
      },
      token: '',
      user: {
        isApprove: false,

        totalClaimable: 10710,
        userClaimLimit: 10710,
        claimPrice: 0.05,
        claimAmount: 1,
        minClamins: 1,
        maxClamins: 10,
        claimPeriodEnd: 0,
        claimPeriodStart: 0,
        userClaims: 0,
        style: {
          width: `${0}%`
        },
        balance: 0,
      },
      contract: {
        investment: undefined,
        mint: undefined,
      },
      status: {
        mint: false,
        usdtApprove: false,
        filApprove: false,
        adtnft: false,
        isLoading: false,
        loadingText: '',
        isReward: false,
        copy: false,
        isApprove: false,
        isMint: false,
        isWithdraw: false,
        subscribe: false,
        text: 'clamin error'
      }
    }
  },

  methods: {

    async checkLink () {
      console.log(this.link)
      if (this.link === false) {
        this.walletLink()
      } else {
        this.deactivate()
      }
    },
    async walletLink () {
      const { ethereum, location } = window
      // if (!ethereum) {
      //   alert("Please install the metamask wallet first ")
      //   return
      // }
      console.log('walletLink')
      const provider = new ethers.providers.Web3Provider(ethereum)
      let account = []
      let chainId
      try {
        chainId = await provider.send('eth_chainId')
        chainId = parseInt(chainId, 16)

        if (chainId === ethChainId) {
          account = await provider.send('eth_requestAccounts', [`0x${ethChainId.toString(16)}`])
        } else {

          try {
            await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${ethChainId.toString(16)}` }])
            account = await provider.send('eth_requestAccounts', [])
          } catch (error) {
            if (error.code === 4902) {
              await provider.send('wallet_switchEthereumChain', [{
                chainId: `0x${ethChainId.toString(16)}`,
                chainName: 'Binance Smart Chain Mainnet',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'bnb',
                  decimals: 18
                },
                rpcUrls: RpcUrls[ethChainId],
                blockExplorerUrls: [BlockExplorerUrls[ethChainId]]

              }])
              account = await provider.send('eth_requestAccounts', [`0x${ethChainId.toString(16)}`])

            }
          }
        }
      } catch (error) {
        if (error.code === 4001) {
          alert('User denied connection')
        }
      }

      if (account.length >= 1) {
        this.account = account[0]
        this.showAccount = account[0].slice(0, 4) + '...' + account[0].slice(-4)
        this.link = true
        this.inviteLink = `${this.inviteLink}${this.account}`
      }

      this.token = addresses.token[ethChainId]


      const myString = location.href.split('?')[1]
      const pattern = /0x[a-fA-F0-9]{40}/g  // 匹配以 "0x" 开头，后面跟着 40 个十六进制字符的字符串
      if (myString) {
        this.ref = myString.match(pattern)[0]
        localStorage.setItem('ref', this.ref)
      } else {
        this.ref = localStorage.getItem('ref')
      }
      this.showRef = this.user?.referrer?.ref || this.ref
      this.loading = false

    },



    async upadteMintValue (value) {
      console.log(`value; ${value}`)
      this.mintValue = Number(value)
    },

    async deactivate () {
      try {
        if (this.link === true) {
          this.link = false
          this.account = []
          this.showAccount = 'Connect'

        }
      } catch (error) {
        console.log(error)
      }
    },

    async maxAmount () {
      const amount = this.user.balance - 0.002
      // if(amount > Number(this.user.ido2.maxCore)){
      //   this.inputAmount = Number(this.user.ido2.maxCore) - Number(this.user.ido2.user.amount);
      // }else{
      //   this.inputAmount = amount
      // }
      this.inputAmount = amount
    },

    handleCopy () {

      console.log(`复制`)
      this.status.mint = !this.status.mint
      this.status.text = 'Copy Success'
      var tempInput = document.createElement("input")
      tempInput.value = this.inviteLink
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand("copy")
      document.body.removeChild(tempInput)
    },
    setIsMint () {
      console.log('isMint')
      this.status.isMint = !this.status.isMint
    },
    upadteIsMint () {
      this.status.isMint = !this.status.isMint
    },
    upadteIsApprove () {
      this.status.isApprove = !this.status.isApprove
    },
    upadteCopy () {
      this.status.copy = !this.status.copy
    },
    upadteMint () {
      this.status.mint = !this.status.mint
    },
    setCode () {
      this.code = this.code = 'zh' ? 'ch' : 'zh'
    }
  },
  created: function () {
    this.walletLink()

  },


}).mount('#app')
