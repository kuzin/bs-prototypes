import { useState } from 'react'

import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { Input, Radio, RadioGroup } from '@components/Form/Form'
import { InfoBox } from '@components/InfoBox/InfoBox'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { EmptyState } from '@components/Primitives/Primitives'
import {
  BannerStack,
  ChallengeCard,
  FundraiserCard,
  ChallengeScope,
  GoalCard,
  CommunityGoalBanner,
  LeaderboardCard,
  MotivationCard,
  READER_TABS,
  ReaderTopBar,
  StreakBanner,
  bannerSrc,
  challengeTypes,
} from '@components/ReaderApp/ReaderApp'
import { Pill } from '@components/Pill/Pill'
import {
  ConnectBanner,
  PartnerSwitcher,
  AutoLoggedCard,
} from '@components/PartnerConnect/PartnerConnect'
import { PersonalizeReader } from '@components/PersonalizeReader/PersonalizeReader'
import { CompleteActivity } from '@components/CompleteActivity/CompleteActivity'
import { AccountSettings } from '@components/AccountSettings/AccountSettings'
import { FriendRequests } from '@components/FriendRequests/FriendRequests'

import {
  READER,
  OTHER_READERS,
  CHALLENGES,
  MORE_CHALLENGES,
  PAST_CHALLENGES,
  CONNECTED_SITE,
  CONNECTED_CHALLENGES,
  TOP_SCHOOLS,
  TOP_GRADES,
  BOOKS,
  STREAK_SEED,
} from '../data'
import { CONNECTION_LIST, autoLoggedRows } from '../connections'
import { ReadingLog } from './ReadingLog'
import './Challenges.css'
import { JoyfulFooter, APPS } from '../../footers/JoyfulFooter'

// `.page-section-header` — every list on the Challenges page opens with one.
function SectionHead({ title, sub }) {
  return (
    <div className="wa-group-head">
      <div className="wa-group-title">{title}</div>
      {sub && <div className="wa-group-sub">{sub}</div>}
    </div>
  )
}

// The pastels the app picks from for the join modal's ground when it can't
// read a colour off the challenge's artwork.
const JOIN_TINTS = ['#DBF2E7', '#DDF6F9', '#FFECC8', '#FCE0D6', '#F4E2F8']

/**
 * The join modal — `programs/_join_challenge.html.haml` plus the JS in
 * `_programs_list` that fills it. The challenge's art on a ground taken from
 * the art's own colour, its name and dates, the chips it wears and who it's
 * for, its description, then the two answers.
 *
 * What the footer offers is conditional, and both conditions are the app's: a
 * challenge that hasn't started and doesn't take pre-registration can't be
 * joined, and one you've already ignored loses "Not Interested" — you can only
 * come back the other way. Where the app hides the button row outright, this
 * keeps the footer and says why: a modal that stops mid-sentence reads as
 * broken rather than as closed.
 *
 * `questions` are the site's own registration questions, which the app renders
 * into this same overlay (`_registration_questions_modal` is a partial *of*
 * `_join_challenge`). They come between pressing Join and being enrolled, and
 * only the first time: the answers belong to the profile rather than the
 * challenge, so a reader who has answered them is never asked again.
 */
