(function () {
  // Otevírací doba: den (0 = neděle) -> [od, do] v minutách
  var HOURS = { 1: [420, 900], 2: [420, 900], 3: [420, 900], 4: [420, 900], 5: [420, 900], 6: [420, 720] };
  var NAMES = ['v neděli', 'v pondělí', 'v úterý', 've středu', 've čtvrtek', 'v pátek', 'v sobotu'];

  function pragueNow() {
    var p = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Prague', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { day: day, min: (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10) };
  }

  function fmt(min) { return Math.floor(min / 60) + ':' + ('0' + (min % 60)).slice(-2); }

  function nextOpen(now) {
    var today = HOURS[now.day];
    if (today && now.min < today[0]) return 'Otevíráme v ' + fmt(today[0]);
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (HOURS[d]) return 'Otevíráme ' + (i === 1 ? 'zítra' : NAMES[d]) + ' v ' + fmt(HOURS[d][0]);
    }
    return '';
  }

  var status = document.getElementById('status');
  var statusText = document.getElementById('status-text');
  var now = pragueNow();

  if (status && statusText) {
    var h = HOURS[now.day];
    var open = h && now.min >= h[0] && now.min < h[1];
    statusText.textContent = open ? 'Otevřeno' : 'Zavřeno';
    var more = document.createElement('span');
    more.className = 'status__more';
    more.textContent = open ? ' do ' + fmt(h[1]) : '. ' + nextOpen(now);
    statusText.appendChild(more);
    status.classList.toggle('is-open', !!open);
    status.hidden = false;
  }

  var rows = document.querySelectorAll('#hours li');
  rows.forEach(function (li) {
    var d = li.getAttribute('data-day');
    var match = d === '1-5' ? (now.day >= 1 && now.day <= 5) : parseInt(d, 10) === now.day;
    li.classList.toggle('is-today', match);
  });

  // Koláž: fotky se po jedné prolínají, klik fotku zvětší
  var PHOTOS = [
    { src: 'kubala-02-bmw-x3-2-0.jpg', cap: 'BMW X3: motor a převodovka mimo auto', pos: '50% 45%' },
    { src: 'kubala-05-skoda-octavia-3.jpg', cap: 'Škoda Octavia III: tlumiče a pružiny', pos: '50% 75%' },
    { src: 'kubala-07-skoda-fabia-i.jpg', cap: 'Škoda Fabia I: brzdy a výfuk', pos: '50% 70%' },
    { src: 'kubala-10-ssangyong-korando-1-5tgdi.jpg', cap: 'SsangYong Korando: olej a filtr', pos: '50% 75%' },
    { src: 'kubala-06-audi-a5-b8.jpg', cap: 'Audi A5: rozvody a vyměněné díly', pos: '50% 75%' },
    { src: 'kubala-11-audi-q5.jpg', cap: 'Audi Q5: rozvody, baterie a filtry', pos: '50% 80%' },
    { src: 'kubala-12-skoda-superb-iii.jpg', cap: 'Škoda Superb III: ventilátor topení', pos: '50% 60%' },
    { src: 'kubala-13-peugeot-boxer.jpg', cap: 'Peugeot Boxer: čelní sklo', pos: '50% 50%' },
    { src: 'kubala-04-toyota-prius.jpg', cap: 'Toyota Prius v dílně', pos: '50% 50%' },
    { src: 'kubala-03-jeep-willys.jpg', cap: 'Malý Jeep Willys na zvedáku', pos: '50% 35%' }
  ];
  var collage = document.getElementById('collage');
  var tiles = collage ? Array.prototype.slice.call(collage.querySelectorAll('.tile')) : [];
  var viewer = document.getElementById('viewer');
  var vImg = document.getElementById('viewer-img');
  var vCap = document.getElementById('viewer-cap');
  var vClose = document.getElementById('viewer-close');

  if (collage && tiles.length) {
    var paused = false;
    var nextPhoto = tiles.length;
    var nextTile = 0;

    function swap(tile, idx) {
      var p = PHOTOS[idx];
      var loader = new Image();
      loader.onload = function () {
        var old = tile.querySelector('img');
        var img = document.createElement('img');
        img.src = p.src;
        img.alt = '';
        img.style.objectPosition = p.pos;
        img.className = 'is-new';
        old.after(img);
        tile.setAttribute('data-i', idx);
        tile.setAttribute('aria-label', 'Zvětšit fotku: ' + p.cap.replace(':', ','));
        tile.querySelector('.tile__cap').textContent = p.cap;
        img.getBoundingClientRect();
        img.classList.remove('is-new');
        setTimeout(function () { old.remove(); }, 850);
      };
      loader.src = p.src;
    }

    function tick() {
      if (paused || document.hidden || (viewer && viewer.open)) return;
      swap(tiles[nextTile], nextPhoto);
      nextPhoto = (nextPhoto + 1) % PHOTOS.length;
      nextTile = (nextTile + 1) % tiles.length;
    }

    collage.addEventListener('mouseenter', function () { paused = true; });
    collage.addEventListener('mouseleave', function () { paused = false; });
    collage.addEventListener('focusin', function () { paused = true; });
    collage.addEventListener('focusout', function () { paused = false; });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(tick, 4000);
    }

    if (viewer && vImg && vCap && viewer.showModal) {
      tiles.forEach(function (t) {
        t.addEventListener('click', function () {
          var p = PHOTOS[parseInt(t.getAttribute('data-i'), 10)];
          vImg.src = p.src;
          vImg.alt = p.cap;
          vCap.textContent = p.cap;
          viewer.showModal();
        });
      });
      if (vClose) vClose.addEventListener('click', function () { viewer.close(); });
      viewer.addEventListener('click', function (e) { if (e.target === viewer) viewer.close(); });
    }
  }
})();
