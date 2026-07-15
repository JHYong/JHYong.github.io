(() => {
  const canvas = document.querySelector('#snake-game');
  const startButton = document.querySelector('#start-game');
  const pauseButton = document.querySelector('#pause-game');
  const restartButton = document.querySelector('#restart-game');
  const scoreElement = document.querySelector('#score');
  const highScoreElement = document.querySelector('#high-score');
  const statusElement = document.querySelector('#game-status');
  const controlButtons = document.querySelectorAll('[data-direction]');
  if (!canvas || !startButton || !pauseButton || !restartButton) return;

  const context = canvas.getContext('2d');
  const cellSize = 24;
  const cells = canvas.width / cellSize;
  const speed = 130;
  const directions = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  let snake;
  let direction;
  let pendingDirection;
  let food;
  let enemy;
  let score;
  let gameTimer = null;
  let enemyTimer = null;
  let running = false;
  let paused = false;
  let highScore = Number(localStorage.getItem('snake-high-score')) || 0;

  highScoreElement.textContent = highScore;

  const sameCell = (first, second) => first.x === second.x && first.y === second.y;
  const randomCell = () => ({ x: Math.floor(Math.random() * cells), y: Math.floor(Math.random() * cells) });
  const openCell = () => {
    let candidate;
    do candidate = randomCell(); while (snake.some((part) => sameCell(part, candidate)) || sameCell(food, candidate) || (enemy && sameCell(enemy, candidate)));
    return candidate;
  };
  const setStatus = (message) => { statusElement.textContent = message; };
  const updateScore = () => { scoreElement.textContent = score; highScoreElement.textContent = highScore; };

  function resetBoard() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    direction = directions.right;
    pendingDirection = directions.right;
    food = { x: 15, y: 10 };
    enemy = { x: 4, y: 4 };
    score = 0;
    running = false;
    paused = false;
    updateScore();
    draw();
  }

  function drawCell(cell, color, inset = 2) {
    context.fillStyle = color;
    context.fillRect(cell.x * cellSize + inset, cell.y * cellSize + inset, cellSize - inset * 2, cellSize - inset * 2);
  }

  function draw() {
    context.fillStyle = '#10141b';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'rgba(255,255,255,.055)';
    for (let line = 0; line <= cells; line += 1) { context.beginPath(); context.moveTo(line * cellSize, 0); context.lineTo(line * cellSize, canvas.height); context.stroke(); context.beginPath(); context.moveTo(0, line * cellSize); context.lineTo(canvas.width, line * cellSize); context.stroke(); }
    drawCell(food, '#ffb552', 5);
    drawCell(enemy, '#ff5f75', 4);
    snake.forEach((part, index) => drawCell(part, index === 0 ? '#b9f875' : '#72ce6f'));
    if (paused) { context.fillStyle = 'rgba(8,10,14,.62)'; context.fillRect(0, 0, canvas.width, canvas.height); context.fillStyle = '#fff'; context.font = '700 32px sans-serif'; context.textAlign = 'center'; context.fillText('일시정지', canvas.width / 2, canvas.height / 2); }
  }

  function stopGame(message) {
    running = false;
    paused = false;
    clearInterval(gameTimer);
    clearInterval(enemyTimer);
    gameTimer = null;
    enemyTimer = null;
    pauseButton.disabled = true;
    pauseButton.textContent = '일시정지';
    setStatus(message);
  }

  function moveEnemy() { enemy = openCell(); draw(); if (running && !paused) setStatus('적이 새 위치로 이동했습니다.'); }

  function tick() {
    if (!running || paused) return;
    direction = pendingDirection;
    const head = { x: (snake[0].x + direction.x + cells) % cells, y: (snake[0].y + direction.y + cells) % cells };
    const hitsSelf = snake.some((part) => sameCell(part, head));
    if (hitsSelf || sameCell(head, enemy)) { draw(); stopGame('게임 오버! 재시작하여 다시 도전하세요.'); return; }
    snake.unshift(head);
    if (sameCell(head, food)) { score += 10; highScore = Math.max(highScore, score); localStorage.setItem('snake-high-score', String(highScore)); food = openCell(); updateScore(); setStatus('맛있습니다. 길이가 늘어났어요!'); } else snake.pop();
    draw();
  }

  function startGame() {
    if (running) return;
    running = true;
    paused = false;
    pauseButton.disabled = false;
    pauseButton.textContent = '일시정지';
    setStatus('게임 진행 중: 적을 피하고 음식을 먹으세요.');
    // Both timers are created only here and cleared on every terminal state.
    gameTimer = setInterval(tick, speed);
    enemyTimer = setInterval(moveEnemy, 5000);
  }

  function setDirection(name) {
    const next = directions[name];
    if (!next || (next.x === -direction.x && next.y === -direction.y)) return;
    pendingDirection = next;
    if (!running) startGame();
  }

  document.addEventListener('keydown', (event) => {
    const keys = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
    if (!keys[event.key]) return;
    event.preventDefault();
    setDirection(keys[event.key]);
  });
  controlButtons.forEach((button) => button.addEventListener('click', () => setDirection(button.dataset.direction)));
  startButton.addEventListener('click', startGame);
  pauseButton.addEventListener('click', () => { if (!running) return; paused = !paused; pauseButton.textContent = paused ? '계속하기' : '일시정지'; setStatus(paused ? '게임을 일시정지했습니다.' : '게임을 다시 시작합니다.'); draw(); });
  restartButton.addEventListener('click', () => { stopGame('새 게임을 준비했습니다.'); resetBoard(); startGame(); });
  resetBoard();
})();
