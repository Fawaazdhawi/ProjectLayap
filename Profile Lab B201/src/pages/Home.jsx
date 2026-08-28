import React from 'react';
import Header from '../components/Header';
import WhatsOn from '../components/WhatsOn';
import About from '../components/About';
import WhatWeDo from '../components/WhatWeDo';
import Praktikum from '../components/Praktikum';
import Team from '../components/Team';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <WhatsOn />
        <About />
        <WhatWeDo />
        <Praktikum />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Home;
