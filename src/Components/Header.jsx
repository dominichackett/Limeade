import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

const navigation = [
  { name: "Account", href: "/account" },
  { name: "Claims", href: "/claims" },
  { name: "Liquidity", href: "/liquidity" },
  { name: "Agency", href: "/agency" },
];

export default function Header() {
  const { logout, user, isAuthenticated, authenticate } = useMoralis();

  const router = useRouter();

  const [userAddress, setUserAddress] = useState();
  const [isConnected, setIsConnected] = useState(true);

  const [selected, setSelected] = useState();

  useEffect(() => {
    if (user) {
      setUserAddress(
        user.get("ethAddress").slice(0, 6).concat("...") +
          user.get("ethAddress").slice(38, 44)
      );
    } else {
      setUserAddress("not logged in");
    }
  });

  function connectPolygonID() {
    // add logic for polygon id
  }

  function handleClick() {
    if (isAuthenticated) {
      logout();
    } else {
      authenticate();
    }
  }

  return (
    <div className="bg-white pt-6 pb-6">
      <nav
        className="relative mx-auto flex max-w-7xl flex-row items-center justify-between px-4 sm:px-6 "
        aria-label="Global"
      >
        <div className="flex items-center">
          <div className="flex w-full items-center justify-between md:w-auto">
            <a href="/">
              <span className="sr-only">LIMEADE</span>
              <img
                className="h-8 w-auto sm:h-10"
                src="/limeade-screen.png"
                alt=""
              />
            </a>
          </div>
        </div>
        <div className="">
          <div className=" flex flex-row">
            <nav className="flex flex-row items-center justify-evenly rounded-full ring-2 ring-black  text-white">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setSelected(item.name);
                  }}
                  className={`block rounded-full ${
                    router.pathname == item.name ? "bg-black" : ""
                  } hover:bg-black px-4 py-2 text-base font-medium text-gray-900 hover:text-white`}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="hidden md:flex md:items-center md:space-x-6">
          {isAuthenticated && (
            <button
              onClick={connectPolygonID}
              className={`inline-flex absolute right-48 ${
                isConnected ? "" : "ring-black"
              } items-center justify-center rounded-full border border-transparent ring-2 ring-black px-4 py-2 text-white hover:bg-gray-700`}
            >
              <Image
                src="/img/polygon-id.jpeg"
                width={20}
                height={20}
                className="rounded-full"
              />
              {/* {isConnected ? (
                <CheckCircleIcon className="text-green-500 ml-2 h-5" />
              ) : (
                <ExclamationTriangleIcon className="h-5 ml-2 text-white" />
              )} */}
            </button>
          )}
          <button
            onClick={handleClick}
            className="inline-flex items-center rounded-full border border-transparent bg-black px-4 py-2 font-medium  text-white hover:bg-gray-700"
          >
            {isAuthenticated ? userAddress : "Login"}
          </button>
        </div>
      </nav>
    </div>
  );
}
