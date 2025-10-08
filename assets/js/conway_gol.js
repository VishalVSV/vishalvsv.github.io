class GameBoard {
  constructor(elem_id) {
    this.canvas = document.getElementById(elem_id);
    this.games = [new GameOfLife(), new MazeGen()];
    this.active_game = 0;
    this.fps = 20;
  }

  empty_frame() {
    let res = "╔";

    let title = " Error?!  ";

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
        res += " ";
      }
      res += "║\n";
    }

    res += "╚";
    for (let i = 0; i < 32; i++) {
      res += "═";
    }
    res += "╝";

    return res;
  }

  start() {
    this.canvas.addEventListener("click", (e) => {
      let rect = e.target.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      x = Math.floor((x / rect.width) * 34) - 1;
      y = Math.floor((y / rect.height) * 34) - 1;

      if (this.games[this.active_game]) this.games[this.active_game].onclick(x, y, "left");
    });

    this.canvas.addEventListener("contextmenu", (e) => {
      let rect = e.target.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      x = Math.floor((x / rect.width) * 34) - 1;
      y = Math.floor((y / rect.height) * 34) - 1;

      if (this.games[this.active_game]) this.games[this.active_game].onclick(x, y, "right");
    })

    document.body.addEventListener("keydown", (e) => {
      if (this.games[this.active_game]) this.games[this.active_game].onkeydown(e);
    });

    let b = this;
    let main_loop = function () {
      if (b.games[b.active_game]) {
        b.games[b.active_game].onupdate();
        b.canvas.innerText = b.games[b.active_game].draw();
      } else {
        b.canvas.innerText = b.empty_frame();
      }
      window.setTimeout(main_loop, 1000 / b.fps);
    }
    window.setTimeout(main_loop, 1000 / this.fps);
  }
}

class Game {
  constructor() {
    this.run = true;
  }

  onclick(x, y, btn) {

  }


  onkeydown(e) {
    
  }

  onupdate(delta_time) {

  }

  draw() {

  }
}

class GameOfLife extends Game {
  constructor() {
    super();
    this.grid_raw = [];
    for (let j = 0; j < 32; j++) {
      let row = [];
      for (let i = 0; i < 32; i++) {
        row.push(0);
      }
      this.grid_raw.push(row);
    }
    this.run = true;
    this.won = false;

    this.lookup = [[], []];

    this.lookup[0][0] = ".";
    this.lookup[1][0] = "▀";
    this.lookup[0][1] = "▄";
    this.lookup[1][1] = "█";

    this.randomize();
  }

  onclick(x, y, btn) {
    if (btn == "left") {
      if (x < 32 && y < 32) {
        this.grid_raw[y][x] = this.grid_raw[y][x] == 0 ? 1 : 0;
      }
      if (y == 32) {
        let status = this.run ? " Stop " : " Start ";
        let padding = 16 - status.length / 2;
        padding -= status.length % 2;

        let delX = 1 + padding;

        if (x > delX && x < delX + status.length) {
          this.run = !this.run;
        }
      }
    } else if (btn == "right") {
      if (x < 32 && y < 32) {
        this.spawn_lwss(x, y);
      }
    }
  }

  randomize() {
    for (let j = 0; j < 32; j++) {
      for (let i = 0; i < 32; i++) {
        this.grid_raw[j][i] = Math.random() < 0.5 ? 0 : 1;
      }
    }
  }

  spawn_lwss(x, y) {
    x = x % 32 < 0 ? 32 + (x % 32) : x % 32;
    y = y % 32 < 0 ? 32 + (y % 32) : y % 32;

    this.grid_raw[y][x] = 1;
    this.grid_raw[y + 1][x + 1] = 1;
    this.grid_raw[y + 1][x + 2] = 1;
    this.grid_raw[y][x + 2] = 1;
    this.grid_raw[y - 1][x + 2] = 1;
  }

  onupdate(delta_time) {
    if (!this.run) return;

    let updated = false;
    let grid_copy = this.grid_raw.map((a) => {
      return { ...a };
    });

    let total_alive = 0;

    for (let j = 0; j < 32; j++) {
      for (let i = 0; i < 32; i++) {
        let alive = 0;

        let e1 = (t_) => (t_ % 32 < 0 ? 32 + (t_ % 32) : t_ % 32);
        let e2 = (t_) => (t_ % 32 < 0 ? 32 + (t_ % 32) : t_ % 32);

        alive += this.grid_raw[e1(j - 1)][e2(i - 1)];
        alive += this.grid_raw[e1(j - 1)][e2(i)];
        alive += this.grid_raw[e1(j - 1)][e2(i + 1)];

        alive += this.grid_raw[e1(j)][e2(i - 1)];
        alive += this.grid_raw[e1(j)][e2(i)];
        alive += this.grid_raw[e1(j)][e2(i + 1)];

        alive += this.grid_raw[e1(j + 1)][e2(i - 1)];
        alive += this.grid_raw[e1(j + 1)][e2(i)];
        alive += this.grid_raw[e1(j + 1)][e2(i + 1)];

        let prev = grid_copy[j][i];
        if (alive == 3) {
          grid_copy[j][i] = 1;
        } else if (alive != 4) {
          grid_copy[j][i] = 0;
        }

        total_alive += alive;

        if (grid_copy[j][i] != prev) {
          updated = true;
        }
      }
    }

    if (total_alive == 0) {
      updated = true;
      window.setTimeout(() => {
        board.active_game = 1;
      }, 20000)
      this.won = true;
    } else {
      this.won = false;
    }

    this.grid_raw = grid_copy;
    return updated;
  }

