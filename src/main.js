import './styles.css';
import { UniverseApp } from './core/UniverseApp.js';

const loading = document.querySelector('#loading');
const fallback = document.querySelector('#webglFallback');
const fallbackTitle = document.querySelector('#fallbackTitle');
const fallbackMessage = document.querySelector('#fallbackMessage');
const fallbackDetails = document.querySelector('#fallbackDetails');
const fallbackReload = document.querySelector('#fallbackReload');
fallbackReload?.addEventListener('click', () => location.reload());

function supportsWebGL2() {
  try {
    const probe = document.createElement('canvas');
    const context = probe.getContext('webgl2');
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

function showFatal(error) {
  console.error('[Universe startup error]', error);
  loading?.classList.add('done');

  const webglAvailable = supportsWebGL2();
  const isWebGLFailure =
    error?.code === 'WEBGL2_UNAVAILABLE' ||
    error?.code === 'WEBGL_CONTEXT_LOST' ||
    !webglAvailable;

  if (fallbackTitle) {
    fallbackTitle.textContent = isWebGLFailure
      ? 'WebGL2 could not start'
      : 'The universe failed to initialize';
  }

  if (fallbackMessage) {
    fallbackMessage.textContent = isWebGLFailure
      ? 'Your browser reports WebGL2 as unavailable for this page. Check graphics acceleration or try restarting the browser.'
      : 'WebGL2 is available, but another startup error stopped the 3D scene. The exact error is shown below.';
  }

  if (fallbackDetails) {
    fallbackDetails.textContent =
      error?.stack ||
      error?.message ||
      String(error || 'Unknown startup error');
  }

  if (fallback) fallback.hidden = false;
}

addEventListener('universefatal', (event) => showFatal(event.detail), { once: true });

try {
  const app = new UniverseApp(document.querySelector('#universe'));
  app.init().catch(showFatal);
} catch (error) {
  showFatal(error);
}
