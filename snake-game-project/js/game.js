/*
  Snake Game — game.js
  --------------------
  Handles: grid state, rendering, input (keyboard/touch/dpad),
  collision detection, scoring, speed scaling, and game/overlay states.
  No external dependencies. Pure Canvas 2D + vanilla JS.
*/

(function(){
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const GRID = 20;
  let CELL = canvas.width / GRID;

  const scoreEl = document.getElementById('scoreVal');
  const bestEl = document.getElementById('bestVal');
  const finalScoreEl = document.getElementById('finalScore');
  const startOverlay = document.getElementById('startOverlay');
  const overOverlay = document.getElementById('overOverlay');
  const startBtn = document.getElementById('startBtn');
  const retryBtn = document.getElementById('retryBtn');
  const restartBtn = document.getElementById('restartBtn');
  const dpad = document.getElementById('dpad');

  let snake, dir, nextDir, food, score, best, speedMs, loopTimer, running, alive;
  best = 0;

  const BASE_SPEED = 130;
  const MIN_SPEED = 70;

  function initState(){
    const mid = Math.floor(GRID/2);
    snake = [
      {x: mid-1, y: mid},
      {x: mid-2, y: mid},
      {x: mid-3, y: mid}
    ];
    dir = {x:1, y:0};
    nextDir = {x:1, y:0};
    score = 0;
    speedMs = BASE_SPEED;
    alive = true;
    placeFood();
    scoreEl.textContent = '0';
  }

  function placeFood(){
    let attempts = 0;
    while(attempts < 500){
      const fx = Math.floor(Math.random()*GRID);
      const fy = Math.floor(Math.random()*GRID);
      if(!snake.some(s => s.x===fx && s.y===fy)){
        food = {x:fx, y:fy};
        return;
      }
      attempts++;
    }
    food = {x:0, y:0};
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // food
    const fx = food.x*CELL, fy = food.y*CELL;
    const pulse = 1 + 0.08*Math.sin(Date.now()/180);
    ctx.save();
    ctx.translate(fx+CELL/2, fy+CELL/2);
    ctx.scale(pulse, pulse);
    const grad = ctx.createRadialGradient(0,0,1,0,0,CELL*0.55);
    grad.addColorStop(0, '#ffe08a');
    grad.addColorStop(1, '#ffb84a');
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(255,184,74,0.7)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0,0, CELL*0.34, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // snake
    for(let i=snake.length-1; i>=0; i--){
      const seg = snake[i];
      const x = seg.x*CELL, y = seg.y*CELL;
      const isHead = i===0;
      const t = i/Math.max(snake.length-1,1);

      ctx.save();
      const r = isHead ? CELL*0.32 : CELL*0.28 * (1 - t*0.15);

      if(isHead){
        ctx.shadowColor = 'rgba(183,255,74,0.65)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#d4ff8f';
      } else {
        const g = 200 - t*90;
        ctx.fillStyle = `rgb(${90+t*20}, ${g}, ${74 - t*30})`;
      }

      roundRect(ctx, x+2, y+2, CELL-4, CELL-4, r);
      ctx.fill();
      ctx.restore();

      if(isHead){
        drawEyes(ctx, x, y);
      }
    }
  }

  function drawEyes(ctx, x, y){
    const eyeR = CELL*0.07;
    let ex1, ey1, ex2, ey2;
    const c = CELL;
    if(dir.x===1){ ex1=x+c*0.65; ey1=y+c*0.32; ex2=x+c*0.65; ey2=y+c*0.68; }
    else if(dir.x===-1){ ex1=x+c*0.35; ey1=y+c*0.32; ex2=x+c*0.35; ey2=y+c*0.68; }
    else if(dir.y===1){ ex1=x+c*0.32; ey1=y+c*0.65; ex2=x+c*0.68; ey2=y+c*0.65; }
    else { ex1=x+c*0.32; ey1=y+c*0.35; ex2=x+c*0.68; ey2=y+c*0.35; }
    ctx.fillStyle = '#0b0f14';
    ctx.beginPath(); ctx.arc(ex1, ey1, eyeR, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ex2, ey2, eyeR, 0, Math.PI*2); ctx.fill();
  }

  function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }

  function step(){
    if(!alive) return;
    dir = nextDir;

    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if(head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || snake.some(s => s.x===head.x && s.y===head.y)){
      gameOver();
      return;
    }

    snake.unshift(head);

    if(head.x === food.x && head.y === food.y){
      score++;
      scoreEl.textContent = String(score);
      if(score > best){
        best = score;
        bestEl.textContent = String(best);
      }
      speedMs = Math.max(MIN_SPEED, BASE_SPEED - score*3);
      placeFood();
      restartLoop();
    } else {
      snake.pop();
    }

    draw();
  }

  function restartLoop(){
    clearInterval(loopTimer);
    loopTimer = setInterval(step, speedMs);
  }

  function gameOver(){
    alive = false;
    running = false;
    clearInterval(loopTimer);
    finalScoreEl.textContent = String(score);
    overOverlay.classList.add('show');
    draw();
  }

  function startGame(){
    initState();
    startOverlay.classList.remove('show');
    overOverlay.classList.remove('show');
    running = true;
    draw();
    restartLoop();
  }

  function setDir(nx, ny){
    // prevent reversing directly into itself
    if(snake.length > 1 && nx === -dir.x && ny === -dir.y) return;
    nextDir = {x:nx, y:ny};
  }

  const keyMap = {
    ArrowUp: [0,-1], KeyW: [0,-1],
    ArrowDown: [0,1], KeyS: [0,1],
    ArrowLeft: [-1,0], KeyA: [-1,0],
    ArrowRight: [1,0], KeyD: [1,0]
  };

  window.addEventListener('keydown', (e) => {
    if(keyMap[e.code]){
      e.preventDefault();
      if(!running){
        startGame();
      }
      const [nx, ny] = keyMap[e.code];
      setDir(nx, ny);
    } else if(e.code === 'Space'){
      e.preventDefault();
      if(!running && startOverlay.classList.contains('show')){
        startGame();
      } else if(!alive){
        startGame();
      }
    }
  });

  dpad.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-dir]');
    if(!btn) return;
    if(!running) startGame();
    const map = {up:[0,-1], down:[0,1], left:[-1,0], right:[1,0]};
    const [nx, ny] = map[btn.dataset.dir];
    setDir(nx, ny);
  });

  startBtn.addEventListener('click', startGame);
  retryBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  // swipe support
  let touchStart = null;
  canvas.addEventListener('touchstart', (e) => {
    touchStart = e.touches[0];
  }, {passive:true});
  canvas.addEventListener('touchend', (e) => {
    if(!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.clientX;
    const dy = t.clientY - touchStart.clientY;
    if(Math.abs(dx) > Math.abs(dy)){
      if(Math.abs(dx) > 24){
        if(!running) startGame();
        setDir(dx > 0 ? 1 : -1, 0);
      }
    } else {
      if(Math.abs(dy) > 24){
        if(!running) startGame();
        setDir(0, dy > 0 ? 1 : -1);
      }
    }
    touchStart = null;
  }, {passive:true});

  function resizeCanvas(){
    const rect = canvas.getBoundingClientRect();
    CELL = rect.width / GRID;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // idle render loop keeps the food "pulse" animating even between game ticks
  function idleRender(){
    if(running && alive) draw();
    requestAnimationFrame(idleRender);
  }
  requestAnimationFrame(idleRender);

  initState();
  draw();
})();
