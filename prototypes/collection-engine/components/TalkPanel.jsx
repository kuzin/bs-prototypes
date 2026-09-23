// A Book Talk, opened from the book panel — SfR's own session panel, not a
// second one. A talk reads the same wherever you reach it from.
//
// `showReaderList` stays on: that flag means "am I on a page about many
// readers?", and the Collection page is exactly that. It is the student
// profile, where the modal is just the log entry you clicked, that turns it
// off. So the panel keeps its reader rail — this reader and their other talks —
// beside the transcript.
import { SessionModal } from '../../sfr/components/SessionModal'
import '../../sfr/index.css'

import { bookTalkSession } from '../talks'

export function TalkPanel({ talk, siblings = [], onSelect, onClose }) {
  if (!talk) return null
  const sessions = (siblings.length ? siblings : [talk]).map(bookTalkSession)
  return (
    <SessionModal
      session={bookTalkSession(talk)}
      allSessions={sessions}
      onSelectSession={onSelect}
      onClose={onClose}
      sessionCount={sessions.length}
    />
  )
}
