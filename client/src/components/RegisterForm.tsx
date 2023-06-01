import { SyntheticEvent, useState } from "react";

const RegisterForm: React.FC = () => {
  const [sInput, setSInput] = useState<string>("");
  const [pInput, setPInput] = useState<string>("");
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col space-y-5 justify-center items-center">
      <h1 className="text-slate-500 md:text-2xl text-xl mb-2">Rekisteröidy</h1>
      <div className="p-2 border-2 border-slate-500 rounded-lg transition">
        <input
          value={sInput}
          onChange={(e) => setSInput(e.target.value)}
          className="outline-none"
          placeholder="Sähköpostiosoite"
        />
      </div>
      <div className="p-2 border-2 border-slate-500 rounded-lg transition">
        <input
          value={pInput}
          onChange={(e) => setPInput(e.target.value)}
          className="outline-none"
          placeholder="Salasana"
        />
      </div>
      <div>
        <button
          onClick={handleSubmit}
          className="p-2 rounded-lg bg-emerald-400 text-white hover:bg-emerald-500 transition w-[240px]"
        >
          Rekisteröidy
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
