#!/usr/bin/env node
/**
 * release.mjs - control de versiones de OPTRACKER
 *
 * Problema que resuelve (CI-001): publicar una version requeria tocar a
 * mano cuatro lugares -- app.html, index.html, version.json y la
 * constante VERSION de sw.js -- en commits separados. Nada verificaba
 * que quedaran sincronizados. Asi se perdio en silencio el panel de
 * notificaciones en la v1.5.4.
 *
 * Uso:
 *   node scripts/release.mjs check          Verifica que todo este sincronizado (usado por CI)
 *   node scripts/release.mjs set 1.6.0      Fija esa version en todos los archivos
 *   node scripts/release.mjs bump patch     Sube 1.5.4 -> 1.5.5
 *   node scripts/release.mjs bump minor     Sube 1.5.4 -> 1.6.0
 *   node scripts/release.mjs bump major     Sube 1.5.4 -> 2.0.0
 *
 * `check` sale con codigo 1 si algo no coincide, para cortar el deploy.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const VERSION_JSON = join(RAIZ, 'version.json');
const SW_JS        = join(RAIZ, 'sw.js');
const APP_HTML     = join(RAIZ, 'app.html');
const INDEX_HTML   = join(RAIZ, 'index.html');

const SEMVER = /^\d+\.\d+\.\d+$/;

const leer = (p) => readFileSync(p, 'utf8');
const rojo  = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const gris  = (s) => `\x1b[90m${s}\x1b[0m`;

/** Version declarada en version.json (la fuente de verdad). */
function versionDeManifiesto() {
  const m = JSON.parse(leer(VERSION_JSON));
  if (!SEMVER.test(m.version ?? '')) {
    throw new Error(`version.json tiene una version invalida: ${JSON.stringify(m.version)}`);
  }
  return m;
}

/** Version embebida en la constante VERSION del service worker. */
function versionDeServiceWorker() {
  const m = leer(SW_JS).match(/const\s+VERSION\s*=\s*['"]([^'"]+)['"]/);
  if (!m) throw new Error('No se encontro la constante VERSION en sw.js');
  return m[1];
}


/**
 * Version incrustada DENTRO del bundle (const VERSION = "x.y.z").
 * Es la tercera copia de la version y la mas facil de olvidar: si queda
 * atras, la app se ve desactualizada a si misma, aplica la version nueva,
 * recarga, se vuelve a ver desactualizada... y entra en bucle infinito.
 * Paso de verdad en la v1.6.0.
 */
function versionDeBundle(ruta, nombre) {
  const m = leer(ruta).match(/const\s+VERSION\s*=\s*\\?"(\d+\.\d+\.\d+)\\?"/);
  if (!m) throw new Error(`No se encontro la constante VERSION dentro de ${nombre}`);
  return m[1];
}

/**
 * app.html e index.html son un bundle generado por una herramienta
 * externa, no se reescriben aca. Lo unico que se verifica es que ambos
 * existan y que index.html no haya quedado vacio o truncado -- que es
 * como se ve una publicacion a medias.
 */
function revisarBundles() {
  const problemas = [];
  for (const [nombre, ruta] of [['app.html', APP_HTML], ['index.html', INDEX_HTML]]) {
    if (!existsSync(ruta)) { problemas.push(`falta ${nombre}`); continue; }
    const contenido = leer(ruta);
    if (contenido.length < 10_000) {
      problemas.push(`${nombre} pesa solo ${contenido.length} bytes: parece truncado`);
    }
    if (!/<\/html>\s*$/i.test(contenido)) {
      problemas.push(`${nombre} no termina en </html>: parece incompleto`);
    }
  }
  return problemas;
}

