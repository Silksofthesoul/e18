// Layout-dependent startup must wait for imported stylesheets too.
window.addEventListener('load', function() {
  Scene.init();
}, { once: true });
