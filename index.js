import { Capacitor } from '@capacitor/core';

// Initialize Capacitor
window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();
      Capacitor.Plugins.SplashScreen.hide();
    }
  }
); 