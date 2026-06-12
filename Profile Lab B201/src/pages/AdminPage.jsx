import Admin from '../components/Admin';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { adminNavLinks } from '../data/content';

const AdminPage = () => {
  return (
    <>
      <Header navLinks={adminNavLinks} />
      <main>
        <Admin />
      </main>
      <Footer />
    </>
  );
};

export default AdminPage;
