import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./components/loginComponent";
import "./components/memoryGame";

@customElement("my-app")
export class MyApp extends LitElement {
  render() {
    return html`
      <memory-game></memory-game>
    `;
  }
}
