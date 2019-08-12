import '../scss/main.scss';
import './share';

// initialize image lazyload using lazysizes
// https://github.com/aFarkas/lazysizes
import 'lazysizes';
import 'lazysizes/plugins/blur-up/ls.blur-up';

import App from './App.svelte';

const app = new App({
  target: document.querySelector(`[role='main']`),
  anchor: document.querySelector('section.story'),
  props: {
    name: 'world'
  }
});

window.app = app;

export default app;
