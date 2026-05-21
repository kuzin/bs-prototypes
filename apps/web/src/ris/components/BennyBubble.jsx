import './BennyBubble.css'

export function BennyBubble({ children }) {
  return (
    <div className="benny-bubble-wrap">
      <img className="benny-bubble-avatar" src="/bs-prototypes/benny.png" alt="Benny" />
      <div className="benny-bubble-body">
        <div className="benny-bubble">{children}</div>
      </div>
    </div>
  )
}
