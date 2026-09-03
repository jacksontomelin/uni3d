import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import Logo from "../components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) await register(email, name, password);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Não foi possível entrar. Confira e-mail e senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <Logo variant="login" />
        <h1>Uni3D</h1>
        <p className="sub">UniController · Impressão 3D · acesso restrito</p>

        {error && <div className="flash flash--alert">{error}</div>}

        <form onSubmit={submit}>
          {isRegister && (
            <div className="form-row">
              <label>Nome</label>
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
          )}
          <div className="form-row">
            <label>E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus />
          </div>
          <div className="form-row">
            <label>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn--primary w-full justify-center" disabled={loading}>
            {loading ? "Aguarde…" : isRegister ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <p className="text-center text-[12.5px] text-muted mt-5 mb-0">
          {isRegister ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
          <button type="button" className="text-azure font-semibold hover:underline" onClick={() => { setIsRegister(!isRegister); setError(""); }}>
            {isRegister ? "Entrar" : "Criar conta"}
          </button>
        </p>

        <p className="text-center text-[11px] text-slate-400 mt-6 mb-0">
          UniController · Dev Jackson Tomelin © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
