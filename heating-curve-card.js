class t extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._config={},this._data=[]}setConfig(t){if(!(t.entities&&t.entities.vorlauf&&t.entities.ruecklauf&&t.entities.aussen))throw new Error("Bitte definieren Sie alle benötigten Entitäten (vorlauf, ruecklauf, aussen)");this._config=t}set hass(t){if(!this._config)return;const e=t.states[this._config.entities.vorlauf],n=t.states[this._config.entities.ruecklauf],s=t.states[this._config.entities.aussen];if(e&&n&&s){const t={time:new Date,aussen:parseFloat(s.state),vorlauf:parseFloat(e.state),ruecklauf:parseFloat(n.state)};this._data.push(t),this._data.length>100&&this._data.shift(),this._render()}}_render(){if(!this._data.length)return;const t=[...this._data].sort(((t,e)=>t.aussen-e.aussen)),e=Math.floor(Math.min(...t.map((t=>t.aussen)))),n=Math.ceil(Math.max(...t.map((t=>t.aussen)))),s=Math.floor(Math.min(...t.map((t=>Math.min(t.vorlauf,t.ruecklauf))))),a=Math.ceil(Math.max(...t.map((t=>Math.max(t.vorlauf,t.ruecklauf))))),i={top:20,right:30,bottom:40,left:50},o=600-i.left-i.right,l=400-i.top-i.bottom,r=t=>i.left+(t-e)*o/(n-e),c=t=>i.top+l-(t-s)*l/(a-s),h=`M ${t.map((t=>`${r(t.aussen)},${c(t.vorlauf)}`)).join(" L ")}`,d=`M ${t.map((t=>`${r(t.aussen)},${c(t.ruecklauf)}`)).join(" L ")}`;this.shadowRoot.innerHTML=`\n      <ha-card header="${this._config.title||"Heizkurve"}">\n        <div class="card-content">\n          <svg width="600" height="400">\n            <g class="axis">\n              ${this._createXAxis(e,n,i,o,400)}\n              ${this._createYAxis(s,a,i,l)}\n            </g>\n            <path d="${h}" stroke="red" fill="none" stroke-width="2"/>\n            <path d="${d}" stroke="blue" fill="none" stroke-width="2"/>\n          </svg>\n          <div class="legend">\n            <div class="legend-item"><span class="color-box" style="background: red"></span>Vorlauf</div>\n            <div class="legend-item"><span class="color-box" style="background: blue"></span>Rücklauf</div>\n          </div>\n        </div>\n      </ha-card>\n    `;const f=document.createElement("style");f.textContent="\n      .card-content {\n        padding: 16px;\n      }\n      .legend {\n        display: flex;\n        justify-content: center;\n        gap: 16px;\n        margin-top: 8px;\n      }\n      .legend-item {\n        display: flex;\n        align-items: center;\n        gap: 4px;\n      }\n      .color-box {\n        width: 12px;\n        height: 12px;\n        border-radius: 2px;\n      }\n      text {\n        font-size: 12px;\n      }\n      .axis path,\n      .axis line {\n        stroke: #888;\n      }\n    ",this.shadowRoot.appendChild(f)}_createXAxis(t,e,n,s,a){const i=(e-t)/4;let o=`<line x1="${n.left}" y1="${a-n.bottom}" x2="${n.left+s}" y2="${a-n.bottom}" stroke="#888"/>`;for(let e=0;e<5;e++){const l=t+i*e,r=n.left+s*e/4;o+=`\n        <line x1="${r}" y1="${a-n.bottom}" x2="${r}" y2="${a-n.bottom+5}" stroke="#888"/>\n        <text x="${r}" y="${a-n.bottom+20}" text-anchor="middle">${l.toFixed(1)}°C</text>\n      `}return o}_createYAxis(t,e,n,s){const a=(e-t)/4;let i=`<line x1="${n.left}" y1="${n.top}" x2="${n.left}" y2="${n.top+s}" stroke="#888"/>`;for(let e=0;e<5;e++){const o=t+a*e,l=n.top+s-s*e/4;i+=`\n        <line x1="${n.left-5}" y1="${l}" x2="${n.left}" y2="${l}" stroke="#888"/>\n        <text x="${n.left-10}" y="${l+4}" text-anchor="end">${o.toFixed(1)}°C</text>\n      `}return i}}customElements.define("heating-curve-card",t);
