import Admin from '../components/Admin.jsx';
import Header from '../components/Header3.jsx';
import Footer from '../components/Footer.jsx';

const AdminPage = () => {
  return (
    <>
        <Header />
        <main>
            <Admin />
        </main>
        <Footer />
    </>
  );  
};

export default AdminPage;