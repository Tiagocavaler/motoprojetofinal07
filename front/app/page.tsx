'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/app/(auth)/login/types/cliente';

export default function Page() {
  const router = useRouter();

  // Estados para controlar a abertura dos modais
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Estados específicos para o modal interativo de LOGIN
  const [loginLiberado, setLoginLiberado] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Estados específicos para o modal interativo de CADASTRO
  const [registerLiberado, setRegisterLiberado] = useState(false);
  const [registerForm, setRegisterForm] = useState({ nome: '', email: '', senha: '', confirma: '' });
  const [registerLoading, setRegisterLoading] = useState(false);

  // Função para lidar com o LOGIN
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const res = await fetch('http://localhost:8081/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, senha: loginSenha }),
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.token || data.accessToken;
        if (token) localStorage.setItem('token', token);
        setIsLoginOpen(false);
        router.push('/');
      } else {
        alert('Falhou: ' + (data.message || JSON.stringify(data)));
      }
    } catch (error) {
      alert('Erro ao conectar no servidor (8081).');
    } finally {
      setLoginLoading(false);
    }
  };

  // Função para lidar com o CADASTRO
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (registerForm.senha !== registerForm.confirma) return alert('Senhas diferentes');
    if (registerForm.senha.length < 6) return alert('Senha mínimo 6 caracteres');
    
    setRegisterLoading(true);
    try {
      await authClient.register({
        name: registerForm.nome,
        email: registerForm.email,
        password: registerForm.senha,
      });

      alert('Conta criada!');
      setIsRegisterOpen(false);
      setIsLoginOpen(true);
    } catch (err: any) {
      alert(err.message || 'Erro ao registrar conta');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        :root {
          /* Base Azul Escuro */
          --bg-light: #0B1325;       /* Azul Escuro Profundo */
          --bg-sand: rgba(17, 28, 53, 0.85); /* Azul Escuro Secundário Translúcido */
          --card-bg: rgba(22, 35, 66, 0.85); /* Azul Escuro para Cards com Opacidade */

          /* Contraste em Off-White e Tons Areia */
          --accent-sand: #E2C9A1;    /* Tom Areia / Dourado */
          --accent-gold: #C5A059;    /* Dourado Warm */
          --text-dark: #FAF9F6;      /* Off-White para Textos */
          --text-muted: #D3C9BF;     /* Areia Suave para Subtítulos */
          --white: #FFFFFF;
          --font-main: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: var(--font-main);
          background-color: var(--bg-light);
          /* Imagem da pasta public/ com filtro escuro para leitura perfeita */
          background-image: 
            linear-gradient(rgba(11, 19, 37, 0.88), rgba(11, 19, 37, 0.92)),
            url('/palworld-bg.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          background-repeat: no-repeat;
          color: var(--text-dark);
          line-height: 1.6;
        }

        html {
          scroll-behavior: smooth;
        }

        /* HEADER & NAVIGATION */
        header {
          background-color: rgba(11, 19, 37, 0.9);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(226, 201, 161, 0.15);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
        }

        /* LOGO COM ESFERA DE CAPTURA ANIMADA */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          text-decoration: none;
          color: var(--text-dark);
        }

        .logo-symbol {
          width: 44px;
          height: 44px;
          position: relative;
          perspective: 1000px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .capture-sphere {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #FFFFFF, var(--accent-sand), var(--accent-gold));
          box-shadow: inset -1px -1px 4px rgba(0,0,0,0.4), 0 0 14px rgba(226, 201, 161, 0.4);
          animation: rotateSphere 8s linear infinite;
        }

        .capture-ring {
          position: absolute;
          width: 38px;
          height: 38px;
          border: 1.5px solid var(--accent-sand);
          border-radius: 50%;
          border-top-color: transparent;
          animation: capturePulse 2s ease-in-out infinite alternate;
        }

        @keyframes rotateSphere {
          0% { transform: rotateY(0deg) rotateX(10deg); }
          100% { transform: rotateY(360deg) rotateX(10deg); }
        }

        @keyframes capturePulse {
          0% { transform: scale(0.9) rotate(0deg); opacity: 0.3; }
          100% { transform: scale(1.15) rotate(180deg); opacity: 0.9; }
        }

        .logo-text-wrapper {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          line-height: 1;
        }

        .logo-subtitle {
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--accent-sand);
          font-weight: 600;
          margin-top: 2px;
        }

        /* AUTH BUTTONS */
        .auth-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-link {
          color: var(--text-dark);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.6rem 1rem;
          transition: color 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
        }

        .btn-link:hover {
          color: var(--accent-sand);
        }

        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
        }

        .btn-primary {
          background-color: var(--accent-sand);
          color: #0B1325;
          box-shadow: 0 4px 15px rgba(226, 201, 161, 0.2);
        }

        .btn-primary:hover {
          background-color: var(--white);
          color: #0B1325;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
        }

        /* HERO SECTION */
        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 6rem 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-content h1 {
          font-size: 3.25rem;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          font-weight: 600;
          letter-spacing: -0.03em;
        }

        .hero-content p {
          font-size: 1.15rem;
          color: var(--text-muted);
          margin-bottom: 2.5rem;
        }

        /* CARD COM GIF ANIMADO NO PLANO DE FUNDO */
        .hero-card {
          background-image: 
            linear-gradient(rgba(11, 19, 37, 0.75), rgba(11, 19, 37, 0.85)),
            url('/card-bg.gif');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          backdrop-filter: blur(8px);
          border-radius: 28px;
          padding: 3.5rem;
          border: 1px solid rgba(226, 201, 161, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          overflow: hidden;
        }

        .hero-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .hero-card p {
          color: var(--text-muted);
        }

        /* FEATURES SECTION */
        .features {
          background-color: var(--bg-sand);
          backdrop-filter: blur(10px);
          padding: 6rem 2rem;
          border-top: 1px solid rgba(226, 201, 161, 0.1);
          border-bottom: 1px solid rgba(226, 201, 161, 0.1);
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          text-align: center;
          font-size: 2.25rem;
          margin-bottom: 3.5rem;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .grid-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        /* ESTILO BASE DAS FEATURE CARDS COM GIF */
        .feature-card {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          backdrop-filter: blur(8px);
          padding: 2.5rem;
          border-radius: 20px;
          border: 1px solid rgba(226, 201, 161, 0.2);
          transition: transform 0.3s ease, border-color 0.3s ease;
          overflow: hidden;
        }

        /* GIFS INDIVIDUAIS COM FILTRO ESCURO PARA LEITURA */
        .feature-card-1 {
          background-image: 
            linear-gradient(rgba(11, 19, 37, 0.8), rgba(11, 19, 37, 0.9)),
            url('/feature-1.gif');
        }

        .feature-card-2 {
          background-image: 
            linear-gradient(rgba(11, 19, 37, 0.8), rgba(11, 19, 37, 0.9)),
            url('/feature-2.gif');
        }

        .feature-card-3 {
          background-image: 
            linear-gradient(rgba(11, 19, 37, 0.8), rgba(11, 19, 37, 0.9)),
            url('/feature-3.gif');
        }

        .feature-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-sand);
        }

        .feature-card h3 {
          font-size: 1.3rem;
          margin-bottom: 0.75rem;
        }

        .feature-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        /* ABOUT SECTION */
        .about {
          max-width: 820px;
          margin: 0 auto;
          padding: 6rem 2rem;
          text-align: center;
        }

        .about h2 {
          font-size: 2.25rem;
          margin-bottom: 1.5rem;
        }

        .about p {
          font-size: 1.2rem;
          color: var(--text-muted);
          line-height: 1.8;
        }

        /* FOOTER */
        footer {
          background-color: rgba(11, 19, 37, 0.95);
          color: var(--text-muted);
          text-align: center;
          padding: 2.5rem 2rem;
          font-size: 0.9rem;
          border-top: 1px solid rgba(226, 201, 161, 0.1);
        }

        /* ESTILOS DOS MODAIS */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(11, 19, 37, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          color: var(--accent-sand);
          font-size: 1.5rem;
          cursor: pointer;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .form-group label {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .form-group input {
          background-color: #0B1325;
          border: 1px solid rgba(226, 201, 161, 0.2);
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
          color: var(--text-dark);
          outline: none;
        }

        .form-group input:focus {
          border-color: var(--accent-sand);
        }

        /* ESTILOS DA TELA INTERATIVA DA COELHINHA (COMPARTILHADO NOS MODAIS) */
        .bunny-modal-content {
          position: relative;
          max-width: 95vw;
          max-height: 95vh;
        }

        .main-container {
          display: flex;
          gap: 20px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        .magic-card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .arch-frame {
          width: 280px;
          height: 380px;
          border-radius: 140px 140px 20px 20px;
          border: 2px solid rgba(226, 201, 161, 0.3);
          overflow: hidden;
          background: #0c1c33;
          cursor: pointer;
          position: relative;
        }

        .character-wrap {
          width: 100%;
          height: 100%;
        }

        .bunny-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .badge-btn {
          margin-top: 15px;
          background: var(--accent-sand);
          color: #0B1325;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          cursor: pointer;
        }

        .right-panel {
          width: 320px;
        }

        .locked-card, .login-card {
          background: #162342;
          border: 1px solid rgba(226, 201, 161, 0.3);
          border-radius: 20px;
          padding: 2rem;
          color: var(--text-dark);
        }

        .locked-message {
          margin-top: 10px;
          color: var(--text-muted);
        }

        .subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .register, .forgot {
          display: block;
          margin-top: 10px;
          font-size: 0.8rem;
          color: var(--accent-sand);
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .hero {
            grid-template-columns: 1fr;
            padding: 3.5rem 1.5rem;
          }

          .hero-content h1 {
            font-size: 2.4rem;
          }

          .auth-actions {
            gap: 0.5rem;
          }

          .btn-link {
            display: none;
          }
        }
      `}</style>

      {/* HEADER */}
      <header>
        <div className="nav-container">
          <a href="#" className="logo">
            <div className="logo-symbol">
              <div className="capture-sphere"></div>
              <div className="capture-ring"></div>
            </div>
            <div className="logo-text-wrapper">
              <span className="logo-title">ComunidadeClt</span>
              <span className="logo-subtitle">Palworld</span>
            </div>
          </a>

          {/* ÁREA DE AUTH / LOGIN */}
          <div className="auth-actions">
            <button className="btn-link" onClick={() => setIsLoginOpen(true)}>
              Entrar
            </button>
            <button className="btn btn-primary" onClick={() => setIsRegisterOpen(true)}>
              Criar Conta
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>Sua gestão de vendas no Palworld em outro nível.</h1>
          <p>
            O ecossistema de gestão desenvolvido para jogadores otimizarem tempo, 
            organizarem entregas de produtos e serviços, focando na expansão dos seus negócios.
          </p>
          <a href="#recursos" className="btn btn-primary">Conheça a Plataforma</a>
        </div>
        <div className="hero-card">
          <h3>Agenda Inteligente de Vendas</h3>
          <p>
            Acompanhe seus pedidos e entregas in-game em tempo real, evitando atrasos e gargalos no atendimento aos clientes.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="recursos">
        <div className="features-container">
          <h2 className="section-title">Pensado para o dia a dia do seu negócio no Palworld</h2>
          <div className="grid-features">
            <div className="feature-card feature-card-1">
              <h3>Gestão de Produtos e Pals</h3>
              <p>Organize seus produtos, serviços e itens disponíveis no jogo de forma clara e ágil no seu painel.</p>
            </div>
            <div className="feature-card feature-card-2">
              <h3>Controle de Pedidos e Clientes</h3>
              <p>Mantenha o histórico de compras, contatos e preferências de cada jogador para um atendimento personalizado.</p>
            </div>
            <div className="feature-card feature-card-3">
              <h3>Agenda de Serviços</h3>
              <p>Gerencie datas e horários marcados para entregas ou prestação de serviços com total precisão.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about">
        <h2>Nossa História</h2>
        <p>
          O <strong>ComunidadeClt Palworld</strong> da <strong>GlamourStudio</strong> nasceu da necessidade de simplificar a gestão de negócios para jogadores. Sabemos que administrar vendas, serviços e agendamentos requer organização e agilidade. Por isso, criamos uma solução direta para que vendedores e gerentes tenham controle total sobre seus produtos, pedidos e horários, garantindo uma rotina simplificada e mais resultados no jogo.
        </p>
      </section>

      {/* FOOTER */}
      <footer>
        <p>&copy; 2026 ComunidadeClt Palworld. Todos os direitos reservados.</p>
      </footer>

      {/* MODAL DE LOGIN INTERATIVO (DA COELHINHA) */}
      {isLoginOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="bunny-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsLoginOpen(false)}>&times;</button>
            
            <div className="main-container">
              <div className="magic-card">
                <div className="arch-frame" onClick={() => setLoginLiberado(true)}>
                  <div className="character-wrap">
                    <video autoPlay loop muted playsInline className="bunny-video">
                      <source src="/bunny-hat.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
                {!loginLiberado && (
                  <button className="badge-btn" onClick={() => setLoginLiberado(true)}>
                    CLIQUE PARA LOGAR 👆
                  </button>
                )}
              </div>

              <div className="right-panel">
                {!loginLiberado ? (
                  <div className="locked-card">
                    <h2>Fazer Login</h2>
                    <p className="locked-message">
                      🔒 Clique na coelhinha para liberar o login
                    </p>
                  </div>
                ) : (
                  <div className="login-card">
                    <h2>Bem-vindo</h2>
                    <p className="subtitle">Faça login para continuar</p>
                    <form onSubmit={handleLogin} className="modal-form">
                      <div className="form-group">
                        <label>E-mail / Usuário</label>
                        <input
                          type="text"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Senha</label>
                        <input
                          type="password"
                          value={loginSenha}
                          onChange={(e) => setLoginSenha(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loginLoading}>
                        {loginLoading ? 'ENTRANDO...' : 'ENTRAR'}
                      </button>
                      <div className="register">
                        Não tem conta? <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginOpen(false); setIsRegisterOpen(true); }}>Cadastre-se</a>
                      </div>
                      <Link href="/esqueci" className="forgot">
                        Esqueci minha senha
                      </Link>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CRIAR CONTA INTERATIVO (DA COELHINHA) */}
      {isRegisterOpen && (
        <div className="modal-overlay" onClick={() => setIsRegisterOpen(false)}>
          <div className="bunny-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsRegisterOpen(false)}>&times;</button>
            
            <div className="main-container">
              <div className="magic-card">
                <div className="arch-frame" onClick={() => setRegisterLiberado(true)}>
                  <div className="character-wrap">
                    <video autoPlay loop muted playsInline className="bunny-video">
                      <source src="/bunny-hat.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
                {!registerLiberado && (
                  <button className="badge-btn" onClick={() => setRegisterLiberado(true)}>
                    CLIQUE PARA CRIAR CONTA 👆
                  </button>
                )}
              </div>

              <div className="right-panel">
                {!registerLiberado ? (
                  <div className="locked-card">
                    <h2>Criar Conta</h2>
                    <p className="locked-message">
                      🔒 Clique na coelhinha para liberar o cadastro
                    </p>
                  </div>
                ) : (
                  <div className="login-card">
                    <h2>Criar conta</h2>
                    <p className="subtitle">Preencha seus dados para começar</p>
                    <form onSubmit={handleRegister} className="modal-form">
                      <div className="form-group">
                        <label>Nome</label>
                        <input
                          type="text"
                          value={registerForm.nome}
                          onChange={(e) => setRegisterForm({ ...registerForm, nome: e.target.value })}
                          placeholder="Ex: Player123"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>E-mail</label>
                        <input
                          type="email"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Senha</label>
                        <input
                          type="password"
                          value={registerForm.senha}
                          onChange={(e) => setRegisterForm({ ...registerForm, senha: e.target.value })}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Confirma Senha</label>
                        <input
                          type="password"
                          value={registerForm.confirma}
                          onChange={(e) => setRegisterForm({ ...registerForm, confirma: e.target.value })}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={registerLoading}>
                        {registerLoading ? 'CRIANDO...' : 'CRIAR CONTA'}
                      </button>
                      <div className="register">
                        Já tem conta? <a href="#" onClick={(e) => { e.preventDefault(); setIsRegisterOpen(false); setIsLoginOpen(true); }}>Faça login</a>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}