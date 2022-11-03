import Image from "next/image";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";

export default function LandingOptions(props) {
  const { isAuthenticated } = useMoralis();

  function deposit() {
    if (!isAuthenticated) {
      alert("Must Log in first!");
      return;
    } else {
      // logic for contract call (depositing)
    }
  }

  function claimRewards() {
    // add logic for claiming Rewards (CONTRACT CALL)
  }
  return (
    <main className="mb-4 flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
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
          <div className="w-9/12 bg-black h-24 rounded-xl my-4 flex flex-row items-center text-white justify-evenly">
            <div className="flex flex-row items-center justify-between w-3/12">
              <Image src={"/usdc.png"} width={50} height={50} />
              <p className="text-xl tracking-wide font-bold">USDC</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p>Total Liquidity</p>
              <p>2,997,978,000.00</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p>LIME APR</p>
              <p>15%</p>
            </div>
          </div>
          <div className="flex flex-col w-full space-y-2 my-4 items-center justify-center">
            {/* BALANCE INFO */}
            <div className="w-9/12">
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                <div className="rounded-md border-1 text-sm h-8 flex items-center justify-start px-4 font-bold bg-white border-gray-500">
                  {/* FETCH USERBALANCE */}
                  <p className="font-light">Balance:</p>
                  <div className="px-12">1500 USDC</div>
                </div>
              </div>
            </div>
            {/* INPUT FIELD */}
            <div className="w-9/12">
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                <input
                  type="text"
                  name="price"
                  id="price"
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

        <h3 className="text-2xl mt-6 tracking-wide ">Your Positions</h3>

        <div className="w-full bg-black h-24 rounded-xl my-4 flex flex-row items-center text-white justify-evenly">
          <div className="flex flex-row items-center justify-between w-3/12 mx-4">
            <Image src={"/usdc.png"} width={30} height={30} />
            <p className="text-xl tracking-wide ml-2 whitespace-nowrap">
              Claim Reserve
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p>Position Value</p>
            {/* INPUT USER BALANCE POSITION BELOW  */}
            <p className="font-bold">1000 USDC</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p>Lime rewards</p>
            <div
              className={`rounded-full ring-2  ring-black flex bg-white flex-row justify-between w-full`}
            >
              <div className="flex items-center px-2 justify-center w-full py-1 text-black  rounded-full">
                <div className="px-2 rounded-full whitespace-nowrap">
                  7.81 LIME
                </div>
              </div>
              <div className="flex items-center justify-center px-2 w-full  text-white bg-black m-1 rounded-full">
                <button onClick={claimRewards} className="px-2 rounded-full">
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
