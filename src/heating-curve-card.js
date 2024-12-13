class HeatingCurveCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._data = [];
  }

  setConfig(config) {
    if (!config.entities || 
        !config.entities.vorlauf || 
        !config.entities.ruecklauf || 
        !config.entities.aussen) {
      throw new Error('Bitte definieren Sie alle benötigten Entitäten (vorlauf, ruecklauf, aussen)');
    }
    this._config = config;
  }

  set hass(hass) {
    if (!this._config) return;

    const vorlaufState = hass.states[this._config.entities.vorlauf];
    const ruecklaufState = hass.states[this._config.entities.ruecklauf];
    const aussenState = hass.states[this._config.entities.aussen];

    if (vorlaufState && ruecklaufState && aussenState) {
      const point = {
        time: new Date(),
        aussen: parseFloat(aussenState.state),
        vorlauf: parseFloat(vorlaufState.state),
        ruecklauf: parseFloat(ruecklaufState.state)
      };

      this._data.push(point);
      if (this._data.length > 100) this._data.shift();

      this._render();
    }
  }

  _render() {
    if (!this._data.length) return;

    const sorted = [...this._data].sort((a, b) => a.aussen - b.aussen);
    const minAussen = Math.floor(Math.min(...sorted.map(d => d.aussen)));
    const maxAussen = Math.ceil(Math.max(...sorted.map(d => d.aussen)));
    const minTemp = Math.floor(Math.min(...sorted.map(d => Math.min(d.vorlauf, d.ruecklauf))));
    const maxTemp = Math.ceil(Math.max(...sorted.map(d => Math.max(d.vorlauf, d.ruecklauf))));

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = (val) => margin.left + (val - minAussen) * innerWidth / (maxAussen - minAussen);
    const yScale = (val) => margin.top + innerHeight - (val - minTemp) * innerHeight / (maxTemp - minTemp);

    const vorlaufPath = `M ${sorted.map(d => `${xScale(d.aussen)},${yScale(d.vorlauf)}`).join(' L ')}`;
    const ruecklaufPath = `M ${sorted.map(d => `${xScale(d.aussen)},${yScale(d.ruecklauf)}`).join(' L ')}`;

    this.shadowRoot.innerHTML = `
      <ha-card header="${this._config.title || 'Heizkurve'}">
        <div class="card-content">
          <svg width="${width}" height="${height}">
            <g class="axis">
              ${this._createXAxis(minAussen, maxAussen, margin, innerWidth, height)}
              ${this._createYAxis(minTemp, maxTemp, margin, innerHeight)}
            </g>
            <path d="${vorlaufPath}" stroke="red" fill="none" stroke-width="2"/>
            <path d="${ruecklaufPath}" stroke="blue" fill="none" stroke-width="2"/>
          </svg>
          <div class="legend">
            <div class="legend-item"><span class="color-box" style="background: red"></span>Vorlauf</div>
            <div class="legend-item"><span class="color-box" style="background: blue"></span>Rücklauf</div>
          </div>
        </div>
      </ha-card>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .card-content {
        padding: 16px;
      }
      .legend {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 8px;
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .color-box {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }
      text {
        font-size: 12px;
      }
      .axis path,
      .axis line {
        stroke: #888;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  _createXAxis(min, max, margin, width, height) {
    const steps = 5;
    const range = max - min;
    const stepSize = range / (steps - 1);
    let axis = `<line x1="${margin.left}" y1="${height - margin.bottom}" x2="${margin.left + width}" y2="${height - margin.bottom}" stroke="#888"/>`;
    
    for (let i = 0; i < steps; i++) {
      const value = min + (stepSize * i);
      const x = margin.left + (width * i / (steps - 1));
      axis += `
        <line x1="${x}" y1="${height - margin.bottom}" x2="${x}" y2="${height - margin.bottom + 5}" stroke="#888"/>
        <text x="${x}" y="${height - margin.bottom + 20}" text-anchor="middle">${value.toFixed(1)}°C</text>
      `;
    }
    return axis;
  }

  _createYAxis(min, max, margin, height) {
    const steps = 5;
    const range = max - min;
    const stepSize = range / (steps - 1);
    let axis = `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + height}" stroke="#888"/>`;
    
    for (let i = 0; i < steps; i++) {
      const value = min + (stepSize * i);
      const y = margin.top + height - (height * i / (steps - 1));
      axis += `
        <line x1="${margin.left - 5}" y1="${y}" x2="${margin.left}" y2="${y}" stroke="#888"/>
        <text x="${margin.left - 10}" y="${y + 4}" text-anchor="end">${value.toFixed(1)}°C</text>
      `;
    }
    return axis;
  }
}

customElements.define('heating-curve-card', HeatingCurveCard);