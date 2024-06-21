import { html } from "lit";
import { MemoryGame } from "./memoryGame";

export const memoryGameTemplate = (game: MemoryGame) => {
  const state = game.cardService.getState();

  return html`
    <div class="select-grid">
      <select @change="${game.handleGridSizeChange}">
        <option selected disabled>Kies je speelveld</option>
        <option value="16">4 x 4</option>
        <option value="24">5 x 5</option>
        <option value="36">6 x 6</option>
      </select>
    </div>
    <div class="scoreboard">
      <p>Aantal pogingen: ${state.attempts}</p>
    </div>
    <div class="board board${game.gridSize}">
      ${game.cards.map(
        (card, index) => html`
          <memory-card
            .name="${card.name}"
            .set="${card.set}"
            .exposed="${card.exposed}"
            @click="${() => game.handleCardFlip(index, card)}"
          >
          </memory-card>
        `
      )}
    </div>
  `;
};
