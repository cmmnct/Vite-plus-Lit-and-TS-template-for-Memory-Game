import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class MemoryCard extends LitElement {
  @property({ type: String }) name: string = '';
  @property({ type: String }) set: string = '';
  @property({ type: Boolean }) flipped: boolean = false;

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

  render() {
    return html`
      <div class="card" style="background-color: ${this.flipped ? 'white' : '#f0f0f0'}">
        ${this.flipped ? html`<img src="/assets/img/${this.name}.webp">` : ''}
      </div>
    `;
  }
}

customElements.define('memory-card', MemoryCard);
