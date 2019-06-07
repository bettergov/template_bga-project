import '../scss/main.scss';
import './share';
import App from './App.svelte';

const app = new App({
  target: document.querySelector('article.main'),
  anchor: document.querySelector('section.story'),
  props: {
    name: 'world'
  }
});

window.app = app;

export default app;
