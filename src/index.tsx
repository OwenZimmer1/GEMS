// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Use the provider and CSS from @xyflow/react
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';  // ← correct import

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  </React.StrictMode>
);

reportWebVitals();
