import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-header')
export class AppHeader extends LitElement {
  static styles = css`
    ion-header {
      --background: #3880ff;
      --color: #fff;
    }
  `;

  render() {
    return html`
      <ion-header>
        <ion-toolbar>
          <ion-title>My App</ion-title>
        </ion-toolbar>
      </ion-header>
    `;
  }
}
