"use client";

import { useState } from "react";

interface ScheduleProps {
  name: string;
  content: ScheduleNode[];
}

interface ScheduleNode {
  aiheet: string[];
  teoriat: string;
  tehtavananto: number;
  kesto: number;
}

const ScheduleWrapper: React.FC<ScheduleProps> = ({ content, name }) => {
  const [scheduleNode, setActiveSchduleNode] = useState<ScheduleNode | null>(
    null
  );

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-l from-neutral-100 to-neutral-150 min-w-content md:mx-10 mx-0 rounded-2xl shadow-lg md:p-2 p-0">
      <div className="flex flex-col justify-center items-center space-y-5 bg-white min-w-content rounded-xl md:p-20 p-7">
        <div>
          <h1 className="md:text-2xl text-xl text-slate-500">
            {name ?? "Aikataulu"}
          </h1>
        </div>
        <div className="text-center max-w-md">
          <h2 className="md:text-lg text-md text-slate-400">
            {`${content.length} päivää`}
          </h2>
        </div>
        <div className="min-w-[100px] border-2 rounded-md"></div>
        <div className="flex justify-center max-w-xl flex-wrap">
          {content.map((aihe, i) => (
            <div
              key={`${i}-${aihe.aiheet.join("").toLowerCase()}`}
              onClick={() => setActiveSchduleNode(aihe)}
              className="flex justify-center shadow-md m-2 items-center text-white min-w-[70px] min-h-[70px] bg-slate-400 rounded-lg
            border-2 border-slate-200 hover:translate-y-1 cursor-pointer hover:bg-slate-300 transition"
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="min-w-[100px] border-2 rounded-md"></div>
        {scheduleNode && (
          <div className="flex flex-col justify-center items-center rounded-md space-y-4 bg-slate-50 p-7">
            <div className="flex flex-col text-center">
              <h1 className="text-lg font-semibold">
                {scheduleNode?.aiheet.join(", ")}
              </h1>
              <p className="text-slate-400">{`${scheduleNode.kesto} tuntia`}</p>
            </div>
            <div className="text-center">
              <p>{scheduleNode.teoriat}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">{`Valitsemastasi kirjasta aiheeseen liittyvät ${scheduleNode.tehtavananto} itselle sopivan vaikeustason kertaustehtävää`}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleWrapper;
