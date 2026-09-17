import { createRoot } from 'react-dom/client';
import Home from './app/page';
import './app/globals.css';
import './app/finalization.css';

createRoot(document.getElementById('root')!).render(<Home />);

void import('./app/finalization');
void import('./app/video-loop');
