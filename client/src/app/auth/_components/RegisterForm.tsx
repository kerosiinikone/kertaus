import { AuthInput } from "@/app/auth/page";
import { SyntheticEvent, useState } from "react";

interface RegisterFormProps {
  authFn: ({ password, email, type }: AuthInput) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ authFn }) => {
  const [sInput, setSInput] = useState<string>("");
  const [pInput, setPInput] = useState<string>("");
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (sInput.trim().length !== 0 && pInput.trim().length !== 0) {
      authFn({ email: sInput, password: pInput, type: "REGISTER" });
      setPInput("");
      setSInput("");
    }
  };

  return (
    <div className="flex flex-col space-y-5 justify-center items-center">
      <h1 className="text-slate-500 md:text-2xl text-xl mb-2">Rekisteröidy</h1>
      <form
        className="flex flex-col space-y-5 justify-center items-center"
        onSubmit={handleSubmit}
      >
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
            type="password"
            className="outline-none"
            placeholder="Salasana"
          />
        </div>
        <div>
          <button
            type="submit"
            className="p-2 rounded-lg bg-emerald-400 text-white hover:bg-emerald-500 transition w-[240px]"
          >
            Rekisteröidy
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
