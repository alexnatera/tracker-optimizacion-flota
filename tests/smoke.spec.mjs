/**
 * Smoke test de OPTRACKER (CI-002)
 *
 * Por que existe: hasta la v1.5.4 nada verificaba una version antes de
 * publicarla. Se perdio el panel de notificaciones en silencio y nadie
 * lo noto hasta el dia siguiente. Este test corre en menos de un minuto
 * y habria atrapado esa regresion en el acto.
 *
 * Requiere dos variables de entorno con una cuenta de solo lectura:
 *   OPTRACKER_TEST_EMAIL
 *   OPTRACKER_TEST_PASSWORD
 *
 * En GitHub Actions van como secrets del repositorio. Usa una cuenta con
 * rol "lector" para que el test no pueda modificar datos reales.
 */

import { test, expect } from '@playwright/test';

const EMAIL = process.env.OPTRACKER_TEST_EMAIL;
const PASSWORD = process.env.OPTRACKER_TEST_PASSWORD;

/** Los modulos que tienen que estar presentes en toda version publicada. */
const MODULOS = [
  'Resumen',
  'Matriz',
  'Portafolio',
  'Tareas',
  'Radar',
  'Contactos',
  'Calendario',
  'Equipo',
  'Historial',
  'Configuración',
];

/** Errores de consola que no indican una regresion nuestra. */
const RUIDO = [
  /favicon/i,
  /ResizeObserver loop/i,
  /Download the React DevTools/i,
  /net::ERR_INTERNET_DISCONNECTED/i,
];

function capturarErrores(page) {
  const errores = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const texto = msg.text();
    if (RUIDO.some((r) => r.test(texto))) return;
    errores.push(texto);
  });
  page.on('pageerror', (err) => errores.push(`pageerror: ${err.message}`));
  return errores;
}

async function iniciarSesion(page) {
  test.skip(!EMAIL || !PASSWORD, 'Faltan OPTRACKER_TEST_EMAIL / OPTRACKER_TEST_PASSWORD');
  await page.goto('/index.html');
  await page.getByLabel(/correo|email/i).first().fill(EMAIL);
  await page.getByLabel(/contrase/i).first().fill(PASSWORD);
  await page.getByRole('button', { name: /entrar|iniciar/i }).first().click();
  // La sesion quedo iniciada cuando desaparece el formulario de login
  await expect(page.getByRole('button', { name: /entrar|iniciar/i })).toBeHidden({ timeout: 15_000 });
}

test.describe('OPTRACKER · smoke', () => {
  test('la app carga sin errores de consola', async ({ page }) => {
    const errores = capturarErrores(page);
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    expect(errores, `Errores de consola al cargar:\n${errores.join('\n')}`).toEqual([]);
  });

  test('version.json coincide con la constante del service worker', async ({ page, request }) => {
    const manifiesto = await (await request.get('/version.json')).json();
    expect(manifiesto.version, 'version.json sin version valida').toMatch(/^\d+\.\d+\.\d+$/);

    const sw = await (await request.get('/sw.js')).text();
    const enSw = sw.match(/const\s+VERSION\s*=\s*['"]([^'"]+)['"]/)?.[1];
    expect(
      enSw,
      'La version publicada no coincide con la del service worker: los navegadores con la app cacheada no van a actualizarse'
    ).toBe(manifiesto.version);
  });

  test('el manifest de la PWA es valido y tiene sus iconos', async ({ request }) => {
    const res = await request.get('/manifest.webmanifest');
    expect(res.ok()).toBeTruthy();
    const manifest = await res.json();
    expect(manifest.name).toBeTruthy();
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    for (const icono of manifest.icons) {
      const r = await request.get('/' + icono.src.replace(/^\.?\//, ''));
      expect(r.ok(), `Falta el icono ${icono.src}`).toBeTruthy();
    }
  });

  test('los diez modulos renderizan tras iniciar sesion', async ({ page }) => {
    const errores = capturarErrores(page);
    await iniciarSesion(page);
    await page.waitForLoadState('networkidle');

    const faltantes = [];
    for (const modulo of MODULOS) {
      const visible = await page
        .getByText(new RegExp(modulo, 'i'))
        .first()
        .isVisible()
        .catch(() => false);
      if (!visible) faltantes.push(modulo);
    }

    expect(faltantes, `Modulos que no aparecen: ${faltantes.join(', ')}`).toEqual([]);
    expect(errores, `Errores de consola con la sesion iniciada:\n${errores.join('\n')}`).toEqual([]);
  });

  test('el modulo de mejora continua carga y muestra las fases DMAIC', async ({ page }) => {
    const errores = capturarErrores(page);
    await page.goto('/mejora-continua.html');
    test.skip(!EMAIL || !PASSWORD, 'Faltan credenciales de prueba');

    await page.getByLabel(/correo/i).first().fill(EMAIL);
    await page.getByLabel(/contrase/i).first().fill(PASSWORD);
    await page.getByRole('button', { name: /entrar/i }).first().click();

    await expect(page.getByText('Tablero DMAIC')).toBeVisible({ timeout: 15_000 });
    for (const fase of ['Definir', 'Medir', 'Analizar', 'Mejorar', 'Controlar']) {
      await expect(page.getByText(fase, { exact: false }).first()).toBeVisible();
    }
    expect(errores, `Errores de consola:\n${errores.join('\n')}`).toEqual([]);
  });

  test('en pantalla de telefono no hay scroll horizontal', async ({ page }) => {
    // El 5 de agosto salieron cuatro parches seguidos por problemas que
    // solo se ven en un telefono. Esto los detecta antes de publicar.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');

    const desborde = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(desborde, `La pagina desborda ${desborde}px a lo ancho en 390px`).toBeLessThanOrEqual(1);
  });
});
