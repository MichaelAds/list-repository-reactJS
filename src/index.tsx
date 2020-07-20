import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  // tratativa de erro no javascript - para typescript
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
