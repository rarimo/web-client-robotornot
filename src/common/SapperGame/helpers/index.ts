export const generateMines = (width, height, mineCount) => {
  const mines = [];
  while (mines.length < mineCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const coordinate = `${x}-${y}`;

    if (!mines.includes(coordinate)) {
      mines.push(coordinate);
    }
  }
  return mines;
}

export const calculateMineCounts = (mines, width, height) => {
  const mineCounts = Array.from({ length: height }, () => Array(width).fill(0));

  for (const mine of mines) {
    const [x, y] = mine.split('-').map(Number);
    mineCounts[y][x] = 'X';

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height && mineCounts[ny][nx] !== 'X') {
          mineCounts[ny][nx]++;
        }
      }
    }
  }

  return mineCounts;
}
