import AdminWhatsOn from '../components/admin/AdminWhatsOn';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { adminNavLinks } from '../data/content';

const WhatsOnEditPage = () => {
  return (
    <>
      <Header navLinks={adminNavLinks} />
      <main>
        <AdminWhatsOn />
      </main>
      <Footer />
    </>
  );
};

export default WhatsOnEditPage;
