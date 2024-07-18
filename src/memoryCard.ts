import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("memory-card")
export class MemoryCard extends LitElement {
  @property({ type: String }) name = "";
  @property({ type: String }) set = "";
  @property({ type: Boolean }) exposed = false;

  

  static styles = css`
    .card {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      position: relative;
      background-color: var(--card-bg-color, #f0f0f0);
    }
    img {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  `;

  constructor() {
    super();
    this.name = '';
    this.exposed = false;
  }

  render() {
    return html`
      <div class="card" style="background-color: ${this.exposed ? 'white' : '#f0f0f0'}">
        ${this.exposed ? html`<img src="assets/img/${this.name}.webp">` : ''}
      </div>
    `;
  }
}

customElements.define('memory-card', MemoryCard);
