import { useRouter } from "next/router";



import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import {format} from 'date-fns';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AgencyTable() {
  const router = useRouter();
  const [claims,setClaims] = useState([])
  const { user, Moralis } = useMoralis();
  function handleValidator(plan) {
    router.push({pathname:"/agency/validating",query:{claim_id:plan.get("claim_id"),message:plan.get("message"),state:plan.get("state"),imgProof:plan.get("imgProof"),cid:plan.id,pid:plan.get("policy").id,name:plan.get("policy").get("name"),owner:plan.get("owner"),coverage:plan.get("policy").get("coverage"),premium:plan.get("policy").get("premium"),gender:plan.get("policy").get("gender"),petType:plan.get("policy").get("petType"),breed:plan.get("policy").get("breed"),description:plan.get("description")}});
  }

  // Get Claims
useEffect(()=>{
  if(user)
  {
     const Claims = Moralis.Object.extend("Claims")
     const query = new Moralis.Query(Claims)
     query.equalTo("owner",user.get("ethAddress"))
     query.descending("createdAt")
    query.include("policy")
    query.find().then((result)=>{
        setClaims(result)
        console.log(result)
    })
  }

},[user])
  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full">
      <div className="sm:flex sm:items-center"></div>
      <div className="-mx-4 mt-10 ring-1 ring-black sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-black">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Claim ID
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Date
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Description
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Validation
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Select</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {claims.map((plan, planIdx) => (
              <tr key={plan.id}>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-transparent",
                    "relative py-4 pl-4 sm:pl-6 pr-3 text-sm"
                  )}
                >
                  <div className="font-medium text-gray-900">
                    {plan.id}
                    {plan.isCurrent ? (
                      <span className="ml-1 text-indigo-600">
                        (Current Plan)
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
                    <span>
                      {plan.date} / {plan.holderID}
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span>{plan.status}</span>
                  </div>
                  {planIdx !== 0 ? (
                    <div className="absolute right-0 left-6 -top-px h-px bg-black" />
                  ) : null}
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-black",
                    "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                  )}
                >
                 {format(plan.get("dateSubmitted"),'dd/MM/yyyy hh:mm a')}
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-black",
                    "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                  )}
                >
                    {plan.get("policy").get("name")} - {plan.get("description")}
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-black",
                    "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                  )}
                >
                   {plan.get("state") == 0 && "Pending"}
                  {plan.get("state") == 1 && "Approved"}
                  {plan.get("state") == 2 && "Denied"}                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-transparent",
                    "relative py-3.5 pl-3  text-right text-sm font-medium"
                  )}
                >
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border hover:border-gray-300 text-white bg-black px-3 py-2 text-sm font-medium leading-4  shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-30"
                    // disabled={plan.isCurrent}
                    onClick={() => handleValidator(plan)}
                  >
                    Validate <span className="sr-only">, {plan.name}</span>
                  </button>
                  {planIdx !== 0 ? (
                    <div className="absolute right-1 left-0 -top-px h-px bg-black" />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
