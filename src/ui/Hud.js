export class Hud {
  constructor(stages) {
    this.stages = stages;
    this.nav = document.querySelector('#stageNav');
    this.fill = document.querySelector('#scaleFill');
    this.stageReadout = document.querySelector('#stageReadout');
    this.scaleReadout = document.querySelector('#scaleReadout');
    this.panel = document.querySelector('#stagePanel');
    this.panelClose = document.querySelector('#stagePanelClose');
    this.infoButton = document.querySelector('#infoButton');
    this.hoverCard = document.querySelector('#hoverCard');
    this.inspector = document.querySelector('#inspector');
    this.lastStage = -1;
    this.introShown = false;
    this.panelTimer = 0;
    this.onNavigate = () => {};
    this._buildNav();
    this._wire();
  }

  _buildNav() {
    this.stages.forEach((stage, index) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = `<span>${stage.title}</span>`;
      button.setAttribute('aria-label', `Go to ${stage.title}`);
      button.addEventListener('click', () => this.onNavigate(index));
      li.append(button);
      this.nav.append(li);
    });
  }

  _wire() {
    this.panelClose.addEventListener('click', () => this.closeStagePanel());
    this.infoButton.addEventListener('click', () => this.openStagePanel(false));
    document.querySelector('#inspectorClose').addEventListener('click', () => this.closeInspector());
    document.querySelector('#helpButton').addEventListener('click', (event) => {
      const help = document.querySelector('#helpPanel');
      const open = help.hidden;
      help.hidden = !open;
      event.currentTarget.setAttribute('aria-expanded', String(open));
    });
  }

  update(stageIndex, localProgress, globalProgress) {
    const stage = this.stages[stageIndex];
    this.fill.style.height = `${globalProgress * 100}%`;
    this.stageReadout.textContent = stage.title.toUpperCase();
    const next = this.stages[Math.min(stageIndex + 1, this.stages.length - 1)];
    const exponent = stage.exponent + (next.exponent - stage.exponent) * Math.max(0, Math.min(1, localProgress));
    this.scaleReadout.textContent = `10^${exponent.toFixed(exponent % 1 ? 1 : 0)} m`;
    [...this.nav.querySelectorAll('button')].forEach((button, index) => button.classList.toggle('active', index === stageIndex));
    if (stageIndex !== this.lastStage) {
      this.lastStage = stageIndex;
      this._populateStage(stage, stageIndex);
      if (globalProgress > 0.012) this.openStagePanel(true);
      else this.closeStagePanel();
      this.closeInspector();
    }
    if (!this.introShown && stageIndex === 0 && globalProgress > 0.018) {
      this.introShown = true;
      this.openStagePanel(true);
    }
  }

  _populateStage(stage, index) {
    document.querySelector('#stageKicker').textContent = stage.kicker;
    document.querySelector('#stageNumber').textContent = `${String(index + 1).padStart(2, '0')} / ${String(this.stages.length).padStart(2, '0')}`;
    document.querySelector('#stageTitle').textContent = stage.title;
    document.querySelector('#stageDescription').textContent = stage.description;
    document.querySelector('#stageScale').textContent = stage.scale;
    document.querySelector('#stageDistance').textContent = stage.distance;
  }

  openStagePanel(auto = true) {
    clearTimeout(this.panelTimer);
    this.panel.classList.add('open');
    this.panel.setAttribute('aria-hidden', 'false');
    if (auto) this.panelTimer = setTimeout(() => this.closeStagePanel(), 3600);
  }
  closeStagePanel() {
    this.panel.classList.remove('open');
    this.panel.setAttribute('aria-hidden', 'true');
  }

  showHover(data, x, y) {
    if (!data) {
      this.hoverCard.hidden = true;
      return;
    }
    this.hoverCard.hidden = false;
    document.querySelector('#hoverType').textContent = data.type;
    document.querySelector('#hoverName').textContent = data.name;
    document.querySelector('#hoverSummary').textContent = data.summary;
    const width = 220, height = 125, pad = 14;
    let left = x + 18, top = y + 18;
    if (left + width > innerWidth - pad) left = x - width - 18;
    if (top + height > innerHeight - pad) top = y - height - 18;
    this.hoverCard.style.transform = `translate(${Math.max(pad, left)}px,${Math.max(pad, top)}px)`;
  }

  openInspector(data) {
    if (!data) return;
    this.closeStagePanel();
    document.querySelector('#inspectorType').textContent = data.type;
    document.querySelector('#inspectorTitle').textContent = data.name;
    document.querySelector('#inspectorText').textContent = data.text;
    const facts = document.querySelector('#inspectorFacts');
    facts.replaceChildren(...data.facts.map(([key, value]) => {
      const wrapper = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = key; dd.textContent = value; wrapper.append(dt, dd); return wrapper;
    }));
    this.inspector.classList.add('open');
    this.inspector.setAttribute('aria-hidden', 'false');
  }
  closeInspector() {
    this.inspector.classList.remove('open');
    this.inspector.setAttribute('aria-hidden', 'true');
  }
}
