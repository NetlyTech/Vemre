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
import ScrollReveal from './components/ScrollReveal';

function App() {
  return (
    <div>
    <Navbar />
    <HeroHeader />
    <ScrollReveal><OurService /></ScrollReveal>
    <ScrollReveal><About /></ScrollReveal>
    <ScrollReveal><Teams /></ScrollReveal>
    <ScrollReveal><AchievementCounter /></ScrollReveal>
    <ScrollReveal><Faq /></ScrollReveal>
    <ScrollReveal><ContactMe /></ScrollReveal>
    <ScrollReveal><OurApp /></ScrollReveal>
    <ScrollReveal><FooterComp /></ScrollReveal>
  </div>
  );
}

export default App;