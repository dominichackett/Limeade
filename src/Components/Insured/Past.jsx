import { ethers } from "ethers";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import {format} from 'date-fns';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Table(props) {
  const [payments,setPayments] = useState([])
  const { user, Moralis } = useMoralis();

// Get Claims
useEffect(()=>{
  if(user)
  {
     const Payments = Moralis.Object.extend("Payments")
     const query = new Moralis.Query(Payments)
     query.equalTo("owner",user.get("ethAddress"))
     query.descending("createdAt")
    query.include("policy")
    query.find().then((result)=>{
        setPayments(result)
        console.log(result)
    })
  }

},[])
 
  return (
    <div className="px-4 w-full sm:px-6 lg:px-8 w-full">
      <div className="sm:flex sm:items-center"></div>
      <div className="-mx-4 mt-10 ring-1 ring-black sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-black">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Policy
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
                Coverage
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Payment
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Select</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((plan, planIdx) => (
              <tr key={plan.id}>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-transparent",
                    "text-center relative py-4 pl-4 sm:pl-6 pr-3 text-sm"
                  )}
                >
                  <div className="text-center font-medium text-gray-900">
                    {plan.get("policy").get("name")}
                    {plan.isCurrent ? (
                      <span className="ml-1 text-indigo-600">
                        (Current Plan)
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
                    <span>
                      {plan.date} / {plan.description}
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
                 {format(plan.get("datePaid"),'dd/MM/yyyy hh:mm a')}

                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-black",
                    "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                  )}
                >
                  {plan.get("policy").get("petType").toUpperCase()} - {plan.get("policy").get("gender").toUpperCase()} - {plan.get("policy").get("breed").toUpperCase()} 
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-black",
                    "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                  )}
                >
                  {plan.get("policy").get("coverage") }
                 
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-transparent",
                    "relative py-3.5 pl-3  text-center text-sm font-medium"
                  )}
                >
                 {plan.get("policy").get("premium")}
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