  draw() {
    let res = "╔";

    let title = this.won ? " Congratulations! " : " The Game of Life ";

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

        if (!this.won) res += this.lookup[this.grid_raw[j][i]][this.grid_raw[j + 1][i]];
        else {
          if ((j / 2) % 2 == 1 && j < 30) {
            res += "You win!  "[(i + (this.run ? run_time : 0) + 10 + (j / 2)) % 10];
          } else {
            res += " ";
          }
        }
      }
      res += "║\n";
    }

    let status = this.run ? " Stop " : " Start ";
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

    return res;
  }
}

class MazeGen extends Game {
  constructor() {
    super();
    this.maze = [];
    for (let y = 0; y < 8; y++) {
      let row = [];
      for (let x = 0; x < 16; x++) {
        row.push({
          north: true,
          south: true,
          east: true,
          west: true,
          visited: false
        });
      }
      this.maze.push(row);
    }

    this.generate = true;
    let initial = {x: 3, y: 3};
    this.maze[initial.y][initial.x].visited = true;
    this.stack = [initial];
    this.ticker = 0;
    this.player_x = 0;
    this.player_y = 0;
    this.path = [];
    this.delta = -1;

    this.won = false;
    this.win_time = 0;
  }

  onkeydown(e) {
    if (!this.generate && !this.won) {
      if (e.key == "w") {
        if (this.player_y > 0) {
          if (!this.maze[this.player_y][this.player_x].north) {
            this.path.push({x: this.player_x, y: this.player_y});
            this.player_y -= 1;
          }
        }
      } else if (e.key == "s") {
        if (this.player_y + 1 < 8) {
          if (!this.maze[this.player_y][this.player_x].south) {
            this.path.push({x: this.player_x, y: this.player_y});
            this.player_y += 1;
          }
        }
      } else if (e.key == "d") {
        if (this.player_x + 1 < 16) {
          if (!this.maze[this.player_y][this.player_x].east) {
            this.path.push({x: this.player_x, y: this.player_y});
            this.player_x += 1;
          }
        } else if (this.player_y == 7) {
          this.won = true;
          this.win_time = run_time;
        }
      } else if (e.key == "a") {
        if (this.player_x > 0) {
          if (!this.maze[this.player_y][this.player_x].west) {
            this.path.push({x: this.player_x, y: this.player_y});
            this.player_x -= 1;
          }
        }
      }
    }
  }

  onupdate() {
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

      
    if (this.generate) {
      if (this.stack.length > 0) {
        let current_cell = this.stack.pop();
       
        let neighbhors = [];
        if (current_cell.x + 1 < 16) neighbhors.push({x: current_cell.x + 1, y: current_cell.y, dir: "east"});
        if (current_cell.x - 1 >= 0) neighbhors.push({x: current_cell.x - 1, y: current_cell.y, dir: "west"});
        if (current_cell.y + 1 < 8) neighbhors.push({x: current_cell.x, y: current_cell.y + 1, dir: "south"});
        if (current_cell.y - 1 >= 0) neighbhors.push({x: current_cell.x, y: current_cell.y - 1, dir: "north"});
        shuffleArray(neighbhors);
        
        neighbhors = neighbhors.filter((cell) => !this.maze[cell.y][cell.x].visited);

        if (neighbhors.length > 0) {
          this.stack.push(current_cell);
          this.stack.push(neighbhors[0]);
          if (neighbhors[0].dir == "east") {
            this.maze[current_cell.y][current_cell.x].east = false;
            this.maze[current_cell.y][current_cell.x + 1].west = false;
          } else if (neighbhors[0].dir == "west") {
            this.maze[current_cell.y][current_cell.x].west = false;
            this.maze[current_cell.y][current_cell.x - 1].east = false;
          } else if (neighbhors[0].dir == "north") {
            this.maze[current_cell.y][current_cell.x].north = false;
            this.maze[current_cell.y - 1][current_cell.x].south = false;
          } else if (neighbhors[0].dir == "south") {
            this.maze[current_cell.y][current_cell.x].south = false;
            this.maze[current_cell.y + 1][current_cell.x].north = false;
          }
          this.maze[neighbhors[0].y][neighbhors[0].x].visited = true;
        } else {
          // console.log("backtracking!", this.stack)
        }
      } else {
        this.maze[7][15].east = false;
        this.ticker = 0;
        this.generate = false;
      }
    }

    if (this.won) {
      let cell = this.path[this.path.length - 1 - ((this.ticker) % this.path.length)];
      this.player_x = cell.x;
      this.player_y = cell.y;

      this.ticker += 1;
      this.maze[this.player_y][this.player_x].char = "!niw uoYYou Win!"[this.ticker % 8]; 
    }
  }

