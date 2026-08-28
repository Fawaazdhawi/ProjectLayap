import AdminCultureTabs from '../components/admin/AdminCultureTabs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { adminNavLinks } from '../data/content';

const CultureTabsEditPage = () => {
  return (
    <>
      <Header navLinks={adminNavLinks} />
      <main>
        <AdminCultureTabs />
      </main>
      <Footer />
    </>
  );
};

export default CultureTabsEditPage;
