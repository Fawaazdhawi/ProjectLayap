import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/main.css';

const STATS = [
  { number: '40+', label: 'Active Projects' },
  { number: '12', label: 'Publications' },
  { number: '6', label: 'Research Groups' },
  { number: '85', label: 'Members' },
];

const Stats = () => {
  const [ref, isVisible] = useScrollReveal(0.1);

  return (
    <section style={{ background: '#f5f5f2', padding: '3.5rem 0' }}>
      <div
        className={`container reveal-up ${isVisible ? 'active' : ''}`}
        ref={ref}
      >
        <div className="stats-impact-grid">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-impact-card">
              <div className="stat-impact-number">{stat.number}</div>
              <div className="stat-impact-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
