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

  // Galerie: prolnutí fotky po kliknutí na náhled
  var img = document.getElementById('g-img');
  var cap = document.getElementById('g-cap');
  var thumbs = document.querySelectorAll('.thumb');
  if (img && cap && thumbs.length) {
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        if (t.classList.contains('is-active')) return;
        thumbs.forEach(function (o) {
          o.classList.toggle('is-active', o === t);
          o.setAttribute('aria-pressed', o === t ? 'true' : 'false');
        });
        img.classList.add('is-fading');
        setTimeout(function () {
          var show = function () { img.classList.remove('is-fading'); img.onload = null; };
          img.onload = show;
          img.src = t.getAttribute('data-src');
          img.alt = t.getAttribute('data-alt');
          img.style.objectPosition = t.getAttribute('data-pos');
          cap.textContent = t.getAttribute('data-cap');
          if (img.complete) show();
        }, 200);
      });
    });
  }
})();
