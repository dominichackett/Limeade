import Image from "next/image";
import { useRouter } from "next/router";
import IUniswapV3FactoryABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json'
import IUniswapV3PoolABI  from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import INonFungiblePositionManagerABI from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import { useMoralis } from "react-moralis";
import {ethers} from 'ethers'
import { useEffect, useState } from "react";
import { USDCABI, USDCAddress } from "../Contracts/USDCContract";
import { LIMEABI, LIMEAddress } from "../Contracts/LIMEContract";
import {Pool,Position,TickMath,nearestUsableTick, } from '@uniswap/v3-sdk'
import { maxLiquidityForAmounts } from "@uniswap/v3-sdk";
import {Token } from '@uniswap/sdk-core'
import { getUniswapPositionNFT,getUSDCBalance } from "../../uitls/utils";
import Notification from "../Notification/Notification";
import { NumericFormat } from 'react-number-format';
import JSBI from 'jsbi'

const UniswapV3FactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';	
const positionManagerAddress = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'

export default function LandingOptions(props) {
  const { isAuthenticated,user,Moralis,web3,isWeb3Enabled,enableWeb3 } = useMoralis();
  const [poolAddress,setPoolAddress] = useState()
  const [poolData,setPoolData] = useState()
  const [positions,setPositions] = useState([])
  const [myPositions,setMyPositions] = useState([])
  const [refreshData,setRefreshData] = useState()
  const [usdcBalance,setUsdcBalance] = useState(0)
   //  NOTIFICATION STATES & FUNCTIONS
 const [show, setShow] = useState(false);
 const [notificationTitle, setNotificationTitle] = useState();
 const [notificationDescription, setNotificationDescription] = useState();
 const [dialogType, setDialogType] = useState(1);
 const close = async () => {
   setShow(false);
 };

  async function getFees(tokenId){
    const MAX_UINT128 = ethers.BigNumber.from(2).pow(128).sub(1)

    const pm = new ethers.Contract(positionManagerAddress,INonFungiblePositionManagerABI.abi,web3.getSigner())
   const result = await pm.callStatic.collect(
      {
        tokenId: ethers.BigNumber.from(parseInt(tokenId)).toHexString(),
        recipient: user.get("ethAddress"), // some tokens might fail if transferred to address(0)
        amount0Max: MAX_UINT128,
        amount1Max: MAX_UINT128,
      },
      { from: user.get("ethAddress") } // need to simulate the call as the owner
    )
    
   // console.log(result.amount0.toNumber())
   // console.log(result.amount1.toNumber())
    return result

}   


//* Get Pool Data
useEffect(() => {
  async function getPool() {
  
    if (isAuthenticated && user && web3) {
      const uniswapFactory = new ethers.Contract(
        UniswapV3FactoryAddress,
        IUniswapV3FactoryABI.abi,
        web3.getSigner()
      );
      try {
      let transaction = await uniswapFactory.getPool(USDCAddress,LIMEAddress,3000);
      console.log(`Pool: ${transaction}`)
      setPoolAddress(transaction)  
            
    }catch(error)
      {
        //  console.log(error)
      }
    }

  }
  getPool();
}, [isAuthenticated,web3, user]);

  //* Enable Web3
  useEffect(() => {
    if (!isWeb3Enabled) enableWeb3();
  }, []);


  // * Get USDC Balance
  useEffect(()=>{
     async function getBalance(){
        const balance  = await getUSDCBalance(user.get("ethAddress"))
        setUsdcBalance(ethers.utils.formatUnits(balance[0].balance,6) )
     }

     if(user)
       getBalance()

  },[user,refreshData])


//* Get User Positions in Uniswap
useEffect(()=>{
  async function getPosition(){
     if(user && web3 )
     {
        const data = await getUniswapPositionNFT(user.get("ethAddress"))
      //  console.log(data)
        let _positions = []
        for (const nft of data[0].nft_data) {
          //console.log(nft)
          const pm = new ethers.Contract(positionManagerAddress,INonFungiblePositionManagerABI.abi,web3.getSigner())
          const result = await pm.positions(nft.token_id)
        //  if(!result.liquidity.isZero() )
         //{
             
            _positions.push({result:result,tokenId:nft.token_id})
          // } 
        }
       
        setPositions(_positions)
        console.log(`${data[0].nft_data.length}  Positions Feteched ${JSON.stringify(_positions)}`)
      }
  }
  if(poolAddress && poolData)
  getPosition()
},[poolAddress,poolData,refreshData])

// * Get Pool Data
useEffect(()=>{
    async function getPoolData(){
      const poolContract = new ethers.Contract(poolAddress,IUniswapV3PoolABI.abi,web3.getSigner())
      const [tickSpacing,fee,liquidity,slot0] = await Promise.all([
       poolContract.tickSpacing(),
        poolContract.fee(),
        poolContract.liquidity(),
        poolContract.slot0()
      ])
      setPoolData({tickSpacing:tickSpacing,fee:fee,liquidity:liquidity,tick:slot0[1],sqrPriceX96:slot0[0]})
     
    } 

    if(poolAddress)
       getPoolData()
  },[poolAddress])

//Get Token amounts for Positions
useEffect(()=>{
  async function getTokenAmounts(){
    const lime =  new Token(80001,LIMEAddress,18,"Lime","Lime Token")
    const usdc = new Token(80001,USDCAddress,6,"USDC","USDC Token")
   // console.log(poolData)
    const pool  = new Pool(usdc,lime,poolData.fee,poolData.sqrPriceX96.toString(),poolData.liquidity.toString(),poolData.tick)
    
    const tickLower = nearestUsableTick(poolData.tick, poolData.tickSpacing) - poolData.tickSpacing * 2
    const tickUpper = nearestUsableTick(poolData.tick, poolData.tickSpacing) + poolData.tickSpacing * 2   
   
   //console.log(`Positions ${positions.length}`)
   let _pos = [] 
   for (const result of  positions) {
      const position = result.result;
      const pos = new Position({pool:pool,liquidity:position.liquidity.toString()
     ,tickLower:position.tickLower,tickUpper:position.tickUpper})
      console.log(pos.amount0.toSignificant(4))
      console.log(pos.amount1.toSignificant(4))
      console.log(pos)
     
     const r =  await getFees(result.tokenId)
     const limeRewards = parseFloat(ethers.utils.formatUnits(r.amount0,18)).toFixed(2)
     const usdcRewards = parseFloat(ethers.utils.formatUnits(r.amount1,6)).toFixed(2)
     if(limeRewards >0 || usdcRewards > 0 || !position.liquidity.isZero())
     _pos.push({amount0:pos.amount0.toSignificant(4),amount1:pos.amount1.toSignificant(4),tokenId:result.tokenId,limeRewards:limeRewards,usdcRewards:usdcRewards,liquidity:position.liquidity})  
     }
     setMyPositions(_pos)
     console.log(_pos)


  }

//  alert(`${JSON.stringify(positions)}`)
  if(poolData)
  getTokenAmounts()

},[positions])

  

  async function deposit() {
    if (!isAuthenticated) {
      alert("Must Log in first!");
      return;
    } else {
      // logic for contract call (depositing)
    }

    const amount = document.getElementById("amount").value;
    if(parseFloat(amount) <=0 || isNaN(parseFloat(amount)))
    {
        setDialogType(2) //Error
        setNotificationTitle("Deposit Error")
        setNotificationDescription("Please enter an amount.")
        setShow(true)
        return
    }

    if(parseFloat(amount) > parseFloat(usdcBalance))
    {
      setDialogType(2) //Error
      setNotificationTitle("Deposit Error")
      setNotificationDescription("Your balance is not enough.")
      setShow(true)
      return
    }

    const lime =  new Token(80001,LIMEAddress,18,"Lime","Lime Token")
    const usdc = new Token(80001,USDCAddress,6,"USDC","USDC Token")
    const pool  = new Pool(usdc,lime,poolData.fee,poolData.sqrPriceX96.toString(),poolData.liquidity.toString(),poolData.tick)
    const tickLower = nearestUsableTick(poolData.tick, poolData.tickSpacing) - poolData.tickSpacing * 2
    const tickUpper = nearestUsableTick(poolData.tick, poolData.tickSpacing) + poolData.tickSpacing * 2   
   
   const liquidity = maxLiquidityForAmounts(poolData.sqrPriceX96,TickMath.getSqrtRatioAtTick(tickLower)
   ,TickMath.getSqrtRatioAtTick(tickUpper),JSBI.BigInt(0),JSBI.BigInt(ethers.utils.parseUnits(amount,6)),true)

   const position = new Position({pool:pool,liquidity:liquidity.toString(),
     tickLower:tickLower,tickUpper:tickUpper})
   const usdcContract = new ethers.Contract(USDCAddress,USDCABI,web3.getSigner())
   const limeContract = new ethers.Contract(LIMEAddress,LIMEABI,web3.getSigner())

   const {amount0:amount0Desired,amount1:amount1Desired} = position.mintAmounts
   //Parameters to mint position
   const params = {
    token0:LIMEAddress,
    token1:USDCAddress,
    fee:poolData.fee,
    tickLower:tickLower,
    tickUpper:tickUpper,
    amount0Desired:amount0Desired.toString(),
    amount1Desired:amount1Desired.toString(),
    amount0Min:"0",
    amount1Min:amount1Desired.toString(),
    recipient:user.get("ethAddress"),
    deadline: Math.floor(Date.now()/1000)+(60*10)
   }

   //alert(JSON.stringify(params))
   //console.log(position)
   //return

   console.log(params)
   console.log(ethers.utils.parseUnits(amount0Desired.toString(),18))
   console.log(ethers.utils.parseUnits(amount1Desired.toString(),6))
   //return

   const pm = new ethers.Contract(positionManagerAddress,INonFungiblePositionManagerABI.abi,web3.getSigner())
     
   try {
         const result = await usdcContract.approve(positionManagerAddress,amount1Desired.toString())
          await result.wait()    
          const _result = await limeContract.approve(positionManagerAddress,amount0Desired.toString())
          await _result.wait()
          const mint = await pm.mint(params)  
          await mint.wait()      
         setRefreshData(new Date())
         setDialogType(1); //Success
         setNotificationTitle("Add Liquidity");
         setNotificationDescription("Liquidity added successfully.")
         setShow(true)

   }catch(error)
   {
    setDialogType(2); //Failed
    setNotificationTitle("Add Liquidity");
    setNotificationDescription(
      error.data ? error.data.message : error.message
    );
    console.log(error)

    setShow(true);
   }
   // console.log(`Amounts ${mint}`) 
    console.log(pool.token0)
    console.log(pool.token1)

  }

  async function widthdrawLiquidity(tokenId,liquidity)
 {
  const pm = new ethers.Contract(positionManagerAddress,INonFungiblePositionManagerABI.abi,web3.getSigner())
  const params ={
    tokenId:tokenId,
    liquidity:liquidity,
    amount0Min:0,
    amount1Min:0,
    deadline:Math.floor(Date.now()/1000)+(60*10)
  }
   try
   { 
      const result = await pm.decreaseLiquidity(params)
      await result.wait()
      setRefreshData(new Date())
      setDialogType(1); //Success
      setNotificationTitle("Widthdraw Liquidity");
      setNotificationDescription("Liquidity widthdrawn successfully.")
      setShow(true)

   }catch(error){
    setDialogType(2); //Failed
    setNotificationTitle("Widthdraw Liquidity");
    setNotificationDescription(
      error.data ? error.data.message : error.message
    );
    setShow(true) 
   }
 }

  async function claimRewards(tokenId,limeRewards,usdcRewards) {
    if((limeRewards == 0 || limeRewards == undefined) && (usdcRewards == 0 || usdcRewards==undefined))
       return //No Rewards to be claimed
    

    const MAX_UINT128 = ethers.BigNumber.from(2).pow(128).sub(1)

    const pm = new ethers.Contract(positionManagerAddress,INonFungiblePositionManagerABI.abi,web3.getSigner())
   
    try {
    const result = await pm.collect(
      {
        tokenId: ethers.BigNumber.from(parseInt(tokenId)).toHexString(),
        recipient: user.get("ethAddress"), // some tokens might fail if transferred to address(0)
        amount0Max: MAX_UINT128,
        amount1Max: MAX_UINT128,
      },
      { from: user.get("ethAddress") 
    
    
    } // need to simulate the call as the owner
    )

     await result.wait()
     setDialogType(1) //Success
     setNotificationTitle("Claim")
     setNotificationDescription("Rewards Claimed Successfully")
     setShow(true)
     setRefreshData(new Date())
   }catch(error) {
    setDialogType(2) //Error
    setNotificationTitle("Claim")
    setNotificationDescription(error.data ? error.data.message : error.message)
    setShow(true)
   }
  }
  return (
    <main className="mb-4 flex w-full flex-1 h-full flex-col items-center justify-center  text-center">
     <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
      <h3 className="text-3xl mt-12 font-bold tracking-wide ">
        Provide Liquidity
      </h3>
      <p className="text-xl tracking-wider"> to earn LIME rewards</p>

      <div className="flex flex-col mt-6 mb-24 items-center justify-evenly w-6/12">
        <div className="mt-6 flex  flex-col items-center w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          {/* NAV */}
          <nav
            className={`rounded-full font-bold ring-2  ring-black flex flex-row justify-between w-6/12`}
          >
            <div className="flex items-center px-2 justify-center w-6/12 py-1 text-white bg-black rounded-full">
              <button
                onClick={() => {
                  setSelected("New");
                }}
                className="px-2 rounded-full"
              >
                Claim Reserve
              </button>
            </div>
            <div className="flex items-center justify-center px-2 w-6/12  text-black rounded-full">
              <button
                onClick={() => {
                  setSelected("Past");
                }}
                className="px-2 rounded-full"
              >
                LIME LP
              </button>
            </div>
          </nav>
          {/* BLACK INFO BOX */}
         
         
          <div className="flex flex-col w-full space-y-2 my-4 items-center justify-center">
            {/* BALANCE INFO */}
            <div className="w-9/12">
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                <div className="rounded-md border-1 text-sm h-8 flex items-center justify-start px-4 font-bold bg-white border-gray-500">
                  {/* FETCH USERBALANCE */}
                  <p className="font-light">Balance:</p>
                  <div className="px-12"><NumericFormat displayType="text" value={usdcBalance}  thousandSeparator="," /> USDC</div>
                </div>
              </div>
            </div>
            {/* INPUT FIELD */}
            <div className="w-9/12">
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter Amount"
                  aria-describedby="price-currency"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className=" sm:text-sm bg-black rounded-md px-2 text-white "
                    id="price-currency"
                  >
                    USDC
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={deposit}
            className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
          >
            Deposit
          </button>
        </div>

        <h3 className="text-2xl mt-6 tracking-wide ">Your Positions {myPositions.length}</h3>
       {myPositions.map((pos,index)=> (
        <div key={index} className="w-full bg-black h-48 rounded-xl my-4 flex flex-row items-center text-white justify-evenly">
          <div className="flex flex-row items-center justify-between w-3/12 mx-4">
            <Image src={"/usdc.png"} width={60} height={60} />
            <p className="text-xl tracking-wide ml-2 whitespace-nowrap">
            {<NumericFormat displayType="text" value={pos.amount1}  thousandSeparator="," />} USDC
            </p>
          </div>
          <div className="flex flex-row items-center justify-between w-3/12 mx-4">
            <Image src={"/lime.png"} width={60} height={60} />
            <p className="text-xl tracking-wide ml-2 whitespace-nowrap">
            {<NumericFormat displayType="text" value={pos.amount0}  thousandSeparator="," />} LIME
                        </p>
          </div>
        
          <div className="ml-4  mt-4 flex flex-col items-center justify-center">
            <p>Lime rewards</p>
            <div
              className={`mt-2 rounded-full ring-2  ring-black flex bg-white flex-row justify-between w-full`}
            >
              <div className="flex items-center px-2 justify-center w-full py-1 text-black  rounded-full">
                <div className="px-2 rounded-full whitespace-nowrap">
                  {pos.usdcRewards} USDC
                </div>
              </div>
              <div className="flex items-center justify-center px-2 w-full  text-white bg-black m-1 rounded-full">
                <button onClick={() => claimRewards(pos.tokenId,pos.limeRewards,pos.usdcRewards)} className="px-2 rounded-full">
                  Claim
                </button>
              </div>
            </div>
            <div
              className={`mt-4 rounded-full ring-2  ring-black flex bg-white flex-row justify-between w-full`}
            >
              <div className="flex items-center px-2 justify-center w-full py-1 text-black  rounded-full">
                <div className="px-2 rounded-full whitespace-nowrap">
                  {pos.limeRewards} LIME
                </div>
              </div>
              <div className="flex items-center justify-center px-2 w-full  text-white bg-black m-1 rounded-full">
                <button onClick={() => claimRewards(pos.tokenId,pos.limeRewards,pos.limeRewards)} className="px-2 rounded-full">
                  Claim
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center px-4 w-full  text-white bg-[#CAF46F] m-4 rounded-full">
                <button onClick={() => widthdrawLiquidity(pos.tokenId,pos.liquidity)} className=" w-20 h-10 rounded-full text-black">
                  Widthdraw
                </button>
              </div>
          </div>
        </div>
        
       ))}   
        
      </div>
    </main>
  );
}
