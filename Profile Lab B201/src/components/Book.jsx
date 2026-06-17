import { serviceCardsData } from '../data/content';
import { useNavigate } from 'react-router';
import '../styles/main.css';
import '../styles/service.css';

const Book = () => {
  const navigate = useNavigate();

  return (
    <section className="service-cards-book-section">
      <div className="container">
        <div className="service-edit-grid-2colomn">
          {serviceCardsData.map((service) => (
            <div
              key={service.title}
              className="service-card-item-book"
              onClick={() => service.path && navigate(service.path)}
            >
              <h4>{service.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Book;
