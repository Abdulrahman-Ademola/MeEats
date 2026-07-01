/* ============================================================
   Mo'eats — Shared JS (loaded on every page)
   ============================================================ */
(function() {
  'use strict';

  // ---- sticky nav state ----
  var hdr = document.querySelector('header.site-nav');
  if (hdr) {
    var onScroll = function() {
      hdr.classList.toggle('scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
  }

  // ---- mobile menu ----
  var toggle = document.getElementById('menuToggle');
  var links = document.getElementById('navlinks');
  var scrim = document.getElementById('scrim');

  function closeMenu() {
    if (links) links.classList.remove('open');
    if (scrim) scrim.classList.remove('show');
    // close any open megas
    document.querySelectorAll('.has-mega.open').forEach(function(m) {
      m.classList.remove('open');
    });
  }
  if (toggle && links) {
    toggle.addEventListener('click', function() {
      links.classList.toggle('open');
      if (scrim) scrim.classList.toggle('show');
    });
  }
  if (scrim) scrim.addEventListener('click', closeMenu);
  // only close full drawer when a real link (not a mega trigger) is clicked
  if (links) links.querySelectorAll('a.navlink:not(.trigger), .nav-cta a, .mega a').forEach(function(a) {
    a.addEventListener('click', closeMenu);
  });

  // ---- MEGA MENU (hover on desktop w/ delay, tap-accordion on mobile) ----
  var isTouch = window.matchMedia('(max-width:960px)');
  var megas = document.querySelectorAll('.has-mega');
  var openTimer, closeTimer;

  megas.forEach(function(group) {
    var trigger = group.querySelector('.trigger');

    // desktop hover
    group.addEventListener('mouseenter', function() {
      if (isTouch.matches) return;
      clearTimeout(closeTimer);
      openTimer = setTimeout(function() {
        megas.forEach(function(g) {
          if (g !== group) g.classList.remove('open');
        });
        group.classList.add('open');
      }, 260); // Nielsen-recommended delay to avoid flicker
    });
    group.addEventListener('mouseleave', function() {
      if (isTouch.matches) return;
      clearTimeout(openTimer);
      closeTimer = setTimeout(function() {
        group.classList.remove('open');
      }, 280);
    });

    // click / tap toggles (works desktop + mobile)
    if (trigger) {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        var wasOpen = group.classList.contains('open');
        megas.forEach(function(g) {
          g.classList.remove('open');
        });
        if (!wasOpen) group.classList.add('open');
      });
      // keyboard: Enter/Space toggles, Escape closes
      trigger.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          group.classList.remove('open');
          trigger.blur();
        }
      });
    }
  });

  // click outside closes (desktop)
  document.addEventListener('click', function(e) {
    if (isTouch.matches) return;
    if (!e.target.closest('.has-mega')) {
      megas.forEach(function(g) {
        g.classList.remove('open');
      });
    }
  });
  // Escape closes all
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') megas.forEach(function(g) {
      g.classList.remove('open');
    });
  });

  // ---- reveal on scroll ----
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px'
    });
    revealEls.forEach(function(el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function(el) {
      el.classList.add('in');
    });
  }

  // ---- count-up stats ----
  var countEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && countEls.length) {
    var cio = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        var el = e.target,
          target = +el.dataset.count,
          suffix = el.dataset.suffix || '';
        var start = performance.now(),
          dur = 1400;

        function tick(now) {
          var p = Math.min((now - start) / dur, 1),
            eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, {
      threshold: 0.5
    });
    countEls.forEach(function(el) {
      cio.observe(el);
    });
  }

  // ---- seamless marquee duplication ----
  var mq = document.getElementById('marquee');
  if (mq) mq.innerHTML += mq.innerHTML;

  // ---- simple form feedback (demo, no backend) ----
  document.querySelectorAll('form[data-demo]').forEach(function(form) {
    form.addEventListener('submit', function(ev) {
      ev.preventDefault();
      var note = form.querySelector('.form-note');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Submitted ✓';
        btn.disabled = true;
        btn.style.opacity = '0.85';
      }
      if (note) {
        note.textContent = "Thanks — we'll be in touch shortly.";
        note.style.opacity = '1';
      }
    });
  });

  // ---- FAQ / accordion ----
  document.querySelectorAll('[data-accordion] .acc-item').forEach(function(item) {
    var head = item.querySelector('.acc-head');
    if (!head) return;
    head.addEventListener('click', function() {
      var open = item.classList.contains('open');
      item.parentElement.querySelectorAll('.acc-item').forEach(function(i) {
        i.classList.remove('open');
      });
      if (!open) item.classList.add('open');
    });
  });

})();

