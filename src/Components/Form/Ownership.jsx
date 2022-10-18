export default function Ownership(props) {
  function nextStep() {
    const ownership = document.getElementById("petOwnership").value;
    props.handleOwnership(ownership);
    props.handleStep("6");
  }
  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      <h1 className="text-4xl tracking-widest absolute left-80 top-52 whitespace-nowrap">
        {props.title}
      </h1>
      <div className="mt-6 flex  flex-col items-center h-80 w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
        <h3 className="text-3xl font-bold">
          How long have you had {props.petName}?
        </h3>
        <select
          name="petOwnership"
          id="petOwnership"
          className="rounded-xl w-4/12"
        >
          <option value="choose"></option>
          <option value="less">Less than a month</option>
          <option value="between">1-6 months</option>
          <option value="more">More than 6 months</option>
        </select>

        <button
          onClick={nextStep}
          className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
        >
          Next
        </button>
      </div>
    </main>
  );
}
