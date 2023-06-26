"use client";

import Link from "next/link";
import { ScheduleModelSchema } from "../../../shared";
import { CiTrash } from "react-icons/ci";
import { IconContext } from "react-icons";

interface UserScheduleListProps {
  userSchedules?: ScheduleModelSchema[];
  deleteSchedule: (sid: string) => void;
}

const UserScheduleList: React.FC<UserScheduleListProps> = ({
  userSchedules,
  deleteSchedule,
}) => {
  const handleDelete = (sid: string) => {
    deleteSchedule(sid);
  };

  return (
    <div className="flex flex-col space-y-2">
      {userSchedules?.map((schedule) => {
        return (
          <div
            className="flex flex-row justify-start items-center border-b-2 border-slate-200"
            key={schedule.id}
          >
            <IconContext.Provider
              value={{
                className: "fill-red-300 hover:fill-red-500 transition",
              }}
            >
              <CiTrash size="25px" onClick={() => handleDelete(schedule.id!)} />
            </IconContext.Provider>

            <Link
              className="flex w-full flex-row justify-between items-center space-x-10 p-4 hover:text-slate-400 transition"
              href={`/schedules/${schedule.id}`}
            >
              <h1 className="select-none">{schedule.name ?? "Schedule"}</h1>
              <h2 className="text-slate-400 select-none">{schedule.id}</h2>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default UserScheduleList;
