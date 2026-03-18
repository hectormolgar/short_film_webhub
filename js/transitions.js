// Hacker Scramble & Transition System
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Scramble main headers
    const headers = document.querySelectorAll('h1, h2, .logo');
    headers.forEach(h => {
        const fx = new TextScramble(h);
        const originalText = h.innerText;
        h.addEventListener('mouseenter', () => fx.setText(originalText));
        // Initial scramble
        setTimeout(() => fx.setText(originalText), 500);
    });

    // Create and handle transition overlay
    if (!document.querySelector('.glitch-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'glitch-overlay';
        overlay.innerHTML = `
            <div class="skull-stamp">
      XXXXXXXXXXXXX
   XXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXX
 XXXXXXXXXXXXXXXXXXXXXXX
 XXXXXXXXXXXXXXXXXXXXXXX
  XX   XXXXX   XXXXX   XX
  XX   XXXXX   XXXXX   XX
  XX   XXXXX   XXXXX   XX
  XXXXXXXXXXXXXXXXXXXXX
   XXXXX   XXX   XXXXX
    XXXXXX     XXXXXX
     XXXXXXXXXXXXXXX
      XXXX XXXXX XXX
       XXX XXXXX XXX
            </div>
        `;
        document.body.appendChild(overlay);
    }

    // Handle link clicks with smooth glitch effect
    const links = document.querySelectorAll('nav a, .btn');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.endsWith('.html') && !href.startsWith('#')) {
                e.preventDefault();

                const skullChance = Math.random() < 0.20;
                const skull = document.querySelector('.skull-stamp');

                document.body.classList.add('glitch-active');
                if (skullChance && skull) {
                    skull.style.display = 'block';
                }

                setTimeout(() => {
                    window.location.href = href;
                }, 600); // 0.6s to match the CSS animation
            }
        });
    });

    // Reveal sections on scroll
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});
