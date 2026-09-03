import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import Logo, { Cubo, Estrela } from "../components/Logo";
import Icon from "../components/Icon";

export default function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login); const register = useAuthStore((s) => s.register); const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { if (isRegister) await register(email, name, password); await login(email, password); navigate("/"); }
    catch (err) { setError(err.response?.data?.detail || "Não foi possível entrar. Confira e-mail e senha."); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-split">
      <div className="login-side">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11"><div className="absolute inset-0 rounded-xl bg-white/10 border border-white/15" /><div className="absolute inset-0 flex items-center justify-center"><Cubo size={26} /></div><div className="absolute -top-1 -right-1"><Estrela size={15} stroke="#0f2d4a" /></div></div>
          <div><div className="font-bold text-[17px] leading-tight">Uni3D</div><div className="text-azure-light text-[11.5px]">UniController</div></div>
        </div>
        <div>
          <h1 className="text-[36px] font-bold leading-[1.15] tracking-tight m-0 mb-4">Do arquivo 3D ao G&#8209;code,<br />sem sair do navegador.</h1>
          <p className="text-slate-200 text-[15px] m-0 mb-8 max-w-[440px]">Envie STL, OBJ ou 3MF, confira a malha na mesa da sua impressora, fatie com perfis prontos e baixe o G-code. Tudo no seu servidor, sem depender de ninguém.</p>
          <div className="space-y-3">
            <div className="feature-line"><div className="upro-ic"><Icon name="cubo" /></div><span>Visualizador 3D com mesa real e ficha técnica da malha</span></div>
            <div className="feature-line"><div className="upro-ic"><Icon name="camadas" /></div><span>Fatiador integrado que roda 100% no navegador</span></div>
            <div className="feature-line"><div className="upro-ic"><Icon name="ajustes" /></div><span>Perfis de impressão por cliente e por impressora</span></div>
          </div>
        </div>
        <div className="text-slate-300 text-[12px]">UniController · Dev Jackson Tomelin © {new Date().getFullYear()} · Unindo tudo. Controlando tudo.</div>
      </div>

      <div className="login-form">
        <div className="login-card">
          <div className="lg:hidden"><Logo variant="login" /></div>
          <h1>{isRegister ? "Criar conta" : "Entrar no Uni3D"}</h1>
          <p className="sub">Acesso restrito · UniController</p>
          {error && <div className="flash flash--alert">{error}</div>}
          <form onSubmit={submit}>
            {isRegister && <div className="form-row"><label>Nome</label><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></div>}
            <div className="form-row"><label>E-mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus /></div>
            <div className="form-row"><label>Senha</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></div>
            <button type="submit" className="btn btn--primary w-full justify-center !py-[10px]" disabled={loading}>{loading ? "Aguarde…" : isRegister ? "Criar conta" : "Entrar"}</button>
          </form>
          <p className="text-center text-[12.5px] text-muted mt-5 mb-0">{isRegister ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
            <button type="button" className="text-azure font-semibold hover:underline" onClick={() => { setIsRegister(!isRegister); setError(""); }}>{isRegister ? "Entrar" : "Criar conta"}</button>
          </p>
        </div>
      </div>
    </div>
  );
}
