import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

@customElement("login-component")
export class LoginComponent extends LitElement {
  @property({ type: String }) email: string = "";
  @property({ type: String }) password: string = "";
  @property({ type: String }) message: string = "";

  static styles = css`
    .container {
      display: flex;
      flex-direction: column;
      width: 300px;
      margin: auto;
      padding: 1em;
      border: 1px solid #ccc;
      border-radius: 10px;
    }
    .container input {
      margin: 0.5em 0;
      padding: 0.5em;
      font-size: 1em;
    }
    .container button {
      margin: 0.5em 0;
      padding: 0.5em;
      font-size: 1em;
      cursor: pointer;
    }
    .message {
      margin: 0.5em 0;
      color: red;
    }
  `;

  render() {
    return html`
      <div class="container">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          .value=${this.email}
          @input=${this.updateEmail}
        />
        <input
          type="password"
          placeholder="Password"
          .value=${this.password}
          @input=${this.updatePassword}
        />
        <button @click=${this.login}>Login</button>
        <button @click=${this.register}>Register</button>
        <div class="message">${this.message}</div>
      </div>
    `;
  }

  updateEmail(e: Event) {
    this.email = (e.target as HTMLInputElement).value;
  }

  updatePassword(e: Event) {
    this.password = (e.target as HTMLInputElement).value;
  }

  async login() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        this.email,
        this.password
      );
      this.message = `Logged in as ${userCredential.user.email}`;
    } catch (error:any) {
      this.message = `Error: ${error.message}`;
    }
  }

  async register() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        this.email,
        this.password
      );
      this.message = `Registered as ${userCredential.user.email}`;
    } catch (error:any) {
      this.message = `Error: ${error.message}`;
    }
  }
}
