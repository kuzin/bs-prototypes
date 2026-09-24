import { useState } from 'react'
import { bookDetail, readerTalks } from '../derive'
import { BookModal } from './BookModal'
import { ReaderPanel } from './ReaderPanel'
import { TalkPanel } from './TalkPanel'

/**
 * The book panel and the two panels it opens onto — a reader, a book talk —
 * for one school. Shared by every school screen that lists titles, so a row
 * opens the same book wherever it is: the Overview's top titles and the
 * Collection's full list are the same panel, not two.
 *
 * `openTitle` is owned by the host, because the host's rows are what open it.
 */
export function SchoolBookPanels({
  school,
  openTitle,
  onOpenTitle,
  actions,
  hidden,
  onToggleHidden,
}) {
  // A reader opened out of the book panel. The book panel closes behind it, the
  // way the classroom's does — two stacked overlays is one too many.
  const [openReader, setOpenReader] = useState(null)
  // A book talk opened out of the book panel — SfR's own session panel, so a
  // talk reads the same wherever you reach it from.
  const [openTalk, setOpenTalk] = useState(null)

  return (
    <>
      <BookModal
        detail={openTitle ? bookDetail(school, openTitle) : null}
        action={openTitle ? actions?.get(openTitle) : null}
        onClose={() => onOpenTitle(null)}
        hidden={hidden?.has(openTitle)}
        onToggleHidden={onToggleHidden}
        onOpenTitle={onOpenTitle}
        onOpenTalk={setOpenTalk}
        onOpenReader={(key, section = null) => setOpenReader({ key, section })}
      />

      <ReaderPanel
        studentKey={openReader?.key}
        section={openReader?.section}
        onClose={() => setOpenReader(null)}
      />

      {/* The rail beside a talk is that reader's other conversations, so you can
          step through them the way the review queue does. */}
      <TalkPanel
        talk={openTalk}
        siblings={openTalk ? readerTalks(school, openTalk.reader.id) : []}
        onSelect={(sess) =>
          setOpenTalk(
            readerTalks(school, openTalk.reader.id).find(
              (t) => `ce-talk-${t.reader.id}-${t.title.id}` === sess.id,
            ) ?? openTalk,
          )
        }
        onClose={() => setOpenTalk(null)}
      />
    </>
  )
}
