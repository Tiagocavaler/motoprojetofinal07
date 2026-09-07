'use client';

import { useState } from 'react';

export default function Page() {
  // Estados para controlar os modais de login e cadastro
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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

        /* ESTILOS DOS MODAIS (LOGIN E CADASTRO) */
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

        .modal-card {
          background: #162342;
          border: 1px solid rgba(226, 201, 161, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          position: relative;
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
          gap: 1.2rem;
          margin-top: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .form-group input {
          background-color: #0B1325;
          border: 1px solid rgba(226, 201, 161, 0.2);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: var(--text-dark);
          outline: none;
        }

        .form-group input:focus {
          border-color: var(--accent-sand);
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

      {/* MODAL DE LOGIN */}
      {isLoginOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsLoginOpen(false)}>&times;</button>
            <h2>Entrar na Conta</h2>
            <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Usuário / E-mail</label>
                <input type="text" placeholder="Seu usuário no Palworld" required />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input type="password" placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Acessar Painel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CRIAR CONTA */}
      {isRegisterOpen && (
        <div className="modal-overlay" onClick={() => setIsRegisterOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsRegisterOpen(false)}>&times;</button>
            <h2>Criar Nova Conta</h2>
            <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Nome do Vendedor / Nick</label>
                <input type="text" placeholder="Ex: Player123" required />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" placeholder="seuemail@exemplo.com" required />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input type="password" placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}