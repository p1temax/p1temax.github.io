(function () {
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0f172a" : "#f4efe4");
  }

  function followSystem() {
    applyTheme(media.matches ? "dark" : "light");
  }

  if (media.addEventListener) media.addEventListener("change", followSystem);
  else if (media.addListener) media.addListener(followSystem);
  followSystem();

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".menu-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero && window.TERMINAL && TERMINAL.heroLines) {
    var lines = TERMINAL.heroLines;
    var out = hero.querySelector(".hero-lines");
    var cursorRow = hero.querySelector(".hero-cursor");
    var line = 0;
    var index = 0;
    var built = [];
    var cursorOn = true;
    setInterval(function () {
      cursorOn = !cursorOn;
      if (cursorRow) cursorRow.style.opacity = cursorOn ? "1" : "0";
    }, 500);
    function paint() {
      out.innerHTML = "";
      built.forEach(function (text) {
        var row = document.createElement("div");
        row.className = "terminal-line";
        var chev = document.createElement("span");
        chev.className = "chev";
        chev.textContent = ">";
        var body = document.createElement("span");
        body.textContent = text;
        row.appendChild(chev);
        row.appendChild(body);
        out.appendChild(row);
      });
    }
    function tick() {
      if (line >= lines.length) {
        if (cursorRow) cursorRow.hidden = false;
        return;
      }
      index += 1;
      built[line] = lines[line].slice(0, index);
      paint();
      if (index >= lines[line].length) {
        line += 1;
        index = 0;
        setTimeout(tick, 400);
      } else {
        setTimeout(tick, 24);
      }
    }
    tick();
  }

  document.querySelectorAll(".blog-content .highlight").forEach(function (block) {
    if (block.querySelector(".copy-button")) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Copy";
    button.addEventListener("click", function () {
      var code = block.querySelector("code");
      var text = code ? code.textContent : "";
      navigator.clipboard.writeText(text).then(function () {
        button.textContent = "Copied";
        setTimeout(function () { button.textContent = "Copy"; }, 1500);
      });
    });
    block.appendChild(button);
  });

  var bar = document.querySelector(".progress");
  var article = document.querySelector(".blog-content");
  if (bar && article) {
    var onScroll = function () {
      var start = article.offsetTop - window.innerHeight * 0.3;
      var end = start + article.offsetHeight - window.innerHeight * 0.4;
      var range = Math.max(1, end - start);
      var pct = Math.max(0, Math.min(100, ((window.scrollY - start) / range) * 100));
      bar.style.width = pct + "%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var copyLink = document.querySelector("[data-copy-link]");
  if (copyLink) {
    copyLink.addEventListener("click", function () {
      navigator.clipboard.writeText(copyLink.getAttribute("data-copy-link")).then(function () {
        copyLink.textContent = "Copied";
        setTimeout(function () { copyLink.textContent = "Copy link"; }, 1500);
      });
    });
  }

  var modal = document.querySelector(".search-modal");
  var input = document.querySelector(".search-input");
  var results = document.querySelector(".search-results");
  var posts = null;

  function openSearch() {
    if (!modal) return;
    modal.hidden = false;
    input.value = "";
    input.focus();
    if (!posts) {
      fetch(TERMINAL.searchURL)
        .then(function (r) { return r.json(); })
        .then(function (data) { posts = data; render(); })
        .catch(function () { posts = []; render(); });
    } else {
      render();
    }
  }

  function closeSearch() {
    if (modal) modal.hidden = true;
  }

  function render() {
    if (!results) return;
    var q = (input.value || "").trim().toLowerCase();
    var list = (posts || []).filter(function (post) {
      if (!q) return true;
      return (post.title + " " + post.excerpt + " " + (post.tags || []).join(" ")).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);
    results.innerHTML = "";
    if (!list.length) {
      var empty = document.createElement("li");
      empty.className = "empty-note";
      empty.textContent = "No matching posts.";
      results.appendChild(empty);
      return;
    }
    list.forEach(function (post) {
      var li = document.createElement("li");
      var button = document.createElement("button");
      button.type = "button";
      button.innerHTML = "<div>" + escapeHtml(post.title) + "</div><small>" + escapeHtml(post.date || "") + "</small>";
      button.addEventListener("click", function () { window.location.href = post.url; });
      li.appendChild(button);
      results.appendChild(li);
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  document.querySelectorAll(".search-open").forEach(function (button) {
    button.addEventListener("click", openSearch);
  });
  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeSearch();
    });
  }
  if (input) input.addEventListener("input", render);
  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
    }
    if (event.key === "Escape") closeSearch();
  });
})();
