import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import Chart, { ChartConfiguration } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { Result } from "../models/models";

@customElement("result-component")
export class ResultComponent extends LitElement {
  @property({ type: Array }) results: Result[] = [];

  static styles = css`
    .popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      width: 80vw;
      max-width: 1024px;
    }
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }
    .chart-container {
      width: 100%;
      min-height: 50vh
    }
    button {
      padding: 10px;
      cursor: pointer;
    }
  `;

  updated() {
   console.log(
     this.results.map((result) => new Date(result.date).toLocaleDateString())
   );
    this.renderChart();
  }

  render() {
    return html`
      <div class="overlay" @click="${this.closePopup}"></div>
      <div class="popup">
        <div class="chart-container">
          <canvas id="resultsChart"></canvas>
        </div>
        <button @click="${this.closePopup}">Sluiten</button>
      </div>
    `;
  }

  closePopup() {
    this.dispatchEvent(
      new CustomEvent("close-popup", { bubbles: true, composed: true })
    );
  }

  renderChart() {
    const ctx = this.shadowRoot?.getElementById(
      "resultsChart"
    ) as HTMLCanvasElement;
    if (!ctx) return;

    const labels = months({ count: 7 });
    const data = {
      labels: this.results.map((result) =>
        new Date(result.date).toLocaleDateString()
      ),
      datasets: [
        {
          label: "My First Dataset",
          data: this.results.map((result) => result.attempts),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
    const config = {
      type: "line",
      data: data
    };

    const myChart = new Chart(ctx, config as ChartConfiguration)
    
  }

}

export const MONTHS = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December",
];

export function months(config: any) {
  var cfg = config || {};
  var count = cfg.count || 12;
  var section = cfg.section;
  var values = [];
  var i, value;

  for (i = 0; i < count; ++i) {
    value = MONTHS[Math.ceil(i) % 12];
    values.push(value.substring(0, section));
  }

  return values;
}