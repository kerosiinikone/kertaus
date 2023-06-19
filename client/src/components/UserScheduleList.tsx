import Link from "next/link";
import { ScheduleModelSchema } from "../../../shared";

interface UserScheduleListProps {
  userSchedules?: ScheduleModelSchema[];
}

const UserScheduleList: React.FC<UserScheduleListProps> = ({
  userSchedules,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      {userSchedules?.map((schedule) => {
        return (
          <Link className="group" href={`/schedules/${schedule.id}`}>
            <div
              key={schedule.id}
              className="flex flex-row justify-between items-center space-x-10 border-b-2 border-slate-200 p-4 group-hover:text-slate-400 transition"
            >
              <h1>{schedule.name ?? "Schedule"}</h1>
              <h2 className="text-slate-400">{schedule.id}</h2>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default UserScheduleList;
