import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";

export default function LandingOptions(props) {
  const { isAuthenticated } = useMoralis();
  const router = useRouter();

  function getStarted() {
    if (!isAuthenticated) {
      alert("Must Log in first!");
      return;
    } else {
      router.push("/quotes");
    }
  }
  function becomeAgent() {
    if (!isAuthenticated) {
      alert("Must Log in first!");
      return;
    } else {
      router.push("/quotes");
    }
  }
  return (
    <main className="mb-4 flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      <h1 className="text-4xl tracking-widest  whitespace-nowrap md:top-20">
        {props.title}
      </h1>
      <div className="flex flex-row mt-6 mb-24 items-center justify-evenly space-x-8 w-6/12">
        <div className="mt-6 flex  flex-col items-center h-80 w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          <h3 className="text-3xl font-bold tracking-wide ">PET INSURANCE</h3>
          <p className="text-xl -mt-6 tracking-wider">for cats & dogs</p>
          <p className="text-2xl tracking-wide">
            Lots of coverage, for little cost
          </p>
          <button
            onClick={getStarted}
            className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
          >
            Get Started
          </button>
        </div>
        {/* <div className="mt-6 flex  flex-col items-center h-80 w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          <h3 className="text-3xl font-bold tracking-wide ">BECOME AN AGENT</h3>
          <p className="text-xl -mt-6 tracking-wider">
            for anyone interested in a sidehustle
          </p>
          <p className="text-2xl tracking-wide">
            Earn by reviewing insurance claims
          </p>
          <button
            onClick={becomeAgent}
            className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
          >
            Get Started
          </button>
        </div> */}
      </div>
    </main>
  );
}
