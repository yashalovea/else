const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
const lines = document.querySelectorAll('hr');
const symbols = ['1', '0', '', ''];
const colStep = 20;
const fadeZone = 4;
const drops = [];
const letters = [];
let fontSize;
let cols;

function getTextColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--text').trim();
}

function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fontSize = window.innerHeight * 0.04;
    cols = Math.ceil(window.innerWidth / colStep);
    drops.length = 0;
    letters.length = 0;

    const upper = lines[0].getBoundingClientRect().bottom;
    const lower = lines[1].getBoundingClientRect().top;

    for (let l = 0; l < cols; l++) {
        drops.push(upper + Math.random() * (lower - upper));
        letters.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
}

function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const upper = lines[0].getBoundingClientRect().bottom;
    const lower = lines[1].getBoundingClientRect().top;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, upper, window.innerWidth, lower - upper);
    ctx.clip();

    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = getTextColor();

    for (let i = 0; i < cols; i++) {
        ctx.globalAlpha = Math.max(0, Math.min(1, (lower - drops[i]) / (fontSize * fadeZone)));
        ctx.fillText(letters[i], i * colStep, drops[i]);
        drops[i] += 5;

        if (drops[i] > lower) {
            drops[i] = upper;
            letters[i] = symbols[Math.floor(Math.random() * symbols.length)];
        }
    }

    ctx.globalAlpha = 1;
    ctx.restore();
    requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
draw();

const btn = document.getElementById('theme-btn');
const root = document.documentElement;
const colors = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'];
let index = 0;

if (btn) {
    btn.addEventListener('click', () => {
        index = (index + 1) % colors.length;
        root.style.setProperty('--text', colors[index]);
    });
}
