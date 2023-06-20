"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <h2>Something went wrong!</h2>
      <a
        onClick={() => reset()}
        className="select-none text-slate-500 cursor-pointer m-2 py-2 px-5 border border-slate-300 rounded-md hover:bg-gradient-to-r hover:from-indigo-300 hover:to-indigo-400 hover:text-slate-100"
      >
        Try again
      </a>
    </div>
  );
}
