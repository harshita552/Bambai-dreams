import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LightboxProvider } from './context/LightboxContext';
import Navbar       from './components/Navbar';
import Footer       from './components/Footer';
import Lightbox     from './components/Lightbox';
import PaperGrain   from './components/PaperGrain';
import CustomCursor from './components/CustomCursor';
import Home          from './pages/Home';
import About         from './pages/About';
import Work          from './pages/Work';
import Services      from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Contact       from './pages/Contact';
import HeroSection   from './components/hero/HeroSection';
import ScrollToTop   from './components/ScrollToTop';
import { useTouchReveal } from './hooks/useTouchReveal';

export default function App() {
  const location = useLocation();
  useTouchReveal(location.pathname);

  return (
    <LightboxProvider>
      <ScrollToTop/>
      <PaperGrain/>
      <CustomCursor/>
      <Navbar/>
      <Lightbox/>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"               element={<Home/>}/>
          <Route path="/about"          element={<About/>}/>
          <Route path="/work"           element={<Work/>}/>
          <Route path="/services"       element={<Services/>}/>
          <Route path="/services/:slug" element={<ServiceDetail/>}/>
          <Route path="/contact"        element={<Contact/>}/>
          <Route path="/hero-preview"   element={<HeroSection/>}/>
        </Routes>
      </AnimatePresence>

      <Footer/>
    </LightboxProvider>
  );
}
