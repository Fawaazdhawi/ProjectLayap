import AdminSiteSettings from '../components/admin/AdminSiteSettings';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { adminNavLinks } from '../data/content';

const SiteSettingsEdit = () => {
  return (
    <>
      <Header navLinks={adminNavLinks} />
      <main>
        <AdminSiteSettings />
      </main>
      <Footer />
    </>
  );
};

export default SiteSettingsEdit;
