import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLoginExitoso?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginExitoso }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const emailLimpio = email.trim();
    if (!emailLimpio || !password) {
      setErrorMsg('Completá correo y contraseña.');
      return;
    }

    setCargando(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailLimpio,
        password
      });

      if (error) {
        setErrorMsg('No se pudo iniciar sesión: ' + (error.message || 'Credenciales inválidas'));
      } else {
        if (onLoginExitoso) {
          onLoginExitoso();
        }
      }
    } catch (err: any) {
      setErrorMsg('Error inesperado al intentar iniciar sesión: ' + (err?.message || String(err)));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0b192c 0%, #162a45 50%, #1e3a5f 100%)',
        fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: '20px'
      }}
    >
      <div
        id="login"
        style={{
          width: '100%',
          maxWidth: '380px',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '32px 28px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Logo and Brand */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0d2340 0%, #1b3d5c 100%)',
              marginBottom: '12px',
              boxShadow: '0 4px 12px rgba(13, 35, 64, 0.2)'
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="#b0872b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="9" r="2.5"></circle>
              <path d="M12 11.5v8.5"></path>
              <path d="M7.5 15H16.5"></path>
              <path d="M4.5 15.5c0 3.5 3.4 5.5 7.5 5.5s7.5-2 7.5-5.5"></path>
            </svg>
          </div>
          <h1
            style={{
              margin: '0 0 6px',
              fontSize: '22px',
              fontWeight: 700,
              color: '#0d2340',
              letterSpacing: '-0.02em'
            }}
          >
            OPTRACKER
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7686', lineHeight: 1.4 }}>
            Plataforma de Optimización de Flota y Gestión DMAIC
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              htmlFor="loginEmail"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#3f4a5a'
              }}
            >
              Correo electrónico
            </label>
            <input
              id="loginEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@flota.org"
              autoComplete="username"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                borderRadius: '6px',
                border: '1px solid #d6dae1',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
            />
          </div>

          <div>
            <label
              htmlFor="loginPass"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#3f4a5a'
              }}
            >
              Contraseña
            </label>
            <input
              id="loginPass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                borderRadius: '6px',
                border: '1px solid #d6dae1',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
            />
          </div>

          {/* Error Message Container */}
          <div
            id="loginErr"
            style={{
              color: '#d9383a',
              fontSize: '12.5px',
              minHeight: '18px',
              fontWeight: 500
            }}
          >
            {errorMsg}
          </div>

          <button
            id="btnLogin"
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '11px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#ffffff',
              background: cargando
                ? '#7f93a7'
                : 'linear-gradient(180deg, #1b3d5c 0%, #0d2340 100%)',
              border: 'none',
              borderRadius: '6px',
              cursor: cargando ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(13, 35, 64, 0.25)',
              transition: 'transform 0.1s, opacity 0.2s'
            }}
          >
            {cargando ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #edf0f5',
            textAlign: 'center',
            fontSize: '11.5px',
            color: '#8c98a9'
          }}
        >
          Autenticación segura vía Supabase Auth
        </div>
      </div>
    </div>
  );
};
