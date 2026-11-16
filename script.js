// SELBA Cargo · web · comportamiento común
(function () {
  // Menú móvil
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
  }

  // Año en el pie
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  // Formulario de contacto
  var form = document.getElementById('contactForm');
  if (!form) return;
  var ok = document.getElementById('formOk');
  var err = document.getElementById('formErr');

  // Protección antibots sin servicios externos ni cookies:
  // 1) campo trampa invisible (_gotcha): una persona no lo ve ni lo rellena;
  // 2) tiempo mínimo: nadie rellena el formulario en menos de 3 segundos;
  // 3) límite de enlaces: el spam suele venir cargado de enlaces.
  var startedAt = Date.now();
  var MIN_MS = 3000, MAX_LINKS = 2;

  function show(el, msg) { ok.classList.remove('is-on'); err.classList.remove('is-on'); if (el) { el.textContent = msg; el.classList.add('is-on'); } }
  function val(name) { var f = form.elements[name]; return f ? f.value.trim() : ''; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    show(null);
    // Bot detectado: se finge el envío y no se manda nada
    if (val('_gotcha') || Date.now() - startedAt < MIN_MS) {
      form.reset();
      show(ok, 'Mensaje enviado. Te responderemos lo antes posible.');
      return;
    }
    var links = (val('mensaje').match(/https?:\/\/|www\./gi) || []).length;
    if (links > MAX_LINKS) {
      show(err, 'Por seguridad, el mensaje no puede llevar más de ' + MAX_LINKS + ' enlaces.');
      form.elements.mensaje.focus();
      return;
    }

    var bad = [];
    if (!val('nombre')) bad.push('nombre');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) bad.push('email');
    form.querySelectorAll('.field input').forEach(function (i) { i.style.borderColor = ''; });
    if (bad.length) {
      bad.forEach(function (n) { form.elements[n].style.borderColor = 'var(--danger)'; });
      form.elements[bad[0]].focus();
      show(err, 'Revisa los campos marcados: necesitamos tu nombre y un correo válido.');
      return;
    }

    var id = form.getAttribute('data-formspree');
    var submit = form.querySelector('[type=submit]');

    // Sin Formspree: abre el correo del visitante con el mensaje redactado
    if (!id) {
      var to = form.getAttribute('data-email');
      var subject = (val('asunto') || 'Consulta') + ' · SELBA Cargo';
      var body = [
        'Nombre: ' + val('nombre'),
        'Empresa: ' + (val('empresa') || '-'),
        'Correo: ' + val('email'),
        'Teléfono: ' + (val('telefono') || '-'),
        'Personas en el equipo: ' + (val('equipo') || '-'),
        '',
        val('mensaje')
      ].join('\n');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      show(ok, 'Se ha abierto tu programa de correo con el mensaje preparado. Si no se abre, escríbenos a ' + to + ' o llámanos al 667 93 86 30.');
      return;
    }

    // Con Formspree: envío directo
    submit.disabled = true; submit.textContent = 'Enviando…';
    fetch('https://formspree.io/f/' + id, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        show(ok, 'Mensaje enviado. Te responderemos lo antes posible.');
      })
      .catch(function () {
        show(err, 'No se ha podido enviar. Escríbenos a ' + form.getAttribute('data-email') + ' o llámanos al 667 93 86 30.');
      })
      .then(function () { submit.disabled = false; submit.textContent = 'Enviar mensaje'; });
  });
})();
