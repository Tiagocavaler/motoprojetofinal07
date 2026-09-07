"use client";
import { useRouter } from "next/navigation";

export default function Login() { 

   const routes = useRouter();

   const handleSubmit = async (formdata: FormData) => {
      
      
      routes.push("/home");
   };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-emerald-950 p-4">
      <div className="w-full max-w-md bg-emerald-900/40 backdrop-blur-md border border-emerald-800/60 rounded-2xl p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-emerald-100">Login</h1>
        </div>
        <form action={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-emerald-200">
              Email:
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
                className="mt-1.5 w-full rounded-lg bg-emerald-950/80 border border-emerald-700/60 px-4 py-2.5 text-emerald-100 placeholder-emerald-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-200"
              />
            </label>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-emerald-200">
              senha:
              <input
                type="password"
                name="senha"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg bg-emerald-950/80 border border-emerald-700/60 px-4 py-2.5 text-emerald-100 placeholder-emerald-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-200"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full mt-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-950/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-emerald-950"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}