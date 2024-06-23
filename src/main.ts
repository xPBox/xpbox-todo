import './app.css'
import App from './App.svelte'
import 'overlayscrollbars/overlayscrollbars.css';

const app = new App({
  target: document.getElementById('app')!,
})

export default app
