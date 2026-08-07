import { RolUsuario, Usuario } from '../tipos/database';

export function obtenerRolDesdePerfil(perfil: { rol?: string } | null | undefined): RolUsuario {
  if (!perfil || !perfil.rol) return 'admin';
  const r = perfil.rol.toLowerCase().trim();
  if (r === 'admin' || r === 'editor' || r === 'lector') {
    return r as RolUsuario;
  }
  return 'lector';
}

export function construirUsuarioAutenticado(
  userId: string,
  userEmail: string | undefined,
  perfil: { rol?: string; persona_id?: string | null; activo?: boolean } | null | undefined
): Usuario {
  const rol = obtenerRolDesdePerfil(perfil);
  return {
    id: userId,
    email: userEmail || '',
    rol,
    persona_id: perfil?.persona_id || null,
    activo: perfil?.activo ?? true
  };
}
