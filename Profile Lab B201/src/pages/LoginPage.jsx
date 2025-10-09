import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Login from '../components/Login';

const LoginPage = () => {
  return (
    <>
      <Header />
      <main>
        <Login />
      </main>
      <Footer />
    </>
  );
};

export default LoginPage;