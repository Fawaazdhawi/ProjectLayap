import AdminWhatWeDo from '../components/admin/AdminWhatWeDo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { adminNavLinks } from '../data/content';

const WhatWeDoEditPage = () => {
  return (
    <>
      <Header navLinks={adminNavLinks} />
      <main>
        <AdminWhatWeDo />
      </main>
      <Footer />
    </>
  );
};

export default WhatWeDoEditPage;
