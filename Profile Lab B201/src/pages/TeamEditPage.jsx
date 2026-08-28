import AdminTeam from '../components/admin/AdminTeam';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { adminNavLinks } from '../data/content';

const TeamEditPage = () => {
  return (
    <>
      <Header navLinks={adminNavLinks} />
      <main>
        <AdminTeam />
      </main>
      <Footer />
    </>
  );
};

export default TeamEditPage;
