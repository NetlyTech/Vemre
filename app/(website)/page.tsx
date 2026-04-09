import React from 'react';
import About from '@/components/components/About';
import AchievementCounter from '@/components/components/AchievementCounter';
import HeroHeader from '@/components/components/HeroHeader';
import OurService from '@/components/components/OurService';
// import ScrollReveal from '@/components/components/ScrollReveal';
// import Teams from '@/components/components/Teams';
import Faq from '@/components/components/Faq';
import LetsTalk from '@/components/components/LetsTalk';
// import ContactMe from '@/components/components/ContactMe';
import OurApp from '@/components/components/OurApp';
import ScrollToTop from '@/components/scrollToTop';

function App() {
  return (
    <div>

<HeroHeader />
{/* <ScrollReveal> */}
  <OurService />
  <About />
  {/* <Teams /> */}
  <AchievementCounter />
  <Faq />
  <LetsTalk />
  {/* <ContactMe /> */}
  <OurApp />

  {/* </ScrollReveal> */}
{/* <ScrollReveal> */}
  {/* </ScrollReveal> */}
{/* <ScrollReveal> */}
  {/* </ScrollReveal> */}
{/* <ScrollReveal> */}
  {/* </ScrollReveal> */}
{/* <ScrollReveal> */}
  {/* </ScrollReveal> */}
{/* <ScrollReveal> */}
  {/* // </ScrollReveal> */}
{/* <ScrollReveal> */}
  {/* // </ScrollReveal> */}

<ScrollToTop />

  </div>
  );
}

export default App;