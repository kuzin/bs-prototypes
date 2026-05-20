import { PROTOTYPES } from '../prototypes'

const PATTERNS = PROTOTYPES.find((p) => p.id === 'patterns');
const CARDS = PROTOTYPES.filter((p) => p.id !== 'patterns');

function ProtoCard({ name, description, href, accent }) {
  return (
    <a href={href} className="card" style={{ "--accent": accent }}>
      <div className="card-body">
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
      <span className="card-arrow">→</span>
    </a>
  );
}

export default function App() {
  return (
    <div className="page">
      <header>
        <h1>
          <img src="bs.svg" alt="Beanstack" className="logo-mark" />
          Prototypes
        </h1>
        {PATTERNS && (
          <a href={PATTERNS.href} className="patterns-btn">
            Pattern Library →
          </a>
        )}
      </header>

      <main>
        <div className="list">
          {CARDS.map((p) => (
            <ProtoCard key={p.href} {...p} />
          ))}
        </div>
      </main>
    </div>
  );
}
