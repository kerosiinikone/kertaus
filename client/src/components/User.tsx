"use client";

import { useUserContext } from "@/context/UserContext";
import { IconContext } from "react-icons";
import { CiUser } from "react-icons/ci";

interface UserProps {
  logout: () => void;
}

const User: React.FC<UserProps> = ({ logout }) => {
  const { user } = useUserContext();
  return (
    <div className="grid grid-rows-3 grid-flow-col md:gap-2 gap-1">
      <div className="md:row-span-3 row-span-2 rounded-3xl bg-white p-3 shadow-md mx-5">
        <IconContext.Provider
          value={{
            className:
              "fill-slate-500 md:w-[100px] md:h-[100px] w-[50px] h-[50px]",
          }}
        >
          <CiUser size="50px" />
        </IconContext.Provider>
      </div>
      <div className="col-span-2 flex items-center">
        <h1 className="md:text-xl text-md text-slate-500">{user?.email}</h1>
      </div>
      <div className="col-span-2 ">
        <button className="p-2 rounded-lg bg-slate-400 text-white hover:bg-slate-500 transition">
          Clear cache
        </button>
      </div>
      <div className="col-span-2 ">
        <button
          onClick={logout}
          className="p-2 rounded-lg bg-red-400 text-white hover:bg-red-500 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default User;
