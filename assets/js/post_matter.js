/*
    cyrb53 (c) 2018 bryc (github.com/bryc)
    License: Public domain (or MIT if needed). Attribution appreciated.
    A fast and simple 53-bit string hash function with decent collision resistance.
    Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
*/
const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
  

function spoiler_color_update() {
    const hex2rgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        // return {r, g, b} 
        return { r, g, b };
    }
    let c = hex2rgb(getComputedStyle(document.documentElement).getPropertyValue('--global-text-color'));
    console.log(c);
    let color = new Color(c.r, c.g, c.b);
    let solver = new Solver(color);
    let res = solver.solve();
    console.log(res.filter);
    
    for (let elem of document.querySelectorAll(".spoiler_icon")) {
        elem.style.filter = res.filter.substring(8, res.filter.length - 1);
    }
}

for (let spoiler of document.querySelectorAll(".spoiler")) {
    let associated_icon = spoiler.children[1];

    associated_icon.style.transition = "1s linear opacity";

    let id = cyrb53(spoiler.children[0].innerText);

    if (localStorage.getItem("spoiler-tag-"+id.toString()) == null) {
        spoiler.children[0].addEventListener("click", (e) => {
            if (e.currentTarget.className == "spoiler_active") {
                e.currentTarget.className = "spoiler_inactive";
                associated_icon.style.opacity = 0;
                localStorage.setItem("spoiler-tag-"+id.toString(), "open");
            }
        });
    } else {
        spoiler.children[0].className = "spoiler_inactive";
        associated_icon.style.opacity = 0;
    }
}

spoiler_color_update();