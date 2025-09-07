let gol_canvas = document.getElementById("vertex_gol");
let run = true;
gol_canvas.onclick = function (e) {
  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  x = Math.floor((x / rect.width) * 34) - 1;
  y = Math.floor((y / rect.height) * 34) - 1;
  if (x < 32 && y < 32) {
    grid_raw[y][x] = grid_raw[y][x] == 0 ? 1 : 0;
  }
  if (y == 32) {
    let status = run ? " Stop " : " Start ";
    padding = 16 - status.length / 2;
    padding -= status.length % 2;

    let delX = 1 + padding;

    if (x > delX && x < delX + status.length) {
      run = !run;
    }
  }

  draw();
};
gol_canvas.oncontextmenu = function (e) {
  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  x = Math.floor((x / rect.width) * 34) - 1;
  y = Math.floor((y / rect.height) * 34) - 1;

  if (x < 32 && y < 32) {
    spawn_lwss(x, y);
  }

  draw();
  return false;
};
let grid_raw = [];
for (let j = 0; j < 32; j++) {
  let row = [];
  for (let i = 0; i < 32; i++) {
    row.push(0);
  }
  grid_raw.push(row);
}

function spawn_lwss(x, y) {
  x = x % 32 < 0 ? 32 + (x % 32) : x % 32;
  y = y % 32 < 0 ? 32 + (y % 32) : y % 32;

  grid_raw[y][x] = 1;
  grid_raw[y + 1][x + 1] = 1;
  grid_raw[y + 1][x + 2] = 1;
  grid_raw[y][x + 2] = 1;
  grid_raw[y - 1][x + 2] = 1;
}

function randomize() {
  for (let j = 0; j < 32; j++) {
    for (let i = 0; i < 32; i++) {
      grid_raw[j][i] = Math.random() < 0.5 ? 0 : 1;
    }
  }
}

let lookup = [[], []];

lookup[0][0] = ".";
lookup[1][0] = "▀";
lookup[0][1] = "▄";
lookup[1][1] = "█";

function draw() {
  let res = "╔";

  let title = " The Game of Life ";

  let padding = 16 - title.length / 2;

  for (let i = 0; i < padding; i++) {
    res += "═";
  }
  res += title;
  for (let i = 0; i < padding; i++) {
    res += "═";
  }

  res += "╗\n";
  for (let j = 0; j < 32; j += 2) {
    res += "║";
    for (let i = 0; i < 32; i++) {
      res += lookup[grid_raw[j][i]][grid_raw[j + 1][i]];
    }
    res += "║\n";
  }

  let status = run ? " Stop " : " Start ";
  padding = 16 - status.length / 2;
  padding -= status.length % 2;
  res += "╚";
  for (let i = 0; i < padding; i++) {
    res += "═";
  }
  res += status;
  for (let i = 0; i < padding + (status.length % 2); i++) {
    res += "═";
  }
  res += "╝";
  gol_canvas.textContent = res;
}

function tick() {
  let updated = false;
  let grid_copy = grid_raw.map((a) => {
    return { ...a };
  });

  for (let j = 0; j < 32; j++) {
    for (let i = 0; i < 32; i++) {
      let alive = 0;

      let e1 = (t_) => (t_ % 32 < 0 ? 32 + (t_ % 32) : t_ % 32);
      let e2 = (t_) => (t_ % 32 < 0 ? 32 + (t_ % 32) : t_ % 32);

      alive += grid_raw[e1(j - 1)][e2(i - 1)];
      alive += grid_raw[e1(j - 1)][e2(i)];
      alive += grid_raw[e1(j - 1)][e2(i + 1)];

      alive += grid_raw[e1(j)][e2(i - 1)];
      alive += grid_raw[e1(j)][e2(i)];
      alive += grid_raw[e1(j)][e2(i + 1)];

      alive += grid_raw[e1(j + 1)][e2(i - 1)];
      alive += grid_raw[e1(j + 1)][e2(i)];
      alive += grid_raw[e1(j + 1)][e2(i + 1)];

      let prev = grid_copy[j][i];
      if (alive == 3) {
        grid_copy[j][i] = 1;
      } else if (alive != 4) {
        grid_copy[j][i] = 0;
      }

      if (grid_copy[j][i] != prev) {
        updated = true;
      }
    }
  }

  grid_raw = grid_copy;
  return updated;
}
draw();

window.addEventListener("load", () => {
  randomize();

  let loop = window.setInterval(() => {
    if (run) {
      tick();
      draw();
    }
  }, 60);
});