function check() {
  const problemas = [];
  let manifiesto;

  try {
    manifiesto = versionDeManifiesto();
  } catch (e) {
    console.error(rojo(`FALLA  ${e.message}`));
    process.exit(1);
  }

  const vManifiesto = manifiesto.version;

  let vSw;
  try {
    vSw = versionDeServiceWorker();
  } catch (e) {
    problemas.push(e.message);
  }

  if (vSw && vSw !== vManifiesto) {
    problemas.push(
      `desincronizado: version.json dice ${vManifiesto} pero sw.js dice ${vSw}. ` +
      `Los navegadores que ya tienen la app cacheada no van a recibir la version nueva.`
    );
  }

  if (manifiesto.archivo && !existsSync(join(RAIZ, manifiesto.archivo))) {
    problemas.push(`version.json apunta a "${manifiesto.archivo}" y ese archivo no existe`);
  }

  problemas.push(...revisarBundles());

  // La version vive en 4 lugares. Todos tienen que decir lo mismo.
  for (const [nombre, ruta] of [['app.html', APP_HTML], ['index.html', INDEX_HTML]]) {
    if (!existsSync(ruta)) continue;
    try {
      const vBundle = versionDeBundle(ruta, nombre);
      if (vBundle !== vManifiesto) {
        problemas.push(
          `desincronizado: version.json dice ${vManifiesto} pero la constante VERSION dentro de ${nombre} dice ${vBundle}. ` +
          `La app entraria en bucle de recarga: se ve desactualizada, aplica la version nueva, recarga y vuelve a verse desactualizada.`
        );
      }
    } catch (err) { problemas.push(err.message); }
  }

  if (problemas.length) {
    console.error(rojo('\n  Version desincronizada. No se publica.\n'));
    for (const p of problemas) console.error(rojo(`  - ${p}`));
    console.error(gris('\n  Arreglalo con: node scripts/release.mjs set <version>\n'));
    process.exit(1);
  }

  console.log(verde(`\n  OK  version ${vManifiesto} sincronizada en version.json y sw.js`));
  console.log(gris(`      fecha: ${manifiesto.fecha ?? 'sin fecha'}`));
  console.log(gris(`      app.html e index.html presentes y completos\n`));
}

function set(nuevaVersion, notas) {
  if (!SEMVER.test(nuevaVersion)) {
    console.error(rojo(`  "${nuevaVersion}" no es una version valida. Formato: MAYOR.MENOR.PARCHE (ej. 1.6.0)`));
    process.exit(1);
  }

  const manifiesto = JSON.parse(leer(VERSION_JSON));
  const anterior = manifiesto.version;

  if (compararSemver(nuevaVersion, anterior) <= 0) {
    console.error(rojo(`  ${nuevaVersion} no es posterior a la version actual (${anterior}).`));
    console.error(gris('  La app solo aplica versiones estrictamente mas nuevas.'));
    process.exit(1);
  }

  manifiesto.version = nuevaVersion;
  manifiesto.fecha = new Date().toISOString().slice(0, 10);
  if (notas) manifiesto.notas = notas;
  writeFileSync(VERSION_JSON, JSON.stringify(manifiesto, null, 2) + '\n');

  const sw = leer(SW_JS).replace(
    /(const\s+VERSION\s*=\s*['"])([^'"]+)(['"])/,
    `$1${nuevaVersion}$3`
  );
  writeFileSync(SW_JS, sw);

  // Tercera y cuarta copia: la constante dentro de cada bundle.
  for (const [nombre, ruta] of [['app.html', APP_HTML], ['index.html', INDEX_HTML]]) {
    if (!existsSync(ruta)) continue;
    const antes = leer(ruta);
    const despues = antes.replace(/(const\s+VERSION\s*=\s*\\?")(\d+\.\d+\.\d+)(\\?")/, `$1${nuevaVersion}$3`);
    if (antes === despues) {
      console.error(rojo(`  No se pudo actualizar la constante VERSION dentro de ${nombre}. Revisalo a mano.`));
      process.exit(1);
    }
    writeFileSync(ruta, despues);
  }

  console.log(verde(`\n  ${anterior} -> ${nuevaVersion}`));
  console.log(gris('  Actualizados: version.json, sw.js, y la constante VERSION dentro de app.html e index.html'));
  console.log(gris('  Verifica con: node scripts/release.mjs check\n'));
}

function bump(parte) {
  const { version } = versionDeManifiesto();
  const [may, men, par] = version.split('.').map(Number);
  const siguiente = {
    major: `${may + 1}.0.0`,
    minor: `${may}.${men + 1}.0`,
    patch: `${may}.${men}.${par + 1}`,
  }[parte];
  if (!siguiente) {
    console.error(rojo('  Usa: bump major | minor | patch'));
    process.exit(1);
  }
  set(siguiente);
}

function compararSemver(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

const [comando, arg, ...resto] = process.argv.slice(2);

switch (comando) {
  case 'check': check(); break;
  case 'set':   set(arg, resto.join(' ') || undefined); break;
  case 'bump':  bump(arg); break;
  default:
    console.log(`
  release.mjs - control de versiones de OPTRACKER

    node scripts/release.mjs check           verifica que todo este sincronizado
    node scripts/release.mjs set 1.6.0       fija esa version
    node scripts/release.mjs bump patch      1.5.4 -> 1.5.5
    node scripts/release.mjs bump minor      1.5.4 -> 1.6.0
    node scripts/release.mjs bump major      1.5.4 -> 2.0.0
`);
    process.exit(comando ? 1 : 0);
}
