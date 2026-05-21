import { PROTOTYPES } from '../prototypes'

const PATTERNS = PROTOTYPES.find((p) => p.id === 'patterns');
const CARDS = PROTOTYPES.filter((p) => p.id !== 'patterns');

const ICONS = {
  // Student Profile — a person bust
  'student-profile': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  // RIS School — a single schoolhouse
  'ris-school': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10l9-6 9 6v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M9 21v-6h6v6" />
      <line x1="12" y1="3" x2="12" y2="6" />
    </svg>
  ),
  // RIS District — clustered buildings (skyline)
  'ris-district': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="10" width="5" height="11" rx="0.5" />
      <rect x="10" y="5" width="5" height="16" rx="0.5" />
      <rect x="17" y="13" width="4" height="8" rx="0.5" />
      <line x1="12" y1="9" x2="13" y2="9" />
      <line x1="12" y1="13" x2="13" y2="13" />
      <line x1="12" y1="17" x2="13" y2="17" />
    </svg>
  ),
  // Sessions for Review — chat bubble with a small check (review)
  sfr: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z" />
      <polyline points="8,11 11,14 16,9" />
    </svg>
  ),
  // Pattern Library — four little squares
  patterns: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3"  y="3"  width="8" height="8" rx="1.5" />
      <rect x="13" y="3"  width="8" height="8" rx="1.5" />
      <rect x="3"  y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  ),
};

function ProtoCard({ id, name, description, href, accent }) {
  return (
    <a href={href} className="card" style={{ "--accent": accent }}>
      {ICONS[id] && <span className="card-icon" style={{ color: accent }}>{ICONS[id]}</span>}
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
