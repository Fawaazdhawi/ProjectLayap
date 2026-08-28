import AdminContact from '../components/admin/AdminContact';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { adminNavLinks } from '../data/content';

const ContactEditPage = () => {
  return (
    <>
      <Header navLinks={adminNavLinks} />
      <main>
        <AdminContact />
      </main>
      <Footer />
    </>
  );
};

export default ContactEditPage;
