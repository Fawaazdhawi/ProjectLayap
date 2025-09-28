import React from 'react';
import Header from '../components/Header';
import About from '../components/About';
import Values from '../components/Values';
import WhatWeDo from '../components/WhatWeDo';
import Praktikum from '../components/Praktikum';
import Team from '../components/Team';
import WhatsOn from '../components/WhatsOn';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <About />
        <Values />
        <WhatWeDo />
        <Praktikum />
        <Team />
        <WhatsOn />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Home;