export default function New() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col w-6/12 items-center justify-center">
        <div className="mt-6 flex  flex-col items-center justify-around py-8  rounded-xl sm:w-full">
          <div className="flex flex-col space-y-8 w-full items-center justify-center">
            <h3 className="text-4xl font-bold tracking-wide whitespace-nowrap">
              Select the policy you would like to claim
            </h3>
            <select className="text-2xl rounded-full tracking-wide">
              <option>Oates - Basic Policy</option>
              <option>Oates - Advanced</option>
              <option>...</option>
            </select>
            <button className="flex flex-col items-center font-semibold justify-center w-40 h-12 bg-black text-white rounded-full">
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
