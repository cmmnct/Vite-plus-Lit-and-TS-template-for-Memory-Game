import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { Result } from "../models/models";

@customElement("result-component")
export class ResultComponent extends LitElement {
  @property({ type: Array }) results: Result[] = [];
  @property({ type: String }) filter: "day" | "week" | "month" | "year" =
    "month";

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
      height: 60vh; /* verhoog de hoogte van de grafiek */
    }
    button {
      padding: 10px;
      cursor: pointer;
    }
    .filter-buttons {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
    }
  `;

  private chart: Chart | null = null;

  updated() {
    this.renderChart();
  }

  render() {
    return html`
      <div class="overlay" @click="${this.closePopup}"></div>
      <div class="popup">
        <div class="filter-buttons">
          <button @click="${() => this.setFilter("day")}">Dag</button>
          <button @click="${() => this.setFilter("week")}">Week</button>
          <button @click="${() => this.setFilter("month")}">Maand</button>
          <button @click="${() => this.setFilter("year")}">Jaar</button>
        </div>
        <div class="chart-container">
          <canvas id="resultsChart"></canvas>
        </div>
        <button @click="${this.closePopup}">Sluiten</button>
      </div>
    `;
  }

  setFilter(filter: "day" | "week" | "month" | "year") {
    this.filter = filter;
    this.requestUpdate();
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

    const filteredResults = this.getFilteredResults();

    const datasets = [
      {
        label: "4x4",
        data: this.calculateAverages(
          filteredResults.filter((result) => result.gridSize === 16)
        ),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "5x5",
        data: this.calculateAverages(
          filteredResults.filter((result) => result.gridSize === 25)
        ),
        borderColor: "rgba(192, 75, 192, 1)",
        backgroundColor: "rgba(192, 75, 192, 0.2)",
      },
      {
        label: "6x6",
        data: this.calculateAverages(
          filteredResults.filter((result) => result.gridSize === 36)
        ),
        borderColor: "rgba(192, 192, 75, 1)",
        backgroundColor: "rgba(192, 192, 75, 0.2)",
      },
    ];

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: datasets as any,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "time",
            time: {
              unit: this.getTimeUnit(),
            },
            title: {
              display: true,
              text: "Datum",
            },
          },
          y: {
            title: {
              display: true,
              text: "Gemiddelde Pogingen",
            },
          },
        },
      },
    });
  }

  getFilteredResults() {
    const now = new Date();
    let startDate = new Date();

    switch (this.filter) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return this.results.filter((result) => {
      const resultDate = new Date(result.date);
      return resultDate >= startDate && resultDate <= now;
    });
  }

  getTimeUnit() {
    switch (this.filter) {
      case "day":
        return "hour";
      case "week":
        return "day";
      case "month":
        return "week";
      case "year":
        return "month";
    }
  }

  calculateAverages(results: Result[]) {
    const averages: { [date: string]: { total: number; count: number } } = {};

    results.forEach((result) => {
      const date = new Date(result.date).toISOString().split("T")[0];
      if (!averages[date]) {
        averages[date] = { total: 0, count: 0 };
      }
      averages[date].total += result.attempts;
      averages[date].count += 1;
    });

    const sortedAverages = Object.keys(averages)
      .map((date) => ({
        x: new Date(date),
        y: averages[date].total / averages[date].count,
      }))
      .sort((a, b) => a.x.getTime() - b.x.getTime());

    return sortedAverages;
  }
}
