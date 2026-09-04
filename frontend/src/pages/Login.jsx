import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import { Mark } from "../components/Logo";

export default function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [reg, setReg] = useState(false); const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login); const register = useAuthStore((s) => s.register); const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setLoading(true);
    try { if (reg) await register(email, name, password); await login(email, password); nav("/"); }
    catch (x) { setErr(x.response?.data?.detail || "Não foi possível entrar. Confira e-mail e senha."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-vsbg flex flex-col">
      {/* barra de título fake do editor */}
      <div className="h-9 bg-vstab border-b border-vsline flex items-center px-4 gap-2 text-[13px] text-vsdim">
        <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-[#ff5f56]" /><span className="w-3 h-3 rounded-full bg-[#ffbd2e]" /><span className="w-3 h-3 rounded-full bg-[#27c93f]" /></div>
        <span className="ml-3">login.py — Uni3D</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px]">
          <div className="flex items-center gap-3 mb-8">
            <Mark size={38} />
            <div>
              <div className="text-vstext text-[20px] font-semibold">Uni3D</div>
              <div className="text-vsgreen text-[12px]"># bancada de impressão 3D</div>
            </div>
          </div>

          <div className="card">
            <div className="card__h"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-vsblue" /> {reg ? "criar_conta()" : "entrar()"}</span><span className="text-vsdim text-[11px]">auth.py</span></div>
            <div className="card__b">
              {err && <div className="flash flash--err">{err}</div>}
              <form onSubmit={submit} className="space-y-4">
                {reg && <div><label className="lab">nome</label><input className="inp" value={name} onChange={(e) => setName(e.target.value)} /></div>}
                <div><label className="lab">email</label><input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus /></div>
                <div><label className="lab">senha</label><input className="inp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <button className="btn btn--go w-full !h-9" disabled={loading}>{loading ? "..." : reg ? "criar conta" : "entrar"}</button>
              </form>
              <p className="text-center text-[12px] text-vsdim mt-5">
                <span className="comment"># {reg ? "já tem conta?" : "ainda não tem conta?"}</span>{" "}
                <button className="text-vsblue2 hover:underline" onClick={() => { setReg(!reg); setErr(""); }}>{reg ? "entrar" : "criar conta"}</button>
              </p>
            </div>
          </div>
          <p className="text-center text-vsdim text-[11px] mt-6">UniController · Jackson Tomelin · {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
