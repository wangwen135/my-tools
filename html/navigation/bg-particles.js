// ======== 背景（科幻风）: Canvas 粒子 + 漂浮连线 + 颜色渐变 ========
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;

window.addEventListener('resize', () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; initParticles(); });

const PR = window.devicePixelRatio || 1;

let particles = [];

// 生成指定范围内的随机数
function getRandom(min, max) { 
    return Math.random() * (max - min) + min; 
}

// 初始化粒子系统
function initParticles() {
    particles = [];
    // 根据屏幕尺寸动态计算粒子数量，确保性能与视觉效果平衡
    const particleCount = Math.max(30, Math.floor((W * H) / 80000));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: getRandom(-0.2, 0.2),
            vy: getRandom(-0.2, 0.2),
            r: getRandom(0.5, 1.8),
            alpha: getRandom(0.15, 0.8)
        });
    }
}
initParticles();

let tStart = performance.now();
function draw() {
    const now = performance.now();
    const dt = (now - tStart) * 0.001; tStart = now;

    // 背景渐变
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#021025');
    g.addColorStop(0.5, '#021226');
    g.addColorStop(1, '#00030a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // 动态星云（轻微模糊的圆形）
    for (let i = 0; i < 12; i++) {
        const cx = W * ((i * 0.17) % 1 + 0.02);
        const cy = H * ((i * 0.29) % 1 + 0.01);
        const rad = Math.min(W, H) * (0.14 + 0.02 * Math.sin(now * 0.0007 + i));
        const grad = ctx.createRadialGradient(cx, cy, rad * 0.1, cx, cy, rad);
        grad.addColorStop(0, `rgba(102,217,255,${0.02 + 0.02 * Math.sin(now * 0.0008 + i)})`);
        grad.addColorStop(1, 'rgba(2,6,14,0)');
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();
    }

    // 粒子
    for (let p of particles) {
        p.x += p.vx * (0.6 + Math.sin(now * 0.0002));
        p.y += p.vy * (0.6 + Math.cos(now * 0.0001));
        // wrap
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;

        ctx.beginPath(); ctx.globalAlpha = p.alpha * 0.9; ctx.fillStyle = 'white'; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 优化连线算法，减少计算量
    const maxDist = Math.min(W, H) * 0.12;
    const maxDistSquared = maxDist * maxDist; // 预计算平方值，避免重复开方
    
    // 仅为距离较近的粒子绘制连线，减少绘制调用
    ctx.strokeStyle = 'rgba(102,217,255,0.12)';
    ctx.lineWidth = 0.8;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dSquared = dx * dx + dy * dy;
            
            if (dSquared < maxDistSquared) {
                const alpha = 0.12 * (1 - Math.sqrt(dSquared) / maxDist);
                ctx.globalAlpha = alpha;
                ctx.beginPath(); // 为每条线创建新路径，避免透明度问题
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }
    ctx.globalAlpha = 1;

    // 轻微移动的光斑遮罩
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
        const cx = (W * 0.2) * (i + 1) + 60 * Math.sin(now * 0.0004 * (i + 3));
        const cy = H * (0.2 + 0.25 * i) + 40 * Math.cos(now * 0.0005 * (i + 2));
        const rad = Math.min(W, H) * (0.25 - i * 0.05 + 0.02 * Math.sin(now * 0.0006 * (i + 1)));
        const grad = ctx.createRadialGradient(cx, cy, rad * 0.1, cx, cy, rad);
        grad.addColorStop(0, 'rgba(102,217,255,0.02)');
        grad.addColorStop(1, 'rgba(102,217,255,0)');
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

// 鼠标交互：添加轻微排斥，避免粒子聚成一团
let mouse = { x: -9999, y: -9999 };
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseout', () => { mouse.x = -9999; mouse.y = -9999; });

// 优化交互函数，添加节流机制
let lastInteractTime = 0;
const INTERACT_INTERVAL = 16; // ~60fps

// 调整后的交互：使用轻微排斥而不是吸引
function interact() {
    const now = performance.now();
    if (now - lastInteractTime < INTERACT_INTERVAL) {
        requestAnimationFrame(interact);
        return;
    }
    lastInteractTime = now;
    
    const mouseThresholdSquared = 160 * 160;
    
    for (let p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSquared = dx * dx + dy * dy;

        if (distSquared < mouseThresholdSquared && distSquared > 0) {
            // 轻微排斥力，防止粒子全部挤到鼠标附近
            const dist = Math.sqrt(distSquared);
            const force = -0.0012 * (1 - dist / 160);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
        }

        // 限制速度，避免发散
        p.vx = Math.max(-0.3, Math.min(0.3, p.vx));
        p.vy = Math.max(-0.3, Math.min(0.3, p.vy));
    }

    requestAnimationFrame(interact);
}

// 启动交互函数
interact();
