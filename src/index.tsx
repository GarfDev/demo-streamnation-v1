import gsap from 'gsap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { useGSAP } from '@gsap/react';

import './styles.css';
import App from './App';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(gsap.plugins.motionPath);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
