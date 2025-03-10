import React from 'react';
import Navbar from './components/NavBar';
import HeroHeader from './components/HeroHeader';
import OurService from './components/OurService';
import About from './components/About';
import Teams from './components/Teams';
import AchievementCounter from './components/AchievementCounter';
import Faq from './components/Faq';
import ContactMe from './components/ContactMe';
import OurApp from './components/OurApp';
import FooterComp from './components/FooterComp';

function App() {
  return (
    <div>
      <Navbar />
      <HeroHeader />
      <OurService />
      <About />
      <Teams />
      <AchievementCounter />
      <Faq />
      <ContactMe />
      <OurApp />
      <FooterComp />
    </div>
  );
}

export default App;