/* ============================================================
   Mo'eats — Premium motion layer (added)
   ============================================================ */
(function() {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- kinetic headlines: wrap words for masked rise-in ----
  document.querySelectorAll('[data-kinetic]').forEach(function(el) {
    if (el.dataset.kdone) return;
    el.dataset.kdone = '1';
    var html = el.innerHTML;
    // split on spaces but keep <br> and <span class=accent> intact-ish:
    // simple approach: process text nodes only
    var walk = function(node) {
      var out = [];
      node.childNodes.forEach(function(n) {
        if (n.nodeType === 3) { // text
          n.textContent.split(/(\s+)/).forEach(function(tok) {
            if (tok.trim() === '') {
              out.push(document.createTextNode(tok));
            } else {
              var w = document.createElement('span');
              w.className = 'word';
              var inner = document.createElement('span');
              inner.textContent = tok;
              w.appendChild(inner);
              out.push(w);
            }
          });
        } else if (n.nodeName === 'BR') {
          out.push(n.cloneNode());
        } else { // element like accent span — wrap its words too
          var clone = n.cloneNode(false);
          walk(n).forEach(function(c) {
            clone.appendChild(c);
          });
          out.push(clone);
        }
      });
      return out;
    };
    var frag = walk(el);
    el.innerHTML = '';
    frag.forEach(function(c) {
      el.appendChild(c);
    });
    el.classList.add('kinetic');
  });
  // reveal kinetic on view
  if ('IntersectionObserver' in window) {
    var kio = new IntersectionObserver(function(ents) {
      ents.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          kio.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.3
    });
    document.querySelectorAll('.kinetic').forEach(function(el) {
      if (reduce) {
        el.classList.add('in');
      } else {
        kio.observe(el);
      }
    });
  } else {
    document.querySelectorAll('.kinetic').forEach(function(el) {
      el.classList.add('in');
    });
  }

  // ---- pathway signature: scroll-drawn line + lit nodes ----
  var track = document.querySelector('.pathway-track');
  if (track && !reduce) {
    var fill = track.querySelector('.fill');
    var nodes = Array.prototype.slice.call(track.querySelectorAll('.node'));
    var ticking = false;

    function update() {
      ticking = false;
      var rect = track.getBoundingClientRect();
      var vh = window.innerHeight;
      // progress = how far viewport-center has travelled through the track
      var total = rect.height;
      var scrolled = Math.min(Math.max(vh * 0.5 - rect.top, 0), total);
      var pct = total > 0 ? (scrolled / total) : 0;
      fill.style.height = (pct * 100) + '%';
      var litY = rect.top + scrolled;
      nodes.forEach(function(n) {
        var ny = n.getBoundingClientRect().top;
        n.classList.toggle('lit', ny <= vh * 0.5 + 4);
      });
    }
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, {
      passive: true
    });
    window.addEventListener('resize', update);
    update();
  }

  // ---- subtle parallax on [data-parallax] (hero gl/ambient) ----
  if (!reduce) {
    var plx = document.querySelectorAll('[data-parallax]');
    if (plx.length) {
      var pt = false;
      window.addEventListener('scroll', function() {
        if (pt) return;
        pt = true;
        requestAnimationFrame(function() {
          var y = window.scrollY;
          plx.forEach(function(el) {
            var s = parseFloat(el.dataset.parallax) || 0.2;
            el.style.transform = 'translate3d(0,' + (y * s) + 'px,0)';
          });
          pt = false;
        });
      }, {
        passive: true
      });
    }
  }

  // ---- magnetic CTA (desktop only, subtle) ----
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2,
          my = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (mx * 0.15) + 'px,' + (my * 0.25) + 'px)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transform = '';
      });
    });
  }
})();
