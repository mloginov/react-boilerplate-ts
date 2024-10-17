import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Main } from './main';

export class Index {
  constructor() {
    this.render();
  }

  private render(): void {
    const container = document.getElementById('app');
    const root = createRoot(container!);
    root.render(React.createElement(Main, { app: this }));
  }
}

new Index();
