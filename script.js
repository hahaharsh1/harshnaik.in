(function () {
  var G = 'https://fonts.googleapis.com/css2?family=';

  // Text for each language. Fonts for non-Latin scripts load only when first needed.
  var LANGS = {
    en: { l1: 'Hello Hello,', l2: 'This is', name: 'Harsh Naik.',
          note: 'The website is under construction please call later.' },
    de: { l1: 'Hallo Hallo,', l2: 'Hier spricht', name: 'Harsh Naik.',
          note: 'Die Website ist im Bau, bitte rufen Sie später wieder an.' },
    fr: { l1: 'Allô Allô,', l2: 'Ici', name: 'Harsh Naik.',
          note: 'Le site est en construction, veuillez rappeler plus tard.' },
    hi: { l1: 'हैलो हैलो,', l2: 'मैं हूँ', name: 'हर्ष नाइक.',
          note: 'वेबसाइट अभी निर्माणाधीन है, कृपया बाद में कॉल करें।',
          font: 'Noto Sans Devanagari', url: G + 'Noto+Sans+Devanagari:wght@400&display=swap' },
    ja: { l1: 'もしもし、もしもし。', l2: 'こちらは', name: 'ハルシュ・ナイク。',
          note: 'ウェブサイトは制作中です。後ほどおかけ直しください。',
          font: 'Noto Sans JP', url: G + 'Noto+Sans+JP:wght@400&display=swap' },
    th: { l1: 'ฮัลโหล ฮัลโหล', l2: 'นี่คือ', name: 'ฮาร์ช ไนก์',
          note: 'เว็บไซต์กำลังอยู่ระหว่างการสร้าง กรุณาโทรมาใหม่ภายหลัง',
          font: 'Noto Sans Thai', url: G + 'Noto+Sans+Thai:wght@400&display=swap' },
    ta: { l1: 'ஹலோ ஹலோ,', l2: 'இது', name: 'ஹர்ஷ் நாயக்.',
          note: 'இணையதளம் உருவாக்கப்பட்டு வருகிறது, தயவுசெய்து பிறகு அழைக்கவும்.',
          font: 'Noto Sans Tamil', url: G + 'Noto+Sans+Tamil:wght@400&display=swap' },
    ur: { l1: 'ہیلو ہیلو،', l2: 'میں ہوں', name: 'ہرش نائک۔',
          note: 'ویب سائٹ زیرِ تعمیر ہے، براہِ کرم بعد میں کال کریں۔', dir: 'rtl',
          font: 'Noto Nastaliq Urdu', url: G + 'Noto+Nastaliq+Urdu:wght@400&display=swap' }
  };

  var el = {
    text: document.getElementById('text'),
    l1: document.getElementById('l1'),
    l2: document.getElementById('l2'),
    name: document.getElementById('name'),
    note: document.getElementById('note'),
    btn: document.getElementById('translate')
  };
  var loaded = {}, queue = [], current = 'en';

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Each run shows 3 to 6 other languages, then lands on English.
  function newRun() {
    var others = shuffle(Object.keys(LANGS).filter(function (k) { return k !== 'en'; }));
    queue = others.slice(0, 3 + Math.floor(Math.random() * 4));
    queue.push('en');
  }

  function loadFont(d) {
    if (!d.url) return Promise.resolve();
    if (loaded[d.url]) return loaded[d.url];
    return (loaded[d.url] = new Promise(function (resolve) {
      var link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = d.url;
      link.onload = function () {
        document.fonts.load("400 1em '" + d.font + "'", d.l1 + d.name + d.note).then(resolve, resolve);
      };
      link.onerror = resolve;
      document.head.appendChild(link);
      setTimeout(resolve, 1800); // never block the page on a slow font
    }));
  }

  function show(key) {
    var d = LANGS[key];
    return loadFont(d).then(function () {
      el.l1.textContent = d.l1;
      el.l2.textContent = d.l2;
      el.name.textContent = d.name;
      el.note.textContent = d.note;
      el.text.dir = d.dir || 'ltr';
      el.text.lang = key;
      document.documentElement.lang = key;
      document.body.className = 'l-' + key;
      document.body.classList.remove('swap');
      void document.body.offsetWidth;          // restart the little fade-in
      document.body.classList.add('swap', 'ready');
      current = key;
    });
  }

  function next() {
    if (!queue.length) newRun();
    return show(queue.shift());
  }

  el.btn.addEventListener('click', next);
  newRun();
  next();
})();
