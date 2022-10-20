export default function Head(props) {
  function nextStep() {
    const ear = document.querySelector('input[name="ear"]:checked').value;
    const cough = document.querySelector('input[name="cough"]:checked').value;
    const eye = document.querySelector('input[name="eye"]:checked').value;
    props.handleEar(ear);
    props.handleCough(cough);
    props.handleEye(eye);
    props.handleStep("7");
  }
  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      <h1 className="text-4xl tracking-widest absolute left-80 top-52 whitespace-nowrap">
        {props.title}
      </h1>
      <div className="mt-6 flex  flex-col items-center h-96 w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
        <h3 className="text-3xl font-bold">
          Has {props.petName} had any of these issues?
        </h3>
        <p className="text-xl tracking-wider">Head Issues</p>
        <div
          name="petOwnership"
          id="petOwnership"
          className="rounded-xl flex flex-col items-center space-y-2 w-4/12"
        >
          <div className="flex flex-row items-center justify-between px-8 bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="ear" value="ear-issues" />
            <p>Ear infection</p>
          </div>
          <div className="flex flex-row items-center justify-between px-8 bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="cough" value="kennel-cough" />
            <p>Kennel cough</p>
          </div>
          <div className="flex flex-row items-center justify-between px-8 bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="eye" value="eye-issues" />
            <p>Eye issues</p>
          </div>
        </div>

        <button
          onClick={nextStep}
          className="flex flex-col items-center justify-center w-40 h-10 bg-black text-white rounded-full"
        >
          Next
        </button>
      </div>
    </main>
  );
}
