(() => {
  const mast = document.getElementById("mast");
  const burger = document.getElementById("burger");
  const rail = document.getElementById("rail");
  const copyBtn = document.getElementById("copyCa");
  const caValue = document.getElementById("caValue");
  const canvas = document.getElementById("stipple");
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  const onScroll = () => {
    mast.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  burger.addEventListener("click", () => {
    const open = !rail.classList.contains("open");
    rail.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  rail.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      rail.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...rail.querySelectorAll("a")];
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((section) => spy.observe(section));

  document.querySelectorAll(".reveal").forEach((node) => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    io.observe(node);
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(caValue.textContent.trim());
      copyBtn.textContent = "Copied";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.classList.remove("copied");
      }, 1600);
    } catch {
      copyBtn.textContent = "Select";
    }
  });

  const magnets = document.querySelectorAll(".mag");
  magnets.forEach((el) => {
    el.addEventListener("mousemove", (event) => {
      const box = el.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });

  if (window.matchMedia("(pointer: fine)").matches) {
    document.body.classList.add("has-pointer");
    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;
    window.addEventListener(
      "mousemove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        cursorDot.style.transform = `translate(${targetX - 3}px, ${targetY - 3}px)`;
      },
      { passive: true }
    );
    const follow = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX - 14}px, ${ringY - 14}px)`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  const ctx = canvas.getContext("2d");
  const dots = [];
  const count = 90;
  let width = 0;
  let height = 0;
  let mouse = { x: 0, y: 0 };

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < count; i += 1) {
    dots.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    });
  }

  window.addEventListener(
    "mousemove",
    (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    },
    { passive: true }
  );

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    dots.forEach((dot) => {
      const dx = mouse.x - dot.x;
      const dy = mouse.y - dot.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 160) {
        dot.x -= dx / dist;
        dot.y -= dy / dist;
      }
      dot.x += dot.vx;
      dot.y += dot.vy;
      if (dot.x < 0) dot.x = width;
      if (dot.x > width) dot.x = 0;
      if (dot.y < 0) dot.y = height;
      if (dot.y > height) dot.y = 0;
      ctx.beginPath();
      ctx.fillStyle = "rgba(232, 200, 74, 0.42)";
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
})();
