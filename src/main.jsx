import React from 'react'

import './index.css'
import './styles/theme.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "./context/ThemeContext";
import { LoadingProvider } from "./context/LoadingContext";
import AppWrapper from "./AppWrapper";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <LoadingProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </LoadingProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
