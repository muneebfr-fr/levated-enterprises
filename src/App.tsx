import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Faq from './pages/Faq';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/faq" element={<Faq />} />
    </Routes>
  );
}