export function JoinChallenge({
  challenge,
  ignored,
  onClose,
  onJoin,
  onDismiss,
  questions = [],
  answers,
  onAnswer,
}) {
  const [joining, setJoining] = useState(false)
  const [asking, setAsking] = useState(false)
  const [draft, setDraft] = useState({})

  // Asked, not answered: an optional question the reader skipped is recorded
  // as asked, so keying off the value alone would put it back in front of them
  // on every join they ever make.
  const unanswered = questions.filter((q) => !(q.id in (answers ?? {})))
  // `active_and_required` — the ones that block the join.
  const missing = unanswered.filter((q) => q.required && !draft[q.id])
  const banner = challenge ? bannerSrc(challenge.banner) : null
  // ColorThief reads the banner's dominant colour at 0.7; the fixtures carry
  // that colour as `tint`, and a challenge without one takes a pastel the way
  // the app does.
  const ground = challenge?.tint
    ? `color-mix(in srgb, ${challenge.tint} 70%, white)`
    : JOIN_TINTS[(challenge?.title?.length ?? 0) % JOIN_TINTS.length]
  // `data-active-challenge` false + `allow_preregistration` false.
  const canJoin = challenge ? !challenge.upcoming || challenge.allowPreregistration : true
  const isIgnored = Boolean(challenge && ignored)

  function join() {
    setJoining(true)
    // The app disables both buttons and says "Just a moment..." while the
    // request is out.
    setTimeout(() => {
      setJoining(false)
      setAsking(false)
      setDraft({})
      onJoin(challenge)
    }, 450)
  }

  // Pressing Join with questions outstanding asks them first; answering them is
  // the same press, one screen on.
  function start() {
    if (unanswered.length > 0 && !asking) {
      setAsking(true)
      return
    }
    if (asking) {
      onAnswer?.({
        ...answers,
        // Every question that was put to them, including the ones they left —
        // `null` is "asked and skipped", which is not the same as never asked.
        ...Object.fromEntries(unanswered.map((q) => [q.id, draft[q.id] ?? null])),
      })
    }
    join()
  }

  return (
    <Modal
      open={Boolean(challenge)}
      onClose={onClose}
      variant="center"
      closeBadge
      ariaLabel={challenge ? `Join ${challenge.title}` : 'Join challenge'}
    >
      {challenge && (
        <>
          <ModalClose onClick={onClose} />
          <div className="jc">
            <div className="jc-head" style={{ background: ground }}>
              {banner && <img className="jc-art" src={banner} alt="" />}
            </div>

            {asking ? (
              <div className="modal-body jc-body">
                <h2 className="jc-title">Before {READER.name} joins</h2>
                <p className="jc-qintro">
                  {challenge.microsite ?? 'Magnolia Middle School'} asks everyone taking part these
                  questions. You only answer them once.
                </p>
                <div className="jc-questions">
                  {unanswered.map((q) => (
                    <fieldset className="jc-question" key={q.id}>
                      <legend className="jc-question-text">
                        {q.question}
                        {/* The house marker, and the app's own
                            (`<abbr title='required'>*</abbr>` on its labels).
                            Nothing marks an optional one: no asterisk is what
                            optional looks like. */}
                        {q.required && (
                          <span className="fld-req" title="Required">
                            {' '}
                            *
                          </span>
                        )}
                      </legend>
                      {/* One answer only — the admin screen says so outright,
                          and there is no free-text question in the product. */}
                      <RadioGroup
                        name={q.id}
                        layout="column"
                        value={draft[q.id] ?? ''}
                        onChange={(v) => setDraft((d) => ({ ...d, [q.id]: v }))}
                      >
                        {q.answers.map((a) => (
                          <Radio key={a.id} value={a.id}>
                            {a.answer}
                          </Radio>
                        ))}
                      </RadioGroup>
                    </fieldset>
                  ))}
                </div>
              </div>
            ) : (
              <div className="modal-body jc-body">
                <h2 className="jc-title">{challenge.title}</h2>
                <div className="jc-dates">{challenge.dates}</div>
                <div className="jc-reqs">
                  {challengeTypes(challenge).map((t) => (
                    <Pill key={t} color="#087542" size="sm" className="jc-type">
                      {t}
                    </Pill>
                  ))}
                  {challenge.range && (
                    <Pill color="#1A6DD5" size="sm" className="jc-range">
                      {challenge.ageDeterminant === 'ages'
                        ? `Ages: ${challenge.range}`
                        : challenge.range}
                    </Pill>
                  )}
                </div>

                {/* Some challenges are offered as a set you pick one of. */}
                {challenge.alternatives?.length > 0 && (
                  <div className="jc-alts">
                    <div className="jc-altshead">Alternative Challenges</div>
                    <p className="jc-altsdesc">
                      {READER.name} can choose between this challenge <strong>OR</strong> one of the
                      following challenges.
                    </p>
                    <ul className="jc-altslist">
                      {challenge.alternatives.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {challenge.description && (
                  <>
                    <div className="jc-deshead">Description</div>
                    <p className="jc-destext">{challenge.description}</p>
                  </>
                )}
              </div>
            )}

            {/* The app's footer is reversed and pushed apart: the answer you're
                being asked for on the right, the way out on the left. */}
            <div className="modal-footer modal-footer--between">
              {canJoin ? (
                <>
                  {asking ? (
                    <Button variant="secondary" disabled={joining} onClick={() => setAsking(false)}>
                      Back
                    </Button>
                  ) : isIgnored ? (
                    <span />
                  ) : (
                    <Button
                      variant="secondary"
                      disabled={joining}
                      onClick={() => onDismiss(challenge)}
                    >
                      Not Interested
                    </Button>
                  )}
                  <Button onClick={start} disabled={joining || (asking && missing.length > 0)}>
                    {joining ? 'Just a moment\u2026' : 'Join Challenge'}
                  </Button>
                </>
              ) : (
                <span className="jc-notyet">
                  Opens {challenge.dates.split('—')[0].trim()} — you can join it once it starts.
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}

/**
 * `programs/_confirm_unenroll.html.haml`. Leaving a challenge throws away the
 * progress you made in it, so the app asks first — our kebab was doing it on
 * the click.
 */
export function ConfirmUnenroll({ challenge, onClose, onConfirm }) {
  return (
    <Modal
      open={Boolean(challenge)}
      onClose={onClose}
      variant="center"
      closeBadge
      ariaLabel="Confirm un-enroll"
    >
      {challenge && (
        <>
          <ModalClose onClick={onClose} />
          <div className="modal-header modal-header--flush">
            <h2 className="modal-title">Are you sure?</h2>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to un-enroll from {challenge.title}?</p>
          </div>
          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onConfirm(challenge)}>Un-enroll</Button>
          </div>
        </>
      )}
    </Modal>
  )
}

/**
 * "Enter your code to join the challenge." — `_enter_challenge_code.html.haml`.
 * A challenge with a code isn't listed, so this is the only way in.
 */
function ChallengeCodeModal({ open, onClose, onSubmit }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    const found = onSubmit(code.trim())
    if (found) {
      setCode('')
      setError('')
    } else {
      setError("That code doesn't match a challenge. Check it and try again.")
    }
  }

  return (
    <Modal open={open} onClose={onClose} variant="center" closeBadge ariaLabel="Enter a code">
      <ModalClose onClick={onClose} />
      <form onSubmit={submit}>
        <div className="modal-header modal-header--flush">
          <h2 className="modal-title" id="challenge-code-label">
            Enter your code to join the challenge.
          </h2>
        </div>
        <div className="modal-body">
          {error && (
            <div className="cc-error" role="alert">
              {error}
            </div>
          )}
          <Input
            id="challenge-code"
            type="search"
            autoComplete="off"
            aria-labelledby="challenge-code-label"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Challenge code"
          />
        </div>
        <div className="modal-footer">
          <Button type="submit" disabled={!code.trim()}>
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// The current Beanstack footer lives in the `footers` prototype — logo + app
// stores over a Joyful Reading Co. attribution row, language picker and legal
// links. Rendered from there rather than kept as a second, stale copy here.
function Footer() {
  return <JoyfulFooter app={APPS.find((a) => a.id === 'beanstack')} />
}

/**
 * `extraTabs`, `renderExtra`, `railTop` and `view`/`onView` are optional and
 * additive — they let another prototype hang its own tab (and rail card) off
 * this real dashboard instead of cloning it. Words with Benny uses them to put
 * "My Words" next to the Reading Log. Left off, the page is exactly as it was.
 *
 * `hideTabs` drops built-in tabs by id, for when an extra tab supersedes one
 * (Words with Benny folds "All Badges" into its own Collections tab).
 *
 * `ownTabs` is the other half of that: built-in tab ids the parent renders
 * itself, through the same `renderExtra`. Four of the six tabs in the real nav
 * (Friends, Leaderboards, Reviews, All Badges) have never had a page here, and
 * `extraTabs` could only ever *add* a seventh — so web-app claims them by id
 * rather than hiding them and appending look-alikes in the wrong order.
 *
 * `partners` is the list of reading apps this prototype offers to link. It
 * defaults to logging-flow's own CONNECTION_LIST; pass `[]` and the entire
 * integration surface drops out — the connect banner, the topbar switcher, the
 * "logged for you" rail card, and the App Integrations settings section.
 *
 * `titlesView={false}` is passed straight through to the Reading Log: it drops
 * "All Titles" from that page's view switcher. `logEntries` is too, for a
 * prototype whose log isn't logging-flow's own — web-app has no Scholastic, so
 * its log must not carry Scholastic sessions either.
 *
 * `onOpenChallenge` makes the challenge cards go somewhere. They have always
 * been buttons; a prototype that has built the challenge page passes this and
 * they open it. Left off, they stay inert. `onUnenrollChallenge` is the same
 * shape for the card's "Un-enroll" kebab, which a challenge only shows when it
 * is both `canSelfUnenroll` and there is something to call. `page` is where what they open goes:
 * a node that replaces the main column outright while the reader's nav stays
 * put — a destination that isn't one of the tabs.
 *
 * `logTabs` / `renderLogTab` are the same additive pair one level down: an
 * extra sub-tab on the Reading Log's own strip, after the log itself — web-app
 * puts its Wish List and Book Lists there.
 *
 * `onOpenBook` / `bookFor` go through to the log as well: where a prototype has
 * a book page, every logged title links to it.
 *
 * `personalize` is the same additive shape for the settings page: hand it the
 * reader's saved filters, the vocabularies behind them and the site's own
 * gates, and Personalize Reader grows its real Preferences list and the forms
 * behind it. Left off, that page is the single Basic Information row every
 * prototype rendering this for its App Integrations has always had.
 */
export function Dashboard({
  streak,
  dailyGoal,
  onLog,
  onReview,
  connections,
  onLinkPartner,
  onDisconnectPartner,
  onVisitPartner,
  extraTabs = [],
  renderExtra,
  railTop,
  view: viewProp,
  onView: onViewProp,
  hideTabs = [],
  ownTabs = [],
  partners = CONNECTION_LIST,
  titlesView = true,
  logEntries,
  /* Every surface built on this Dashboard shows logging-flow's own log, whole
     or filtered, so they all inherit the run that log begins part-way through.
     A prototype with a different log calls `ReadingLog` itself and gets 0. */
  streakSeed = STREAK_SEED,
  logTabs = [],
  renderLogTab,
  logTab,
  onLogTab,
  onOpenBook,
  bookFor,
  /* `(book) => boolean` — passed straight to the log's All Titles shelf, where
     it decides which jackets wear the read-now dot. */
  readNow,
  personalize,
  /* The site's registration questions, and what this profile has already
     answered. Left off, joining a challenge is the one press it was. */
  registrationQuestions = [],
  registrationAnswers,
  onRegistrationAnswers,
  /* The site's read-a-thon, if it is running one. Given, the nav grows a
     Fundraisers tab and the parent renders it from `renderExtra`. */
  fundraiser,
  /* Who is reading, and — on a library site — the account's other profiles. A
     library account holds one or many profiles and the pill switches between
     them; a school is one-to-one and has nobody to switch to. Left off, this is
     logging-flow's own single reader and its own picker list. */
  reader = READER,
  otherReaders = OTHER_READERS.filter((r) => r.id !== READER.id),
  onSwitchReader,
  accountLabel,
  /* The account behind the profiles — `user#edit`, the page the gear opens on a
     library site. Given, the gear goes there; left off (a school, where there is
     no account above the reader) it goes to Personalize Reader as it always
     has. Same additive shape as `personalize` one line down. */
  account,
  /* The activity badges the reader could be ticking things off in, and how to
     tick one — `profile_has_current_learning_tracks?`. Given, the top bar grows
     its **Complete Activity** button and this is what it opens; left off, the
     app doesn't offer it, which is what the app does. */
  activities,
  onOpenChallenge,
  onUnenrollChallenge,
  motivation,
  features = {},
  friendRequests = [],
  onAcceptFriend,
  onDeclineFriend,
  page,
}) {
  const [scope, setScope] = useState('current')

  // The page's four lists, the way the app splits them: what you're in, what
  // else is open to you, what has ended, what you've ignored. They move between
  // each other, so they're state rather than the imported fixtures.
  const [joined, setJoined] = useState(CHALLENGES)
  const [available, setAvailable] = useState(MORE_CHALLENGES)
  const [ignored, setIgnored] = useState([])
  const [connectedChallenges, setConnected] = useState(CONNECTED_CHALLENGES)
  const [joining, setJoining] = useState(null)
  const [leaving, setLeaving] = useState(null)
  const [codeOpen, setCodeOpen] = useState(false)
  const [reminded, setReminded] = useState(true)
  const [showGoal, setShowGoal] = useState(true)

  // Un-enrolling drops the challenge out of the reader's list and back into
  // what's available — the app's own "Un-enroll". `onUnenrollChallenge` is the
  // parent's chance to react.
  function leaveChallenge(challenge) {
    setJoined((cs) => cs.filter((c) => c.id !== challenge.id))
    setAvailable((cs) => (cs.some((c) => c.id === challenge.id) ? cs : [...cs, challenge]))
    setLeaving(null)
    onUnenrollChallenge?.(challenge)
  }

  function joinChallenge(challenge) {
    setJoined((cs) => (cs.some((c) => c.id === challenge.id) ? cs : [...cs, challenge]))
    setAvailable((cs) => cs.filter((c) => c.id !== challenge.id))
    setIgnored((cs) => cs.filter((c) => c.id !== challenge.id))
    setConnected((cs) => cs.filter((c) => c.id !== challenge.id))
    setJoining(null)
  }

  // "Not Interested" — the app's dismiss. It goes to Ignored, not away.
  function ignoreChallenge(challenge) {
    setIgnored((cs) => (cs.some((c) => c.id === challenge.id) ? cs : [...cs, challenge]))
    setAvailable((cs) => cs.filter((c) => c.id !== challenge.id))
    setConnected((cs) => cs.filter((c) => c.id !== challenge.id))
    setJoining(null)
  }

  // A code names a challenge that isn't listed; matching one joins it.
  function redeemCode(code) {
    const match = [...available, ...ignored].find(
      (c) =>
        c.id.toLowerCase() === code.toLowerCase() || c.title.toLowerCase() === code.toLowerCase(),
    )
    if (!match) return false
    joinChallenge(match)
    setCodeOpen(false)
    setScope('current')
    return true
  }

  const upcoming = joined.some((c) => c.upcoming)

  // Each of these is a real per-site setting; on unless a prototype says not.
  const {
    readingGoals = true,
    leaderboards = true,
    challengeCode = true,
    connectedSite = true,
    communityGoal = null,
  } = features
  // 'challenges' | 'settings' | 'account' | 'log' | any `extraTabs` id — the
  // gear opens the account's own page where there is one and the reader's
  // Personalize Reader page where there isn't; "Manage connections" always goes
  // to the reader's, since App Integrations live there. The Reading Log tab
  // opens the log itself. A parent can
  // drive the view instead, to deep-link straight to one of its extra tabs.
  const [viewState, setViewState] = useState('challenges')
  const viewRaw = viewProp ?? viewState
  // A school has no account above the reader. If the site changes under someone
  // standing on the account page — the preview bar's own Library/School switch
  // does exactly that — they land on the reader's settings rather than on a
  // page with nothing behind it.
  const view = viewRaw === 'account' && !account ? 'settings' : viewRaw
  const setView = onViewProp ?? setViewState
  const extraIds = extraTabs.map((t) => t.id)
  // A site running a read-a-thon gets a nav entry for it, ahead of Challenges —
  // `display_fundraisers_nav_link`, which the app shows only where there is an
  // active fundraiser. It is a destination, not something you reach from a
  // banner you have already dismissed.
  //
  // Singular, where the app's own link says "Fundraisers": a site has one
  // running at a time (`active_fundraiser_id`), and the link goes straight to
  // that one's page. A plural tab promises a list that doesn't exist.
  const tabs = fundraiser
    ? [{ id: 'fundraisers', label: 'Fundraiser' }, ...READER_TABS]
    : READER_TABS
  // A view the parent renders rather than this component: its own extra tabs,
  // plus any built-in tab it has claimed.
  const owned = (id) =>
    extraIds.includes(id) || ownTabs.includes(id) || (id === 'fundraisers' && Boolean(fundraiser))
  // One banner covers every partner still to link, so waving it off is one
  // decision rather than one per app.
  const [dismissed, setDismissed] = useState(false)
  const [activityOpen, setActivityOpen] = useState(false)

  const toLink = dismissed ? [] : partners.filter((p) => !connections[p.id])

  return (
    <div className="wa-shell">
      {/* The partner app switcher sits ahead of the reader pill — "swap between
          the two at any time using the logo in the top right." */}
      <ReaderTopBar
        reader={reader}
        otherReaders={otherReaders}
        onSwitchReader={onSwitchReader}
        /* The gear is the account's; a profile's own settings are behind the
           Edit beside its name in the pill. On a school site there is no
           account, so the gear is the reader's own and there is no pill to
           reach them from. */
        onEditReader={() => setView('settings')}
        accountLabel={accountLabel}
        onLog={onLog}
        onReview={onReview}
        onActivity={activities ? () => setActivityOpen(true) : undefined}
        onHome={() => setView('challenges')}
        onAccount={() => setView(account ? 'account' : 'settings')}
        beforeUser={
          <PartnerSwitcher
            partners={partners}
            connections={connections}
            onManage={() => setView('settings')}
            onVisit={onVisitPartner}
          />
        }
        tabs={tabs}
        active={['challenges', 'settings', 'account'].includes(view) ? 'challenges' : view}
        onTabChange={(id) => setView(id === 'log' || owned(id) ? id : 'challenges')}
        extraTabs={extraTabs}
        hideTabs={hideTabs}
      />
      {activities && (
        <CompleteActivity
          open={activityOpen}
          onClose={() => setActivityOpen(false)}
          {...activities}
        />
      )}
      <main className="wa-main">
        <div className="wa-main-inner">
          {page ? (
            page
          ) : owned(view) ? (
            renderExtra?.(view)
          ) : view === 'log' ? (
            <ReadingLog
              entries={logEntries}
              streakSeed={streakSeed}
              partners={partners}
              titlesView={titlesView}
              /* The goal is the site's, so the log shows it wherever the rail
                 card does — the same switch turns both on. */
              goal={readingGoals ? dailyGoal?.goal : undefined}
              extraTabs={logTabs}
              renderExtra={renderLogTab}
              tab={logTab}
              onTab={onLogTab}
              onOpenBook={onOpenBook}
              bookFor={bookFor}
              readNow={readNow}
            />
          ) : view === 'account' ? (
            <AccountSettings title={accountLabel} {...account} />
          ) : view === 'settings' ? (
            <PersonalizeReader
              reader={reader}
              partners={partners}
              connections={connections}
              onLink={onLinkPartner}
              onDisconnect={onDisconnectPartner}
              {...personalize}
            />
          ) : (
            <>
              {/* A reader with a lot going on could land on five or six of
                  these before reaching the page, so the stack shows two and
                  folds the rest away. Order is the app's own. */}
              <BannerStack className="wa-main-banners">
                <ConnectBanner
                  partners={toLink}
                  onLink={onLinkPartner}
                  onDismiss={() => setDismissed(true)}
                />
                {friendRequests?.length > 0 && (
                  <FriendRequests
                    requests={friendRequests}
                    onAccept={onAcceptFriend}
                    onDecline={onDeclineFriend}
                  />
                )}
                {communityGoal && showGoal && (
                  <CommunityGoalBanner {...communityGoal} onDismiss={() => setShowGoal(false)} />
                )}
                <StreakBanner
                  streak={streak}
                  onLog={onLog}
                  /* The streak is the reading log's calendar — every day you
                     logged, with the goal's star on the ones that met it. */
                  onViewStreaks={() => {
                    setView('log')
                    onLogTab?.('log')
                  }}
                />
              </BannerStack>
              <div className="wa-layout">
                <section className="wa-content">
                  <div className="wa-section-head">
                    <h2 className="wa-h2">Challenges</h2>
                    <div className="wa-section-actions">
                      <ChallengeScope value={scope} onChange={setScope} />
                      {challengeCode && (
                        <Button variant="secondary" size="sm" onClick={() => setCodeOpen(true)}>
                          Enter Code
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* The app's own reminder, while a challenge you're in hasn't
                      started yet — logging before the start date doesn't count. It
                      is about the list under it, so it sits in the column with the
                      challenges rather than across the page. */}
                  {upcoming && reminded && (
                    <InfoBox
                      icon={<Icon name="bulb" size={26} />}
                      title="Just a reminder…"
                      onDismiss={() => setReminded(false)}
                      className="wa-reminder"
                    >
                      In order for logging to count towards a challenge, it must be done on or after
                      the challenge&apos;s start date. You can find the start date beneath the
                      title.
                    </InfoBox>
                  )}

                  {scope === 'current' && (
                    <>
                      <div className="wa-group">
                        <SectionHead
                          title={`${READER.name}'s Challenges`}
                          sub={`Challenges that ${READER.name} is participating in.`}
                        />
                        {joined.length > 0 ? (
                          <div className="wa-chgrid">
                            {joined.map((c) => (
                              <ChallengeCard
                                key={c.id}
                                challenge={c}
                                onOpen={onOpenChallenge}
                                onUnenroll={setLeaving}
                              />
                            ))}
                          </div>
                        ) : (
                          <EmptyState
                            variant="dashed"
                            title="No challenges yet"
                            description="You're not currently participating in any challenges."
                          />
                        )}
                      </div>

                      {/* "More Challenges — Other available challenges." Opening
                          one is the join modal, not the challenge page: you
                          can't read a challenge you haven't joined. */}
                      <div className="wa-group">
                        <SectionHead title="More Challenges" sub="Other available challenges." />
                        <div className="wa-chgrid">
                          {available.map((c) => (
                            <ChallengeCard key={c.id} challenge={c} onOpen={setJoining} />
                          ))}
                          {challengeCode && (
                            <div className="wa-codecard">
                              <div className="wa-codecard-inner">
                                <div className="wa-codecard-head">Got a challenge code?</div>
                                <Button variant="secondary" onClick={() => setCodeOpen(true)}>
                                  Enter Challenge Code
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* A reader at a school inside a district can see and join
                          the challenges its connected site is running. They open
                          over there, which is why the app gives them their own
                          section rather than mixing them into More Challenges. */}
                      {connectedSite && connectedChallenges.length > 0 && (
                        <div className="wa-group">
                          <SectionHead title={`Challenges at ${CONNECTED_SITE}`} />
                          <div className="wa-chgrid">
                            {connectedChallenges.map((c) => (
                              <ChallengeCard key={c.id} challenge={c} onOpen={setJoining} />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {scope === 'past' && (
                    <div className="wa-group">
                      <SectionHead
                        title="Past Challenges"
                        sub={
                          PAST_CHALLENGES.length > 0
                            ? `Challenges that ${READER.name} took part in, which have now ended.`
                            : undefined
                        }
                      />
                      {PAST_CHALLENGES.length > 0 ? (
                        <div className="wa-chgrid">
                          {PAST_CHALLENGES.map((c) => (
                            <ChallengeCard key={c.id} challenge={c} onOpen={onOpenChallenge} />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          variant="dashed"
                          title="Nothing here yet"
                          description={`${READER.name} has not completed any challenges yet.`}
                        />
                      )}
                    </div>
                  )}

                  {scope === 'ignored' && (
                    <div className="wa-group">
                      <SectionHead
                        title="Ignored Challenges"
                        sub={
                          ignored.length > 0 ? `Challenges ${READER.name} has ignored.` : undefined
                        }
                      />
                      {ignored.length > 0 ? (
                        <div className="wa-chgrid">
                          {ignored.map((c) => (
                            <ChallengeCard key={c.id} challenge={c} onOpen={setJoining} />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          variant="dashed"
                          title="Nothing ignored"
                          description={`${READER.name} has not ignored any challenges yet.`}
                        />
                      )}
                    </div>
                  )}
                </section>
                <div className="wa-rail">
                  {railTop}
                  {/* The app's rail order: the RMI nudge, then the goal, then
                      the leaderboard. Gated on RMI being on for the site. The
                      fundraiser goes in above the leaderboard — a site running
                      one says so on every page, and a standing figure belongs
                      with the other standing figures rather than in the banner
                      stack, where waving it off took the total with it. */}
                  {motivation && <MotivationCard state={motivation} />}
                  {readingGoals && <GoalCard dailyGoal={dailyGoal} />}
                  <AutoLoggedCard
                    className="wa-card"
                    rows={partners.length ? autoLoggedRows(connections, BOOKS) : []}
                  />
                  {fundraiser && (
                    <FundraiserCard
                      raised={fundraiser.raised}
                      goal={fundraiser.goal}
                      onLearnMore={() => setView('fundraisers')}
                    />
                  )}
                  {leaderboards && <LeaderboardCard schools={TOP_SCHOOLS} grades={TOP_GRADES} />}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />

      <JoinChallenge
        challenge={joining}
        ignored={joining ? ignored.some((c) => c.id === joining.id) : false}
        onClose={() => setJoining(null)}
        onJoin={joinChallenge}
        onDismiss={ignoreChallenge}
        questions={registrationQuestions}
        answers={registrationAnswers}
        onAnswer={onRegistrationAnswers}
      />
      <ConfirmUnenroll
        challenge={leaving}
        onClose={() => setLeaving(null)}
        onConfirm={leaveChallenge}
      />
      <ChallengeCodeModal
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        onSubmit={redeemCode}
      />
    </div>
  )
}
