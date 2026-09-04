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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Lado técnico */}
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-edge relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15]" style={{backgroundImage:"linear-gradient(#00e5a0 1px,transparent 1px),linear-gradient(90deg,#00e5a0 1px,transparent 1px)",backgroundSize:"32px 32px",maskImage:"radial-gradient(circle at 30% 40%,black,transparent 70%)"}} />
        <div className="relative flex items-center gap-2.5">
          <Mark size={34} />
          <div><div className="font-display font-semibold text-[19px]">Uni3D</div><div className="font-mono text-[10px] text-fog">UNICONTROLLER</div></div>
        </div>
        <div className="relative">
          <h1 className="font-display text-[40px] leading-[1.1] font-semibold tracking-tight mb-5">
            Do arquivo à<br />primeira camada.
          </h1>
          <p className="text-fog text-[15px] max-w-[400px] leading-relaxed">
            Visualize, repare e fatie STL, OBJ e 3MF direto no navegador. Gere chaveiros e litofanias a partir de uma imagem. Tudo no seu servidor.
          </p>
          <div className="flex gap-6 mt-8 font-mono text-[11px] text-fog">
            <div><span className="text-mint text-[18px] font-display font-semibold block">STL</span>OBJ · 3MF</div>
            <div><span className="text-mint text-[18px] font-display font-semibold block">100%</span>self-hosted</div>
            <div><span className="text-mint text-[18px] font-display font-semibold block">0</span>API paga</div>
          </div>
        </div>
        <div className="relative font-mono text-[10px] text-fog2">UNICONTROLLER · JACKSON TOMELIN · {new Date().getFullYear()}</div>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden mb-8 flex items-center gap-2.5"><Mark size={30} /><span className="font-display font-semibold text-[18px]">Uni3D</span></div>
          <h2 className="font-display text-[24px] font-semibold tracking-tight mb-1">{reg ? "Criar conta" : "Entrar"}</h2>
          <p className="font-mono text-[11px] text-fog mb-7">ACESSO RESTRITO · UNICONTROLLER</p>
          {err && <div className="flash flash--err">{err}</div>}
          <form onSubmit={submit} className="space-y-4">
            {reg && <div><label className="lab">Nome</label><input className="inp" value={name} onChange={(e) => setName(e.target.value)} /></div>}
            <div><label className="lab">E-mail</label><input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus /></div>
            <div><label className="lab">Senha</label><input className="inp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <button className="btn btn--go w-full !h-11" disabled={loading}>{loading ? "…" : reg ? "Criar conta" : "Entrar"}</button>
          </form>
          <p className="text-center text-[13px] text-fog mt-6">
            {reg ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
            <button className="text-mint hover:underline font-medium" onClick={() => { setReg(!reg); setErr(""); }}>{reg ? "Entrar" : "Criar conta"}</button>
          </p>
        </div>
      </div>
    </div>
  );
}
