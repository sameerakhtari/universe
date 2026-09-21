import './styles.css';
import { UniverseApp } from './core/UniverseApp.js';

const app = new UniverseApp(document.querySelector('#universe'));
app.init().catch((error) => {
  console.error(error);
  document.querySelector('#loading')?.classList.add('done');
  const fallback = document.querySelector('#webglFallback');
  if (fallback) fallback.hidden = false;
});
