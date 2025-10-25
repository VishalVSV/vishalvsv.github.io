let ctx = document.getElementById("map_can").getContext('2d');

noise.seed(Math.random());

let levels = [0.1, 0.2, 0.4, 0.5];
let time = 0;

window.setInterval(() => {
for (var x = 0; x < 256; x++) {
  for (var y = 0; y < 256; y++) {
    // All noise functions return values in the range of -1 to 1.

    // noise.simplex2 and noise.perlin2 for 2d noise
    let value = noise.simplex3(x / 100, y / 100, time);

    ctx.fillStyle = `black`;
    for (let level of levels) {
        if (Math.abs(value - level) < 0.02) {
            ctx.fillStyle = `white`;

            break;
        }
    }

    ctx.fillRect(x * 2, y * 2, 2, 2);
  }
}
time += 0.01;
}, 100)