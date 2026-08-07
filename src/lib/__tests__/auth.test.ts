import { describe, it, expect } from 'vitest';
import { obtenerRolDesdePerfil, construirUsuarioAutenticado } from '../auth';

describe('Lógica de Autenticación y Roles de Supabase (TDD)', () => {
  it('debe determinar el rol correcto del perfil de usuario', () => {
    expect(obtenerRolDesdePerfil({ rol: 'admin' })).toBe('admin');
    expect(obtenerRolDesdePerfil({ rol: 'editor' })).toBe('editor');
    expect(obtenerRolDesdePerfil({ rol: 'lector' })).toBe('lector');
    expect(obtenerRolDesdePerfil({ rol: 'desconocido' })).toBe('lector');
    expect(obtenerRolDesdePerfil(null)).toBe('admin');
  });

  it('debe construir un objeto Usuario autenticado con los datos reales', () => {
    const usuario = construirUsuarioAutenticado('u123', 'usuario@flota.org', {
      rol: 'editor',
      persona_id: 'p456',
      activo: true
    });

    expect(usuario.id).toBe('u123');
    expect(usuario.email).toBe('usuario@flota.org');
    expect(usuario.rol).toBe('editor');
    expect(usuario.persona_id).toBe('p456');
    expect(usuario.activo).toBe(true);
  });
});
