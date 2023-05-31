"use client";

import { Subject } from "../app/page";
import { useState } from "react";
import { Intensities, Periods } from "../../../shared/index";

interface AIProps {
  subjectList: Subject[];
  periods: Periods[];
  submit: (input: any) => void;
}

const AIWrapper: React.FC<AIProps> = ({ subjectList, periods, submit }) => {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [period, setPeriod] = useState<Periods | null>(null);
  const [intensity, setIntensity] = useState<Intensities | null>(null);

  const [sInput, setSInput] = useState<string>("");

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-l from-neutral-100 to-neutral-150 min-w-content md:mx-10 mx-0 rounded-2xl shadow-lg md:p-2 p-0">
      <div className="flex flex-col justify-center items-center space-y-10 bg-white min-w-content rounded-xl md:p-20 p-7">
        <div>
          <h1 className="md:text-4xl text-2xl text-slate-500">
            Luo kertaussuunnitelma
          </h1>
        </div>
        <div className="min-w-[100px] border-2 rounded-md"></div>
        <div className="flex flex-col justify-center items-center space-y-4 flex-wrap max-w-fit">
          <div>
            <h1 className="text-slate-500 md:text-2xl text-xl">
              <span className="text-slate-300">1.</span> Valitse aine tai kurssi
            </h1>
          </div>
          <div className="flex flex-row md:justify-center max-w-fit justify-evenly md:space-x-4 space-x-1 flex-wrap">
            {subjectList.map((s: Subject) => {
              return (
                <div
                  key={s.shorthand}
                  onClick={() => setSubject(s)}
                  className={`text-center select-none flex justify-center items-center ${
                    subject && subject.name === s.name
                      ? "border-2 border-slate-300 bg-slate-400 hover:border-slate-500"
                      : "bg-slate-500 border-0"
                  } text-white shadow-md min-w-[50px] p-2 rounded-md hover:bg-slate-100 hover:text-slate-500 transition`}
                >
                  <h2>{s.shorthand}</h2>
                </div>
              );
            })}
          </div>
          <div>
            {subject?.shorthand === "Muu" && (
              <div className="p-2 border-2 border-slate-500 rounded-lg transition">
                <input
                  value={sInput}
                  onChange={(e) => setSInput(e.target.value)}
                  className="outline-none"
                  placeholder="Pitkä matematiikka, ÄI06, yms"
                />
              </div>
            )}
          </div>
        </div>
        <div className="min-w-[300px] border-2 rounded-md"></div>
        <div className="flex flex-col justify-center items-center space-y-4 flex-wrap">
          <div>
            <h1 className="text-slate-500  md:text-2xl text-xl">
              <span className="text-slate-300">2.</span> Valitse kertausaika
            </h1>
          </div>
          <div className="flex flex-row md:justify-center justify-evenly md:space-x-4 space-x-1 flex-wrap">
            {periods.map((p: Periods) => {
              return (
                <div
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`text-center select-none flex justify-center items-center ${
                    period && period === p
                      ? "border-2 border-slate-300 bg-slate-400 hover:border-slate-500"
                      : "bg-slate-500 border-0"
                  } text-white shadow-md min-w-[50px] p-2 rounded-md hover:bg-slate-100 hover:text-slate-500 transition`}
                >
                  <h2>{p}</h2>
                </div>
              );
            })}
          </div>
        </div>
        <div className="min-w-[300px] border-2 rounded-md"></div>
        <div className="flex flex-col justify-center items-center space-y-4">
          <div>
            <h1 className="text-slate-500  md:text-2xl text-xl">
              <span className="text-slate-300">3.</span> Valitse intensiteetti
            </h1>
          </div>
          <div className="flex flex-row md:space-x-4 space-x-1 justify-center items-center">
            <div
              onClick={() => setIntensity(Intensities.EASY)}
              className={`select-none text-white ${
                intensity === Intensities.EASY
                  ? "border-2 border-emerald-600 bg-emerald-400 hover:border-emerald-500"
                  : "bg-emerald-400 border-0"
              } shadow-md  p-2 rounded-md hover:bg-emerald-100 hover:text-emerald-400 transition`}
            >
              <h2>Helppo</h2>
            </div>
            <div
              onClick={() => setIntensity(Intensities.INTERMEDIATE)}
              className={`select-none text-white ${
                intensity === Intensities.INTERMEDIATE
                  ? "border-2 border-amber-600 bg-amber-400 hover:border-amber-500"
                  : "bg-amber-400 border-0"
              } shadow-md  p-2 rounded-md hover:bg-amber-100 hover:text-amber-400 transition`}
            >
              <h2>Keskitaso</h2>
            </div>
            <div
              onClick={() => setIntensity(Intensities.HARD)}
              className={`select-none text-white ${
                intensity === Intensities.HARD
                  ? "border-2 border-red-600 bg-red-400 hover:border-red-600"
                  : "bg-red-400 border-0"
              } shadow-md  p-2 rounded-md hover:bg-red-100 hover:text-red-400 transition`}
            >
              <h2>Korkea</h2>
            </div>
          </div>
        </div>
        {subject && intensity && period && (
          <>
            <div className="min-w-[300px] border-2 rounded-md"></div>
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={() =>
                  submit({
                    subject:
                      subject.shorthand === "Muu" ? sInput : subject.name,
                    timePeriod: period as string,
                    intensity,
                  })
                }
                disabled={
                  subject?.shorthand === "Muu" && sInput.trim() === ""
                    ? true
                    : false
                }
                className="min-w-[200px] min-h-[50px] select-none text-white bg-slate-400 border-0
              shadow-md  p-2 rounded-md hover:bg-slate-100 hover:text-slate-400 hover:translate-y-1 transition disabled:hover:translate-y-0
              disabled:hover:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-white"
              >
                Generoi
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIWrapper;