  draw() {
    let res = "";

    let title = this.generate ? " Maze Generating  " : (this.won ? "You Win!" : "Maze Generator");

    let padding = 16 - title.length / 2;

    for (let i = 0; i < padding; i++) {
      res += " ";
    }
    res += title;
    for (let i = 0; i < padding; i++) {
      res += " ";
    }



    res += "\n┌";

    let empty = {
      north: false,
      south: false,
      east: false,
      west: false
    };

    for (let x = 0; x < 16; x++) {
      if (x == 15) {
        res += "─┐"
        continue;
      }

      if (this.maze[0][x].east)
        res += "─┬";
      else
        res += "──";
    }
    res += "\n"

    let lookup = [];
    lookup[0b0001] = "╴"
    lookup[0b0010] = "╷"
    lookup[0b0100] = "╶"
    lookup[0b1000] = "╵"

    lookup[0b0011] = "┐"
    lookup[0b0110] = "┌"
    lookup[0b1100] = "└"
    lookup[0b1001] = "┘"
    lookup[0b1010] = "│"
    lookup[0b0101] = "─"
    
    lookup[0b0111] = "┬"
    lookup[0b1011] = "┤"
    lookup[0b1101] = "┴"
    lookup[0b1110] = "├"
    
    lookup[0b1111] = "┼"
    lookup[0b0000] = " "

    for (let y = 0; y < 8; y++) {
      let row_1 = "";
      let row_2 = "";
      for (let x = 0; x < 16; x++) {
        if (this.generate) {
          if (this.stack.length > 0 && y == this.stack[this.stack.length - 1].y && x == this.stack[this.stack.length - 1].x) 
            row_1 += (this.ticker % 2 == 0) ? "/" : "\\";
          else row_1 += " "
        } else {
          if (this.won && this.maze[y][x].char) {
            row_1 += this.maze[y][x].char;
          } else {
            if (this.player_x == x && this.player_y == y) row_1 += "P";
            else row_1 += " ";
          }
        }
        if (this.maze[y][x].east) {
          row_1 += "│";
        } else {
          row_1 += " ";
        }
        
        let idx = (this.maze[y][x].east ? 1 : 0) << 3
                | ((this.maze[y][x + 1] || empty).south ? 1 : 0) << 2
                | (y + 1 < 8 ? (this.maze[y + 1][x].east ? 1 : 0) : 0) << 1
                | (this.maze[y][x].south ? 1 : 0);

        row_2 += (this.maze[y][x].south ? "─" : " ") + lookup[idx];
      }
      let r2_char = lookup[1 << 3 | ((this.maze[y][0].south ? 1 : 0) << 2) | (y != 7 ? 1 : 0) << 1 | 0];

      res += (this.maze[y][0].west ? "|" : " ") + row_1 + "\n" + r2_char + row_2 + "\n";
    }
    if (this.generate) this.ticker += 1;
    return res;
  }

  onclick(x, y, btn) {
    if(!this.generate && !this.won) {
      
      if (y < this.player_y) {
        if (this.player_y > 0) {
          if (!this.maze[this.player_y][this.player_x].north) {
            this.path.push({x: this.player_x, y: this.player_y});
            this.player_y -= 1;
          }
        }
      } else if (y > this.player_y) {
        if (this.player_y + 1 < 8) {
          if (!this.maze[this.player_y][this.player_x].south) {
            this.path.push({x: this.player_x, y: this.player_y});
            this.player_y += 1;
          }
        }
      }
      
      if (x > this.player_x) {
        if (this.player_x + 1 < 16) {
          if (!this.maze[this.player_y][this.player_x].east) {
            this.path.push({x: this.player_x, y: this.player_y});
            this.player_x += 1;
          }
        } else if (this.player_y == 7) {
          this.won = true;
          this.win_time = run_time;
        }
      } else if (x < this.player_x) {
        if (this.player_x > 0) {
          if (!this.maze[this.player_y][this.player_x].west) {
            this.path.push({x: this.player_x, y: this.player_y});
            this.player_x -= 1;
          }
        }
      }
    }
  }
}

let run_time = 0;
let board = new GameBoard("vertex_gol");
board.fps = 20;
board.start();

window.setInterval(() => { run_time += 1; }, 1000);