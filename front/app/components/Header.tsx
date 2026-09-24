"use client";
type Props = {
  onLogin: () => void;
  onRegister: () => void;
}
export default function Header({ onLogin, onRegister }: Props){
  return (
    <header>
      <div className="nav-container">
        <a href="#" className="logo">
          <div className="logo-symbol"><div className="capture-sphere"></div><div className="capture-ring"></div></div>
          <div className="logo-text-wrapper"><span className="logo-title">ComunidadeClt</span><span className="logo-subtitle">Palworld</span></div>
        </a>
        <div className="auth-actions">
          <button className="btn-link" onClick={onLogin}>Entrar</button>
          <button className="btn btn-primary" onClick={onRegister}>Criar Conta</button>
        </div>
      </div>
    </header>
  );
}