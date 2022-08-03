import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import { ConfigureStore } from "./Redux/ConfigureStore";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={ConfigureStore()}>
      <App />
    </Provider>
  </React.StrictMode>
);