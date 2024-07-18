import { css } from "lit";

export const memoryGameStyles = css`
  .board {
    display: flex;
    flex-wrap: wrap;
    max-width: 900px;
    margin: auto;
  }
  .board16 memory-card {
    width: calc(25% - 20px);
    aspect-ratio: 1/1;
    margin: 10px;
  }
  .board24 memory-card {
    width: calc(20% - 20px);
    aspect-ratio: 1/1;
    margin: 10px;
  }
  .board36 memory-card {
    width: calc(16.66% - 20px);
    aspect-ratio: 1/1;
    margin: 10px;
  }
  .scoreboard {
    text-align: center;
    margin-bottom: 20px;
  }
  .select-grid {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  select {
    padding: 10px;
    font-size: 16px;
  }
`;
