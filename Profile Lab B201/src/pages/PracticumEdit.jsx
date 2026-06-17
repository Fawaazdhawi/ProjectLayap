import AdminPracticum from '../components/admin/AdminPracticum';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { adminNavLinks } from '../data/content';

const PracticumEdit = () => {
  return (
    <>
      <Header navLinks={adminNavLinks} />
      <main>
        <AdminPracticum />
      </main>
      <Footer />
    </>
  );
};

export default PracticumEdit;
