import Book from '../components/Book';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { adminNavLinks } from '../data/content';

const Booking = () => {
  return (
    <>
      <Header navLinks={adminNavLinks} />
      <main>
        <Book />
      </main>
      <Footer />
    </>
  );
};

export default Booking;
