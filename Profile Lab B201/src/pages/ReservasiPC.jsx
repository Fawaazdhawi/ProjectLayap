import BookPC from '../components/BookPC';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { adminNavLinks } from '../data/content';

const ReservasiPC = () => {
  return (
    <>
      <Header navLinks={adminNavLinks} />
      <main>
        <BookPC />
      </main>
      <Footer />
    </>
  );
};

export default ReservasiPC;
