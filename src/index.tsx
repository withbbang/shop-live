import './console'; // 최상단에 붙여야 빌드할 때 적용돼서 콘솔들 기능 제거됨
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store from 'middlewares/configureStore';
import App from 'App';
import 'styles/style.css';

if (import.meta.env.MODE === 'development') {
  const { worker } = await import('./mocks/browser');
  await worker.start();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistStore(store)}>
      <App />
    </PersistGate>
  </Provider>,
);
