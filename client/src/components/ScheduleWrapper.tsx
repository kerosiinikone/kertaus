"use client";

interface ScheduleProps {
  content: {
    aiheet: string[];
    teoriat: string;
    tehtavananto: number;
    kesto: number;
  }[];
}

const ScheduleWrapper: React.FC<ScheduleProps> = ({ content }) => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-l from-neutral-100 to-neutral-150 min-w-content md:mx-10 mx-0 rounded-2xl shadow-lg md:p-2 p-0">
      <div className="flex flex-col justify-center items-center space-y-10 bg-white min-w-content rounded-xl md:p-20 p-7">
        <div className="flex justify-between max-w-[470px] flex-wrap">
          {content.map((aihe, i) => (
            <div className="flex justify-center m-2 items-center text-white min-w-[50px] min-h-[50px] bg-slate-400 rounded-lg">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleWrapper;
