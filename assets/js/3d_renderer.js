class Renderer2 {
    draw_point(x, y, color) {
        throw new Error("Unimplemented draw_point!");
    }

    draw_line(x1, y1, x2, y2, color) {
        let dx = Math.abs(x2 - x1);
        let sx = x1 < x2 ? 1 : -1;

        let dy = -Math.abs(y2 - y1);
        let sy = y1 < y2 ? 1 : -1;

        let error = dx + dy;

        while(true) {
            this.draw_point(x1, y1);

            if (x1 == x2 && y1 == y2) break;
            let e2 = 2 * error;

            if (e2 >= dy) {
                if (x1 == x2) break;
                error += dy;
                x1 += sx
            }
            if (e2 <= dx) {
                if (y1 == y2) break;
                error += dx;
                y1 += sy;
            }
        }
    }
}


class TextRenderer extends Renderer2 {
    constructor(canvas_id, width, height, _type) {
        super();
        // _type will eventually allow other render styles like block and ascii instead of braille rendering
        this.type = "braille";
        this.canvas = document.getElementById(canvas_id);

        this.canvas.style.lineHeight = "1.17em";

        this.width = width;
        this.height = height;

        this.grid_raw = [];

        for (let j = 0; j < this.height; j++) {
            let row = [];
            for (let i = 0; i < this.width; i++) {
                row.push(0);
            }
            this.grid_raw.push(row);
        }
    }

    flush() {
        let frame = "";

        for (let j = 0; j < Math.ceil(this.height / 4); j++) {
            for (let i = 0; i < Math.ceil(this.width / 2); i++) {
                if (this.type == "braille") {
                    let val = 0;
                    val = val | (this.grid_raw[j * 4][i * 2] != 0 ? 1 : 0);
                    val = val | (this.grid_raw[j * 4 + 1][i * 2] != 0 ? 1 : 0) << 1;
                    val = val | (this.grid_raw[j * 4 + 2][i * 2] != 0 ? 1 : 0) << 2;
                    val = val | (this.grid_raw[j * 4][i * 2 + 1] != 0 ? 1 : 0) << 3;
                    val = val | (this.grid_raw[j * 4 + 1][i * 2 + 1] != 0 ? 1 : 0) << 4;
                    val = val | (this.grid_raw[j * 4 + 2][i * 2 + 1] != 0 ? 1 : 0) << 5;
                    
                    val = val | (this.grid_raw[j * 4 + 3][i * 2] != 0 ? 1 : 0) << 6;
                    val = val | (this.grid_raw[j * 4 + 3][i * 2 + 1] != 0 ? 1 : 0) << 7;

                    val += 10240;

                    frame += String.fromCharCode(val);
                }
            }
            frame += "\n"
        }

        this.canvas.innerText = frame
    }

    draw_point(x, y, color) {
        let color_ = color || 1;
        this.grid_raw[y][x] = color_;
    }
}