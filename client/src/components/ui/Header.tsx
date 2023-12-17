"use client";

import { CiUser } from "react-icons/ci";
import { IconContext } from "react-icons";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <div className="flex flex-row items-center justify-between h-20">
      <Link href={"/"} className="m-5">
        <h1 className="select-none cursor-pointer text-slate-400 text-[25px] hover:text-slate-500 transition">
          kertaus
        </h1>
      </Link>
      <div className="group rounded-3xl bg-white p-2 shadow-md hover:bg-slate-500 transition m-5 cursor-pointer">
        <Link href={"/me"}>
          <IconContext.Provider
            value={{
              className: "fill-slate-500 group-hover:fill-white transition",
            }}
          >
            <CiUser size="30px" />
          </IconContext.Provider>
        </Link>
      </div>
    </div>
  );
};

export default Header;
