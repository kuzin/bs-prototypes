/**
 * Fidelity assertions — the mobile system's computed CSS against the React Native source it
 * mirrors.
 *
 * "It looks right" is not a check. Every entry below names a real style value in
 * `zoobean/beanstack_mobile` and the file it came from, so a mismatch is a factual claim that can
 * be settled by opening that file rather than by argument. Run it with `checkFidelity()` against a
 * rendered page (see mobile/fidelity.js).
 *
 * Only values that are LITERAL in the source belong here. Anything we translated on purpose —
 * the FAB's lift, the streak card's negative-margin scaffolding — is listed in `DEVIATIONS` at the
 * bottom instead, so the two never get confused.
 */

export const FIDELITY = [
  // ── Bottom tab bar ──────────────────────────────────────────────────────
  {
    group: 'TabBar',
    source: 'navigation/BeanstackTabs.tsx · styles/BeanstackTabsStyles.ts',
    selector: '.m-tabbar',
    expect: { paddingTop: '14px', height: '88px' }, // 54 + 34 safe-bottom
  },
  {
    group: 'TabBar',
    source: 'components/TabNavigatorIcon.jsx · styles.tabContainer',
    selector: '.m-tab',
    expect: { width: '65px', paddingTop: '4px' },
  },
  {
    group: 'TabBar',
    source: 'components/TabNavigatorIcon.jsx · styles.title',
    selector: '.m-tab-label',
    expect: {
      fontSize: '10px',
      fontWeight: '500',
      letterSpacing: '-0.24px',
      lineHeight: '12px',
      marginTop: '4px',
    },
  },
  {
    group: 'TabBar',
    source: 'components/TabNavigatorIcon.jsx · styles.redIcon',
    selector: '.m-tab-badge',
    expect: { height: '18px', minWidth: '18px', borderRadius: '9px', right: '10px', top: '-5px' },
  },
  {
    group: 'TabBar',
    source: 'BeanstackTabsStyles.tabIcon',
    selector: '.m-tab-icon',
    expect: { width: '24px', height: '24px' },
  },

  // ── Top tabs ────────────────────────────────────────────────────────────
  {
    group: 'TopTabs',
    source: 'logTabNavigator/LogTabNavigatorStyles.ts · tabBar',
    selector: '.m-toptabs',
    expect: { height: '56px' },
  },
  {
    group: 'TopTabs',
    source: 'navigation/styles/TabStyles.ts · tabWrapper',
    selector: '.m-toptab',
    expect: { paddingLeft: '12px', paddingRight: '12px' },
  },
  {
    group: 'TopTabs',
    source: 'navigation/styles/TabStyles.ts · tabTitle',
    selector: '.m-toptab-label',
    expect: { fontSize: '16px', fontWeight: '700' },
  },
  {
    group: 'TopTabs',
    source: 'navigation/styles/TabStyles.ts · indicator',
    selector: '.m-toptab-indicator',
    expect: { height: '3px', borderRadius: '3px', bottom: '0px' },
  },

  // ── PlusMenu ────────────────────────────────────────────────────────────
  {
    group: 'PlusMenu',
    source: 'circularMenu/actionButton/ActionButton.styles.ts · fabCircle (SIZE 56, radius 24)',
    selector: '.m-plus-fab',
    expect: { width: '56px', height: '56px', borderRadius: '24px' },
  },
  {
    group: 'PlusMenu',
    source: 'circularMenu/actionButtonItem/ActionButtonItem.styles.ts · iconContainer',
    selector: '.m-plus-item-icon',
    expect: { width: '64px', height: '64px', borderRadius: '27px', marginBottom: '16px' },
  },
  {
    group: 'PlusMenu',
    source: 'ActionButtonItem.styles.ts · label',
    selector: '.m-plus-item-label',
    expect: {
      width: '100px',
      fontSize: '14px',
      fontWeight: '700',
      letterSpacing: '0.22px',
      lineHeight: '17px',
    },
  },

  // ── Header ──────────────────────────────────────────────────────────────
  {
    group: 'Header',
    source: 'navigation/styles/NavigationStyles.ts · HEADER_HEIGHT',
    selector: '.m-header',
    expect: { height: '60px' },
  },

  // ── Section header ──────────────────────────────────────────────────────
  {
    group: 'SectionHeader',
    source: 'components/home/shared/Header/Header.styles.ts · sectionHeaderContainer',
    selector: '.m-secthead',
    expect: { marginLeft: '21px', marginRight: '18px' },
  },
  {
    group: 'SectionHeader',
    source: 'Header.styles.ts · viewAllText',
    selector: '.m-secthead-all',
    expect: {
      fontSize: '14px',
      fontWeight: '700',
      letterSpacing: '-0.28px',
      lineHeight: '17px',
    },
  },

  // ── DailyGoalBanner ─────────────────────────────────────────────────────
  {
    group: 'DailyGoalBanner',
    source: 'components/shared/DailyGoalBanner.styles.ts · card',
    selector: '.m-dgb',
    expect: { padding: '24px', borderRadius: '16px', marginBottom: '16px' },
  },
  {
    group: 'DailyGoalBanner',
    source: 'DailyGoalBanner.styles.ts · trackContainer',
    selector: '.m-dgb-track',
    expect: { height: '32px', borderRadius: '32px' },
  },
  {
    group: 'DailyGoalBanner',
    source: 'DailyGoalBanner.styles.ts · starContainer',
    selector: '.m-dgb-star',
    expect: { width: '32px', height: '32px', borderRadius: '16px', marginLeft: '-2px' },
  },
  {
    group: 'DailyGoalBanner',
    source: 'DailyGoalBanner.styles.ts · connector',
    selector: '.m-dgb-connector',
    expect: { width: '12px', height: '12px', marginLeft: '-2px' },
  },

  // ── Home ────────────────────────────────────────────────────────────────
  {
    group: 'Home',
    source: 'screens/home/Home.tsx · container + contentContainerStyle',
    selector: '.m-home',
    expect: { paddingBottom: '58px', backgroundColor: 'rgb(255, 255, 255)' },
  },
  {
    group: 'Home',
    source: 'components/home/EmptyHomeContainer.tsx · marginTop 56',
    selector: '.m-home-section:not(.m-home-section--challenges)',
    expect: { marginTop: '56px' },
  },
  {
    group: 'Home',
    source: 'Home.tsx · challengeListContainer marginTop -20, against the section 56',
    selector: '.m-home-section--challenges',
    expect: { marginTop: '36px' },
  },
  {
    group: 'ChallengeCarouselCard',
    source: 'components/home/ChallengeCarouselCard.tsx · styles.card',
    selector: '.m-cc',
    expect: { width: '278px', marginRight: '16px', marginTop: '27px' },
  },
  {
    group: 'ChallengeCarouselCard',
    source: 'ChallengeCarouselCard.tsx · styles.bannerBox',
    selector: '.m-cc-banner',
    expect: { width: '278px', height: '106px', borderRadius: '16px' },
  },
  {
    group: 'ChallengeCarouselCard',
    source: 'ChallengeCarouselCard.tsx · styles.title / styles.dates',
    selector: '.m-cc-title',
    expect: { marginTop: '16px' },
  },
  {
    group: 'ChallengeCarouselCard',
    source: 'ChallengeCarouselCard.tsx · styles.dates',
    selector: '.m-cc-dates',
    expect: { marginTop: '5px' },
  },
  {
    group: 'BookList',
    source: 'components/home/styles/Styles.tsx · bookListContainer',
    selector: '.m-home-book',
    expect: { marginRight: '16px', marginTop: '24px', borderRadius: '8px' },
  },
  {
    group: 'BookList',
    source: 'components/home/BookList.tsx · BookImage height 197 width 131',
    selector: '.m-home-cover',
    expect: { width: '131px', height: '197px' },
  },

  // ── MyStats ─────────────────────────────────────────────────────────────
  {
    group: 'MyStats',
    source:
      'MyStatsStyles.tsx · container — a fixed 489pt at a 17pt radius with 31/20 padding. ' +
      'DIVERGENCES: sized to its CONTENT (the fixed height let `flex: 1` on the list spread ' +
      'whatever was left between four rows, so the gaps were a leftover that would change if a ' +
      'stat were added), and on the shared card radius and padding with the rest of Home.',
    selector: '.m-mystats',
    expect: {
      borderRadius: '16px',
      paddingTop: '20px',
      paddingLeft: '20px',
      marginLeft: '20px',
    },
  },
  {
    group: 'MyStats',
    source:
      'MyStatsStyles.tsx · imageItemContainer — 48pt at radius 20. DIVERGENCE: 40/16, matching ' +
      'StatCard, so a stat tile is one size wherever it appears.',
    selector: '.m-mystats-tile',
    expect: { width: '40px', height: '40px', borderRadius: '16px' },
  },
  {
    group: 'MyStats',
    source:
      'MyStatsStyles.tsx · listItemContainer — a 24pt bottom margin. DIVERGENCE: 12pt padding ' +
      'top and bottom with a rule BETWEEN rows, so the line sits midway between two rows rather ' +
      'than hugging one, and the first and last rows take no rule at all.',
    selector: '.m-mystats-row',
    expect: { paddingTop: '12px', paddingBottom: '12px' },
  },
  {
    group: 'MyStats',
    source: 'MyStatsStyles.tsx · listContainer — 13pt padding; the rows carry the rhythm now.',
    selector: '.m-mystats-row + .m-mystats-row',
    expect: { borderTopWidth: '1px', borderTopColor: 'rgb(224, 224, 224)' },
  },
  {
    group: 'MyStats',
    source:
      'MyStatsStyles.tsx · buttonContainer — 56pt at a 15pt radius. DIVERGENCE: on the shared ' +
      'PressableButton at `medium`, with every other card CTA on Home. A taller, rounder button ' +
      'than the fundraiser\u2019s and the motivator card\u2019s for the same kind of action.',
    selector: '.m-mystats .m-btn',
    expect: { minHeight: '40px', borderRadius: '10px' },
  },
  {
    group: 'MyStats',
    source: 'MyStatsStyles.tsx · textItem',
    selector: '.m-mystats-title',
    expect: { marginLeft: '16px', fontWeight: '500' },
  },

  // ── HomeBadges ──────────────────────────────────────────────────────────
  {
    group: 'HomeBadges',
    source: 'components/badges/Badge/Badge.styles.ts · circleBtn',
    selector: '.m-hbadge',
    expect: { width: '87px', height: '87px', borderRadius: '68px', marginLeft: '20px' },
  },
  {
    group: 'HomeBadges',
    source: 'components/badges/Badges.tsx · contentContainerStyle marginTop CONTAINER_SPACE',
    selector: '.m-hbadges',
    expect: { marginTop: '20px' },
  },

  // ── StreaksMessage ──────────────────────────────────────────────────────
  {
    group: 'StreaksMessage',
    source: 'components/home/styles/StreaksMessageStyles.js · streaksContainer',
    selector: '.m-streak',
    // DIVERGENCE — content-sized, and padded on all four sides. The source's 144pt floor and
    // left/right-only padding were a canvas for the corner art, which this card no longer draws.
    expect: {
      borderRadius: '16px',
      paddingTop: '20px',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingBottom: '20px',
      marginBottom: '16px',
    },
  },
  {
    group: 'StreaksMessage',
    source: 'StreaksMessageStyles.js · title',
    selector: '.m-streak-title',
    // DIVERGENCE — `.m-card-title`. Source 18/800/19 with a 10pt gap and `width: 95%`; the shared
    // Home card pair is 17/700/22 with a 2pt gap, and the 95% reserve went with the corner art.
    expect: {
      fontSize: '17px',
      fontWeight: '700',
      lineHeight: '22px',
      marginBottom: '0px',
    },
  },
  {
    group: 'StreaksMessage',
    source: 'StreaksMessageStyles.js · message',
    selector: '.m-streak-message',
    // `.m-card-sub`. The source's `marginRight: 20%` was a reserve for the corner art.
    expect: {
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '18px',
      marginRight: '0px',
    },
  },
  {
    group: 'StreaksMessage',
    source: 'StreaksMessageStyles.js · flameView (bg brandColors.red)',
    selector: '.m-streak-flame',
    expect: {
      borderRadius: '24px',
      paddingTop: '6px',
      paddingLeft: '12px',
      backgroundColor: 'rgb(232, 86, 72)',
    },
  },
  {
    group: 'StreaksMessage',
    source: 'StreaksMessageStyles.js · viewStreaks (brandColors.red)',
    selector: '.m-streak-link',
    expect: {
      fontSize: '14px',
      fontWeight: '700',
      lineHeight: '16px',
      letterSpacing: '-0.28px',
      color: 'rgb(232, 86, 72)',
    },
  },
  // DIVERGENCE — `closeIconAbsolute` is gone. It was the only dismissible card on Home, and it
  // dismissed the one congratulating the reader; `onClose` stays in the API.

  // ── PendingBookTalks ────────────────────────────────────────────────────
  {
    group: 'PendingBookTalks',
    source:
      'bookTalks/pendingBookTalksConversation/PendingBookTalksConversationStyles.ts — 52pt at an ' +
      '8pt radius on colonialWhite, with its own 24/16 vertical margins. DIVERGENCES, all of ' +
      'them Home-wide rather than about this card: one card radius, the PAGE owns the vertical ' +
      'rhythm, and the colonialWhite fill becomes plain white, because on the home grey it is ' +
      'barely a step from the ground and it repeats the yellow of the illustration below it. ' +
      'A yellow left bar and a yellow border were both tried in its place and both left this the ' +
      'one card on Home wearing a status colour, for a row that is a shortcut, not a warning — ' +
      'so it is a white card like its neighbours, found by Benny and the bold label.',
    selector: '.m-pbt',
    expect: {
      height: '52px',
      borderRadius: '16px',
      paddingLeft: '16px',
      paddingRight: '18px',
      backgroundColor: 'rgb(255, 255, 255)',
      borderTopWidth: '0px',
    },
  },
  {
    group: 'PendingBookTalks',
    source: 'PendingBookTalksConversationStyles.ts · text',
    selector: '.m-pbt-text',
    expect: { marginLeft: '8px' },
  },

  // ── MotivatorSurveyCard ─────────────────────────────────────────────────
  {
    group: 'MotivatorSurveyCard',
    source: 'components/MotivatorSurveyCard.tsx · styles.container (gutter 16, NOT 20)',
    selector: '.m-msc',
    expect: {
      padding: '24px',
      borderRadius: '16px',
      marginLeft: '16px',
      marginRight: '16px',
      marginTop: '12px',
      marginBottom: '12px',
    },
  },
  {
    group: 'MotivatorSurveyCard',
    source: 'MotivatorSurveyCard.tsx · styles.characterContainer',
    selector: '.m-msc-character',
    expect: { height: '96px', borderRadius: '10px', marginBottom: '16px' },
  },
  {
    group: 'MotivatorSurveyCard',
    source:
      'MotivatorSurveyCard.tsx · styles.button — 56pt at a 16pt radius on a hardcoded blueB6 ' +
      '#1A6DD5. DIVERGENCE: the shared PressableButton at `medium`, which is also how it picks up ' +
      'the tenant accent instead of one card\u2019s hardcoded blue. All four card CTAs on Home are ' +
      'this size now — the source runs 40 and 56 for the same kind of action.',
    selector: '.m-msc .m-btn',
    expect: { minHeight: '40px', borderRadius: '10px' },
  },
  {
    group: 'MotivatorSurveyCard',
    source: 'MotivatorSurveyCard.tsx · styles.title / styles.subtitle',
    selector: '.m-msc-title',
    // `.m-card-title` — the source's own 17/700/22, now declared once for all of Home.
    expect: { fontSize: '17px', fontWeight: '700', lineHeight: '22px', marginBottom: '0px' },
  },
  {
    group: 'MotivatorSurveyCard',
    source: 'MotivatorSurveyCard.tsx · styles.subtitle',
    selector: '.m-msc-subtitle',
    // DIVERGENCE — line-height 18, not the source's 17.5. A fractional line box is a rounding
    // artefact, and it was the only sub on Home that did not sit on a whole pixel.
    expect: { fontSize: '14px', fontWeight: '500', lineHeight: '18px', marginTop: '2px' },
  },

  // ── FundraisersHomeCard ─────────────────────────────────────────────────
  {
    group: 'FundraisersHomeCard',
    source: 'fundraisers/homeCard/styles/FundraisersHomeCardStyles.js · container (gutter 24)',
    selector: '.m-fund',
    expect: {
      marginLeft: '24px',
      marginRight: '24px',
      marginTop: '24px',
      borderRadius: '17px',
      // DIVERGENCE — 20, the card's own gutter, in place of the source's 31.
      paddingBottom: '20px',
    },
  },
  {
    group: 'FundraisersHomeCard',
    source: 'HomeCardHeaderStyles.js · headerCurveContainer',
    selector: '.m-fund-band',
    expect: { height: '110px', borderRadius: '10px' },
  },
  // DIVERGENCE — `headerCurve` is gone. The band closed with a white curve that the banner then
  // punched up through, so the card's top was a wave, a gradient rectangle and a colour band
  // overlapping in three layers. A straight edge leaves the banner as the only thing up there.
  {
    group: 'FundraisersHomeCard',
    source: 'HomeCardHeaderStyles.js · headerImageContainer (marginTop -80, marginHorizontal 20)',
    selector: '.m-fund-banner',
    expect: { marginTop: '-80px', marginLeft: '20px', marginRight: '20px' },
  },
  {
    group: 'FundraisersHomeCard',
    source: 'FundraisersHomeCardStyles.js · content',
    selector: '.m-fund-content',
    // DIVERGENCE — 20 on top, matching the gutter, now that the hairline above it is gone.
    expect: { paddingTop: '20px', paddingLeft: '20px', paddingRight: '20px' },
  },
  {
    group: 'FundraisersHomeCard',
    source: 'MoneyRaisedStyles.js · currentAmount (24/900)',
    selector: '.m-fund-amount',
    // DIVERGENCE — 20/900. At 24 it outsized the card's own title and every section header on
    // Home; it only has to be the biggest thing inside its card.
    expect: { fontSize: '20px', fontWeight: '900', lineHeight: '24px', letterSpacing: '0.3px' },
  },
  {
    group: 'FundraisersHomeCard',
    source: 'MoneyRaisedStyles.js · sliderContainer / progressContainer',
    selector: '.m-fund-pct',
    expect: { marginLeft: '16px' },
  },
  {
    group: 'FundraisersHomeCard',
    source: 'MoneyRaisedStyles.js · progressText',
    selector: '.m-fund-pct-text',
    expect: { fontSize: '14px', fontWeight: '900', lineHeight: '20px', letterSpacing: '-0.22px' },
  },

  // ── ActivitiesList ──────────────────────────────────────────────────────
  {
    group: 'ActivitiesList',
    source: 'activities/activityItem/ActivityItem.styles.ts · backgroundViewLayout',
    selector: '.m-act',
    expect: { paddingTop: '16px', paddingBottom: '16px' },
  },
  {
    group: 'ActivitiesList',
    source: 'ActivityItem.styles.ts · badgeView (marginHorizontal 20)',
    selector: '.m-act-inner',
    expect: { marginLeft: '20px', marginRight: '20px' },
  },
  {
    group: 'ActivitiesList',
    source: 'ActivityItem.styles.ts · badgeImageView (76pt, 4pt ring)',
    selector: '.m-act-ring',
    expect: {
      width: '76px',
      height: '76px',
      borderRadius: '38px',
      borderTopWidth: '4px',
      marginRight: '20px',
    },
  },
  {
    group: 'ActivitiesList',
    source: 'ActivityItem.styles.ts · badgeImage',
    selector: '.m-act-disc',
    expect: { width: '56px', height: '56px', borderRadius: '28px' },
  },
  {
    group: 'ActivitiesList',
    source: 'ActivityItem.styles.ts · completedCheck',
    selector: '.m-act-check',
    expect: {
      width: '27px',
      height: '27px',
      borderTopWidth: '4px',
      bottom: '-4px',
      right: '-4px',
      backgroundColor: 'rgb(11, 168, 95)', // green
    },
  },
  {
    group: 'ActivitiesList',
    source: 'ActivityItem.styles.ts · challengeNameText',
    selector: '.m-act-name',
    expect: { marginBottom: '4px' },
  },

  // ── ReviewsList ─────────────────────────────────────────────────────────
  {
    group: 'ReviewsList',
    source: 'components/home/ReviewsList.tsx — inline styles on the card',
    selector: '.m-rev',
    expect: {
      width: '295px',
      height: '187px',
      padding: '24px',
      borderRadius: '10px',
      marginTop: '24px',
      marginRight: '16px',
      backgroundColor: 'rgb(242, 242, 242)', // lightestGray
    },
  },
  {
    group: 'ReviewsList',
    source: 'ReviewsList.tsx · fontStyles.button with lineHeight overridden to 21',
    selector: '.m-rev-title',
    expect: { fontSize: '16px', fontWeight: '700', lineHeight: '21px' },
  },
  {
    group: 'ReviewsList',
    source: 'ReviewsList.tsx · fontStyles.description, weight 500 on iOS, 8-line clamp',
    selector: '.m-rev-body',
    expect: { fontSize: '16px', fontWeight: '500', lineHeight: '22px', marginTop: '8px' },
  },

  // ── Reading Log ─────────────────────────────────────────────────────────
  // DIVERGENCE — the Reading Log's month row is the shared `MonthHeader` now, which is sized to
  // the Streaks calendar's header rather than its own. `ReadingLogHeaderStyles` had
  // `paddingVertical: 32` with a 22pt month; the two rows do the same job a tab apart, and 88pt
  // of a 852pt screen on the word "September" is not what the larger of the two buys. Covered by
  // the MonthHeader group below.
  {
    group: 'ReadingLog',
    source: 'sections/WeeklyLogHeaderStyles.ts · container (rules on BOTH edges)',
    selector: '.m-rl-week-header',
    expect: {
      marginLeft: '20px',
      marginRight: '20px',
      paddingTop: '8px',
      borderTopWidth: '1px',
      borderBottomWidth: '1px',
    },
  },
  {
    group: 'ReadingLog',
    source: 'sections/WeeklyLogStyles.ts · container',
    selector: '.m-rl-week',
    expect: { paddingTop: '12px', paddingLeft: '20px' },
  },
  {
    group: 'ReadingLog',
    source: 'sections/WeekdayStyles.ts · container + dayNumber',
    selector: '.m-rl-daynum',
    expect: { fontSize: '20px', fontWeight: '700', lineHeight: '25px', letterSpacing: '0.32px' },
  },
  {
    group: 'ReadingLog',
    source: 'WeekdayStyles.ts · streakContainer',
    selector: '.m-rl-streak',
    expect: {
      borderRadius: '16px',
      paddingTop: '6px',
      paddingLeft: '10px',
      marginTop: '8px',
      backgroundColor: 'rgb(252, 224, 214)', // orangeLight
    },
  },
  {
    group: 'ReadingLog',
    source: 'sections/WeekListItemStyles.ts · container (4pt left rule, 1pt white top)',
    selector: '.m-rl-session',
    expect: { borderRadius: '10px', borderLeftWidth: '4px', marginBottom: '4px' },
  },
  {
    group: 'ReadingLog',
    source: 'WeekListItemStyles.ts · titleText',
    selector: '.m-rl-session-title',
    expect: { fontSize: '14px', fontWeight: '700', lineHeight: '17px', letterSpacing: '-0.22px' },
  },
  {
    group: 'ReadingLog',
    source: 'WeekListItemStyles.ts · leftLine — invisible, but it reserves a 12pt inset',
    selector: '.m-rl-session-line',
    expect: { width: '12px', borderRadius: '2px' },
  },
  {
    group: 'ReadingLog',
    source: 'ReadingLog.tsx · BANNER_MARGIN_TOP',
    selector: '.m-rl-banner',
    expect: { marginTop: '32px' },
  },

  // ── All Titles ──────────────────────────────────────────────────────────
  {
    group: 'ToggleTabs',
    source: 'shared/toggleTabs/ToggleTabsStyles.ts · toggleContainer',
    // Book Talks passes `toggleTabExtraStyles` to zero the bottom margin, so the default is only
    // assertable on an instance that has NOT been overridden. Its override has its own assertion.
    selector: '.m-toggle:not(.m-bt-toggle)',
    expect: {
      marginTop: '32px',
      marginBottom: '16px',
      marginLeft: '20px',
      padding: '4px',
      borderRadius: '20px',
    },
  },
  {
    group: 'ToggleTabs',
    source: 'ToggleTabsStyles.ts · toggleItem / itemText',
    selector: '.m-toggle-item',
    expect: { height: '32px', borderRadius: '16px', fontSize: '14px', fontWeight: '700' },
  },
  {
    group: 'AllTitles',
    source: 'allTitles/AllTitlesStyles.ts · sectionHeader',
    selector: '.m-at-section',
    expect: {
      fontSize: '16px',
      fontWeight: '700',
      lineHeight: '20px',
      letterSpacing: '-0.3px',
      marginLeft: '20px',
      marginTop: '16px',
    },
  },
  {
    group: 'BookListItem',
    source: 'listItems/BookListItem.tsx · backgroundViewLayout + bookItem',
    selector: '.m-bli-item',
    expect: { paddingLeft: '20px', paddingRight: '20px' },
  },
  {
    group: 'BookListItem',
    source: 'BookListItem.tsx · BookImage 80×120',
    selector: '.m-bli-cover',
    expect: { width: '80px', height: '120px' },
  },
  {
    group: 'BookListItem',
    source: 'BookListItem.tsx · infoContainer',
    selector: '.m-bli-info',
    expect: { paddingLeft: '20px' },
  },
  {
    group: 'BookListItem',
    source: 'BookListItem.tsx · author',
    selector: '.m-bli-author',
    expect: { marginTop: '4px' },
  },
  {
    group: 'BookListItem',
    source: 'BookListItem.tsx · progressBarBackground / progressBar (6pt, radius 10)',
    selector: '.m-bli-track',
    expect: { height: '6px', borderRadius: '10px', marginRight: '16px' },
  },
  {
    group: 'BookListItem',
    source: 'BookListItem.tsx · smallTag (greenLight ground, radius 18)',
    selector: '.m-bli-tag',
    expect: {
      borderRadius: '18px',
      paddingTop: '5px',
      paddingLeft: '10px',
      marginTop: '16px',
      backgroundColor: 'rgb(219, 242, 231)',
    },
  },

  // ── Badges (list variant) ───────────────────────────────────────────────
  {
    group: 'Badge',
    source: 'badges/Badge/Badge.styles.ts · backgroundViewLayout + badgeView',
    selector: '.m-badge-view',
    expect: { marginLeft: '20px', marginRight: '20px' },
  },
  {
    group: 'Badge',
    source: 'Badge.styles.ts · badgeImageView (76pt, 4pt ring)',
    selector: '.m-badge-ring',
    expect: {
      width: '76px',
      height: '76px',
      borderRadius: '38px',
      borderTopWidth: '4px',
      marginRight: '20px',
    },
  },
  {
    group: 'Badge',
    source: 'Badge.styles.ts · badgeImage',
    selector: '.m-badge-art',
    expect: { width: '56px', height: '56px', borderRadius: '28px' },
  },
  {
    group: 'Badge',
    source: 'Badge.styles.ts · completedCheck (27pt, 4pt white border, notched -4/-4)',
    selector: '.m-badge-check',
    expect: {
      width: '27px',
      height: '27px',
      borderTopWidth: '4px',
      bottom: '-4px',
      right: '-4px',
      backgroundColor: 'rgb(11, 168, 95)',
    },
  },
  {
    group: 'Badge',
    source: 'Badge.styles.ts · challengeNameText (bodySmaller, greyDark3)',
    selector: '.m-badge-title',
    expect: { fontSize: '13px', fontWeight: '500', marginBottom: '4px' },
  },
  {
    group: 'Badge',
    source: 'Badge.tsx · fontStyles.titleRegular for the badge name',
    selector: '.m-badge-name',
    expect: { fontSize: '17px', fontWeight: '700', lineHeight: '22px' },
  },
  {
    group: 'Badge',
    source: 'Badge.styles.ts · badgeEarnedText (bodySmall, marginTop 4)',
    selector: '.m-badge-earned',
    expect: { fontSize: '14px', fontWeight: '500', marginTop: '4px' },
  },
  {
    group: 'Badge',
    source:
      'ChallengeBadgeStyles.js · badgeAwardTag is 40×28 with marginVertical 2 — the size of a ' +
      'stacked *Marker flag. DIVERGENCE: the flags are one horizontal chip of 16pt glyphs now, ' +
      'reusing the Challenge Overview art for the same three concepts.',
    selector: '.m-badge-marker',
    expect: { width: '16px', height: '16px' },
  },
  {
    group: 'Badge',
    source:
      'the chip sits IN THE FLOW, so it sizes to its own contents — the source pins badgeIconView ' +
      'to the right edge and reserves a fixed 44 (ICON_MARGIN_WITH_ICONS) for it, which a ' +
      'variable-width chip either overruns or leaves a hole in.',
    selector: '.m-badge-markers',
    expect: { position: 'static' },
  },
  {
    group: 'Badges',
    source: 'Badges.tsx · flatlistStyle paddingTop 24 + contentContainerStyle paddingBottom 34',
    selector: '.m-badges-list',
    expect: { paddingTop: '24px', paddingBottom: '34px' },
  },

  // ── Keyboard ────────────────────────────────────────────────────────────
  {
    group: 'Keyboard',
    source: 'iOS portrait keyboard — 291pt including the emoji/mic tray',
    selector: '.m-kb',
    expect: { height: '291px' },
  },

  // ── Book Talks ──────────────────────────────────────────────────────────
  {
    group: 'BookTalks',
    source: 'logScreens/bookTalks/BookTalksStyles.ts · sectionHeader (fontStyles.topLevelTitle)',
    selector: '.m-bt-section',
    expect: {
      fontSize: '16px',
      fontWeight: '700',
      marginTop: '32px',
      marginBottom: '16px',
      paddingLeft: '20px',
    },
  },
  {
    group: 'BookTalks',
    source: 'BookTalksStyles.ts · bookSection',
    selector: '.m-bt-row',
    expect: { paddingTop: '16px', paddingLeft: '20px', paddingRight: '20px' },
  },
  {
    group: 'BookTalks',
    source: 'BookTalksStyles.ts · itemSeparator — also used as the SECTION separator',
    selector: '.m-bt-rule',
    expect: { height: '1px', marginLeft: '20px', marginRight: '20px' },
  },
  {
    group: 'BookTalks',
    source: 'BookTalksStyles.ts · toggleTabExtraStyles zeroes ToggleTabs 16pt bottom margin',
    selector: '.m-bt-toggle',
    expect: { marginBottom: '0px' },
  },

  // ── Benny chat ──────────────────────────────────────────────────────────
  {
    group: 'BennyChat',
    source: 'bennyChatBubble/BennyChatBubbleStyles.ts · container',
    selector: '.m-bc-bubble',
    expect: { paddingTop: '10px', paddingLeft: '16px', borderRadius: '20px' },
  },
  {
    group: 'BennyChat',
    source: 'BennyChatBubbleStyles.ts · assistantHeadlineText',
    selector: '.m-bc-headline',
    expect: { fontSize: '16px', fontWeight: '700', marginBottom: '10px' },
  },
  {
    group: 'BennyChat',
    source: 'BennyChatBubbleStyles.ts · container backgroundColor greyLight3 (assistant)',
    selector: '.m-bc-assistant',
    expect: { backgroundColor: 'rgb(242, 242, 242)' },
  },
  {
    group: 'BennyChat',
    source:
      'bennyHeaderReaction/BennyHeaderReactionStyles.ts · logo — Benny is the header CENTRE. ' +
      'DIVERGENCE: the source draws it at 56, which fit the old 74pt header but crowds the ' +
      'shared 60pt bar to 2pt either side. Dropped to 48 by design decision, not by accident.',
    selector: '.m-bc-header .m-sheethead-slot--center img',
    expect: { width: '48px', height: '48px' },
  },
  {
    group: 'BennyChat',
    source: 'headerProgressBar/HeaderProgressBar.tsx — full width, 3pt, BELOW the header',
    selector: '.m-bc-progress',
    expect: { height: '3px' },
  },
  {
    group: 'BennyChat',
    source:
      'BennyChatTextInput.tsx · sendButtonStyle overrides the stylesheet: the disc is ' +
      'primaryColor (silverChalice while thinking), NOT the denim the stylesheet declares',
    selector: '.m-bc-send',
    expect: { width: '28px', height: '28px', borderRadius: '20px', bottom: '6px', right: '6px' },
  },
  {
    group: 'BennyChat',
    source: 'BennyChatTextInputStyles.ts · textInput (2pt borderGrey, radius 20, minHeight 40)',
    selector: '.m-bc-field > textarea',
    expect: { paddingRight: '40px', paddingTop: '10px' },
  },
  {
    group: 'BennyChat',
    source:
      'bennyChatHeader/BennyChatHeaderStyles.ts · container — on the shared SheetHeader now, so ' +
      'the 60pt height wins over the source\u2019s 12pt padding. The 1pt rule is this sheet\u2019s own, and ' +
      'the overlap goes back to 0 so the rule is not pulled under the progress bar.',
    selector: '.m-bc-header',
    expect: { height: '60px', marginBottom: '0px', borderBottomWidth: '1px' },
  },
  {
    group: 'BennyChat',
    source: 'BennyChatHeaderStyles.ts · finishLaterButton',
    selector: '.m-bc-later',
    expect: { height: '50px', paddingLeft: '8px', fontSize: '14px', lineHeight: '16px' },
  },
  {
    group: 'BennyChat',
    source: 'bennyChatTextInput/BennyChatTextInputStyles.ts · container',
    selector: '.m-bc-input',
    expect: { paddingTop: '12px', paddingLeft: '20px', borderTopWidth: '1px' },
  },
  {
    group: 'BennyChat',
    source: 'BennyChatTextInputStyles.ts · textInput (2pt borderGrey, radius 20, minHeight 40)',
    selector: '.m-bc-field textarea',
    expect: {
      borderTopWidth: '2px',
      borderRadius: '20px',
      minHeight: '40px',
      paddingLeft: '16px',
      borderTopColor: 'rgb(217, 217, 217)',
    },
  },

  // ── Badge detail (the `badgeDetail` modal) ──────────────────────────────
  {
    group: 'BadgeDetail',
    source: 'BadgeDetail.tsx · MODAL_HEADER_HEIGHT 60, MODAL_HEADER_OVERLAP -1',
    selector: '.m-bd .m-sheethead',
    expect: { height: '60px', marginBottom: '-1px' },
    // The header is painted with `backgroundColor`, the same expression the band gets. A literal
    // would only hold for one tenant, so assert the agreement instead.
    sameAs: { selector: '.m-bd-band', props: ['backgroundColor'] },
  },
  {
    group: 'BadgeDetail',
    source: 'ImageHeaderButton styles.button + getHeaderBackButton default { paddingRight: 50 }',
    selector: '.m-bd .m-sheethead-btn',
    expect: {
      paddingTop: '15px',
      paddingBottom: '15px',
      paddingRight: '50px',
      paddingLeft: '0px',
    },
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetailStyles.js · topColorFullHeight',
    selector: '.m-bd-band',
    expect: {
      height: '84px',
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '0px',
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
    },
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetailStyles.js · detailImageContainer (160, marginTop -160/2)',
    selector: '.m-bd-medallion',
    expect: {
      width: '160px',
      height: '160px',
      borderTopLeftRadius: '80px',
      marginTop: '-80px',
      backgroundColor: 'rgb(255, 255, 255)',
    },
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetailStyles.js · completedCircle (145, borderWidth 5)',
    selector: '.m-bd-ring',
    expect: {
      width: '145px',
      height: '145px',
      borderTopWidth: '5px',
      borderTopLeftRadius: '72.5px',
    },
  },
  {
    group: 'BadgeDetail',
    source: 'the ring border reports `earnedOn`: green when earned, greyLight2 when not',
    selector: '.m-bd-ring.is-earned',
    expect: { borderTopColor: 'rgb(11, 168, 95)' },
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetailStyles.js · detailImage (120)',
    selector: '.m-bd-art',
    expect: { width: '120px', height: '120px', borderTopLeftRadius: '60px' },
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetailStyles.js · completedCheck — 36pt, inset 1/1, 5pt white rim',
    selector: '.m-bd-check',
    expect: {
      width: '36px',
      height: '36px',
      borderTopLeftRadius: '18px',
      borderTopWidth: '5px',
      borderTopColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(11, 168, 95)',
      bottom: '1px',
      right: '1px',
    },
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetailStyles.js · detailTextContainer',
    selector: '.m-bd-text',
    expect: { paddingLeft: '20px', paddingRight: '20px', marginTop: '12px' },
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetailStyles.js · earnedText (greenDark)',
    selector: '.m-bd-earned',
    expect: { color: 'rgb(8, 117, 66)', marginTop: '4px' },
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetail.tsx inline — the summary takes 32pt only when awards follow it',
    selector: '.m-bd-summary.has-extras',
    expect: { marginBottom: '32px' },
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetail.tsx inline — { marginTop: 20 } around the pills',
    selector: '.m-bd-pills',
    expect: { marginTop: '20px' },
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetailStyles.js · awardsBlock — bleeds -20 with a rule on BOTH edges',
    selector: '.m-bd-awards',
    expect: {
      marginLeft: '-20px',
      marginRight: '-20px',
      paddingTop: '12px',
      paddingBottom: '12px',
      borderTopWidth: '1px',
      borderBottomWidth: '1px',
      borderTopColor: 'rgb(234, 234, 234)',
    },
  },
  {
    group: 'BadgeDetail',
    source: 'Award.styles.ts · container',
    selector: '.m-bd-award',
    expect: { paddingLeft: '20px', paddingTop: '12px', paddingBottom: '12px' },
  },
  {
    group: 'BadgeDetail',
    source: 'Award.styles.ts · icon (48, borderRadius 48, marginRight 20)',
    selector: '.m-bd-award-icon',
    expect: { width: '48px', height: '48px', borderTopLeftRadius: '48px', marginRight: '20px' },
  },
  {
    group: 'BadgeDetail',
    source: 'Award.styles.ts · textContainer marginTop 1, typeText marginBottom 2',
    selector: '.m-bd-award-type',
    expect: { marginBottom: '2px', color: 'rgb(101, 101, 101)' }, // greyDark3 #656565
  },

  // ── Achievements (Log tab) ──────────────────────────────────────────────
  {
    group: 'Achievements',
    source:
      'Achievements.styles.js · listLayout paddingTop 32 + listContentContainer paddingBottom 74',
    selector: '.m-ach-list',
    expect: {
      paddingTop: '32px',
      paddingBottom: '74px',
      // columnWrapperStyle paddingHorizontal 12, which styles the ROW — not each item.
      paddingLeft: '12px',
      paddingRight: '12px',
      // numColumns={3}. The widths assume the default 393pt device, as the safe-area
      // assertions above already do.
      gridTemplateColumns: '123px 123px 123px',
    },
  },
  {
    group: 'Achievements',
    source: 'Achievements.styles.js · columnWrapper paddingVertical 8, carried on the tile',
    selector: '.m-ach',
    expect: { paddingTop: '8px', paddingBottom: '8px', paddingLeft: '0px', paddingRight: '0px' },
  },
  {
    group: 'Achievements',
    source: 'Achievement.styles.js · badgeSize = (width - 72) / 3 → 107 at 393, radius half that',
    selector: '.m-ach-art',
    expect: {
      width: '107px',
      height: '107px',
      borderTopLeftRadius: '53.5px',
      marginLeft: '8px',
      marginRight: '8px',
    },
  },

  // ── Achievement detail (the `achievementDetail` modal) ──────────────────
  {
    group: 'AchievementDetail',
    source: 'AchievementDetailScreen.tsx · headerRowStyle — 60pt, marginBottom -1',
    selector: '.m-ad-header',
    expect: { height: '60px', marginBottom: '-1px' },
    // Both surfaces take `Color('white').mix(Color(color), 0.2)`; only the agreement is assertable.
    sameAs: { selector: '.m-ad-band', props: ['backgroundColor'] },
  },
  {
    group: 'AchievementDetail',
    source: 'ImageHeaderButton + getHeaderBackButton { paddingRight: 50 }',
    selector: '.m-ad .m-sheethead-btn',
    expect: { paddingTop: '15px', paddingBottom: '15px', paddingRight: '50px', paddingLeft: '0px' },
  },
  {
    group: 'AchievementDetail',
    source: 'AchievementDetailFullHeight.styles.ts · TOP_COLOR_HEIGHT_LARGE 76 (badge sheet is 84)',
    selector: '.m-ad-band',
    expect: {
      height: '76px',
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
    },
  },
  {
    group: 'AchievementDetail',
    source: 'IMAGE_CONTAINER_LARGE 136, marginTop -(136/2) (badge sheet is 160 / -80)',
    selector: '.m-ad-medallion',
    expect: {
      width: '136px',
      height: '136px',
      borderTopLeftRadius: '68px',
      marginTop: '-68px',
      backgroundColor: 'rgb(255, 255, 255)',
    },
  },
  {
    group: 'AchievementDetail',
    source: 'IMAGE_LARGE 120, radius half',
    selector: '.m-ad-art',
    expect: { width: '120px', height: '120px', borderTopLeftRadius: '60px' },
  },
  {
    group: 'AchievementDetail',
    source: 'nameText — detailPageTitle, centred, NAME_MARGIN_TOP 12',
    selector: '.m-ad-name',
    expect: { marginTop: '12px', textAlign: 'center', fontSize: '22px', fontWeight: '800' },
  },
  {
    group: 'AchievementDetail',
    source: 'squiggleImage — 50×11, marginTop 32, marginBottom 28, alignSelf center',
    selector: '.m-ad-squiggle',
    expect: {
      width: '50px',
      height: '11px',
      marginTop: '32px',
      marginBottom: '28px',
      alignSelf: 'center',
    },
  },
  {
    group: 'AchievementDetail',
    source: 'fullScreenContent — CONTENT_PADDING_HORIZONTAL 20 and nothing else',
    selector: '.m-ad-content',
    expect: { paddingLeft: '20px', paddingRight: '20px', paddingTop: '0px' },
  },
  {
    group: 'AchievementDetail',
    source: 'descriptionText — bodyRegular, centred',
    selector: '.m-ad-desc',
    expect: { textAlign: 'center', fontSize: '16px' },
  },
  {
    group: 'TextPill',
    source: 'TextPill.tsx — getColors falls through to GREEN, and PILL_MARGIN_LEFT 5 on non-orange',
    selector: '.m-ad-content .m-pill',
    expect: {
      backgroundColor: 'rgb(219, 242, 231)',
      marginLeft: '5px',
      alignSelf: 'center',
      minHeight: '40px',
    },
  },

  // ── Reading Motivation (RMI tab) ────────────────────────────────────────
  {
    group: 'ReadingMotivation',
    source:
      'ReadingMotivation.tsx · scrollContentStyle — gap 32 is ALL the spacing between sections',
    selector: '.m-rmi-scroll',
    expect: { gap: '32px', paddingBottom: '32px' },
  },
  {
    group: 'ReadingMotivation',
    source: 'ReadingMotivationFilter — full-bleed greyLight4 bar, padding 13 / 20',
    selector: '.m-rmi-filter',
    expect: {
      paddingTop: '13px',
      paddingBottom: '13px',
      paddingLeft: '20px',
      paddingRight: '20px',
      backgroundColor: 'rgb(245, 245, 245)',
    },
  },
  {
    group: 'ReadingMotivation',
    source: "ReadingMotivationFilter · filterText — its OWN 9/10 padding on top of the bar's",
    selector: '.m-rmi-filter-text',
    expect: {
      fontSize: '15px',
      fontWeight: '700',
      lineHeight: '18px',
      paddingTop: '9px',
      paddingLeft: '10px',
      color: 'rgb(66, 66, 66)',
    },
  },
  {
    group: 'ReadingMotivation',
    source:
      'MotivationTypes — container gap 16; only the TITLE is inset, the carousel is full-bleed',
    selector: '.m-rmi-types',
    expect: { gap: '16px' },
  },
  {
    group: 'ReadingMotivation',
    source: 'MotivationTypes · titleText — sectionTitle + paddingHorizontal 20',
    selector: '.m-rmi-types-title',
    expect: { paddingLeft: '20px', paddingRight: '20px', fontSize: '20px', fontWeight: '800' },
  },
  {
    group: 'ReadingMotivation',
    source: 'PersonaCard.styles.ts · container',
    selector: '.m-rmi-persona',
    expect: {
      padding: '32px',
      borderRadius: '16px',
      gap: '16px',
      marginLeft: '20px',
      marginRight: '20px',
    },
  },
  {
    group: 'ReadingMotivation',
    source: 'PersonaCard.styles.ts · textContainer gap 4',
    selector: '.m-rmi-persona-text',
    expect: { gap: '4px' },
  },
  // DIVERGENCE — Reading Motivation's carousel is the SHARED one now, so its own pagination
  // assertions are gone. `AutoHeightCarousel` had `paginationContainer` at marginTop 16 / gap 16
  // with greyLight2 dots and a greyDark3 active; the shared component uses the Streaks treatment
  // instead (10pt greyDark3 at 0.2 opacity). The Carousel group below is what covers it.
  {
    group: 'ReadingMotivation',
    source: 'ReadingGoals.styles.ts · container marginHorizontal 20, gap 16',
    selector: '.m-rmi-goals',
    expect: { marginLeft: '20px', marginRight: '20px', gap: '16px' },
  },
  {
    group: 'ReadingMotivation',
    source: 'ReadingGoals.styles.ts · readingGoalCard — greyLight3, padding 32, radius 16, gap 16',
    selector: '.m-rmi-goals-card',
    expect: {
      padding: '32px',
      borderRadius: '16px',
      gap: '16px',
      backgroundColor: 'rgb(242, 242, 242)',
    },
  },
  {
    group: 'ReadingMotivation',
    source: 'ReadingGoals.styles.ts · imageContainer — 64pt borderGrey disc that CROPS Benny',
    selector: '.m-rmi-goals-avatar',
    expect: {
      width: '64px',
      height: '64px',
      borderTopLeftRadius: '38px',
      backgroundColor: 'rgb(217, 217, 217)',
      overflow: 'hidden',
    },
  },
  {
    group: 'ReadingMotivation',
    source: 'ReadingGoals.styles.ts · bennyStyle — 57pt pinned bottom-right inside the 64pt disc',
    selector: '.m-rmi-goals-benny',
    expect: { width: '57px', height: '57px', position: 'absolute', bottom: '0px', right: '0px' },
  },
  {
    group: 'ReadingMotivation',
    source: 'ReadingGoals.styles.ts · goalText 56/600, tinted with primaryColor',
    selector: '.m-rmi-goals-number',
    expect: { fontSize: '56px', fontWeight: '600' },
  },
  {
    group: 'ReadingMotivation',
    source: 'Recommendations.styles.ts · container paddingHorizontal 20, gap 16',
    selector: '.m-rmi-recs',
    expect: { paddingLeft: '20px', paddingRight: '20px', gap: '16px' },
  },
  {
    group: 'ReadingMotivation',
    source: 'Recommendations.styles.ts · recommendationContainer — greyLight3, radius 16',
    selector: '.m-rmi-recs-list',
    expect: { borderRadius: '16px', backgroundColor: 'rgb(242, 242, 242)' },
  },
  {
    group: 'ReadingMotivation',
    source: 'Recommendations.styles.ts · recommendationItem — row, gap 12, padding 16',
    selector: '.m-rmi-rec',
    expect: { padding: '16px', gap: '12px', flexDirection: 'row' },
  },
  {
    group: 'ReadingMotivation',
    source: 'recommendationItemWithDivider — only items AFTER the first take a rule',
    selector: '.m-rmi-rec + .m-rmi-rec',
    expect: { borderTopWidth: '1px', borderTopColor: 'rgb(217, 217, 217)' },
  },

  // ── Reviews (Log tab, type='log') ───────────────────────────────────────
  {
    group: 'Reviews',
    source: 'Reviews.tsx · style — white ground, paddingTop 8 on the log tab',
    // One component, two tabs: the selector has to say which.
    selector: '.m-rv:not(.is-discover)',
    expect: { paddingTop: '8px', backgroundColor: 'rgb(255, 255, 255)' },
  },
  {
    group: 'Reviews',
    source: 'Reviews.tsx · style — Discover pads the same list 16 rather than 8',
    selector: '.m-rv.is-discover',
    expect: { paddingTop: '16px' },
  },
  {
    group: 'Reviews',
    source: 'Reviews.tsx · contentContainerStyle — flexGrow 1, paddingBottom 40',
    selector: '.m-rv-list',
    expect: { flexGrow: '1', paddingBottom: '40px' },
  },
  {
    group: 'Reviews',
    source:
      'ReviewsListItem · reviewWrapper — paddingHorizontal 20, paddingVertical 24. DIVERGENCE: ' +
      '20 all round. With the gaps inside the card, 24 either end made each row about 50pt of air ' +
      'for three lines of text.',
    selector: '.m-rv-item',
    expect: {
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingLeft: '20px',
      paddingRight: '20px',
    },
  },
  {
    group: 'Reviews',
    source:
      'ReviewsListItem — a rejected row zeroes its top padding, goes yellowLight and hangs a 31pt ' +
      'margin off its bottom. DIVERGENCE: the card stays WHITE like its neighbours and the colour ' +
      'moves into the notice, so a rejected review is not a full-width block of yellow.',
    selector: '.m-rv-item.is-rejected',
    expect: {
      paddingTop: '20px',
      marginBottom: '0px',
      backgroundColor: 'rgb(255, 255, 255)',
    },
  },
  {
    group: 'Reviews',
    source:
      'ReviewsListItem · reviewMeta — row, space-between, marginBottom 16. Discover ONLY now: it ' +
      'carries the avatar, the author and the dots, none of which the Log tab has. Tightened to 10.',
    selector: '.m-rv.is-discover .m-rv-meta',
    expect: { marginBottom: '10px', flexDirection: 'row', justifyContent: 'space-between' },
  },
  {
    group: 'Reviews',
    source: 'ReviewsListItem · the options touch target is 36 around a 24pt glyph',
    selector: '.m-rv-dots',
    expect: { width: '36px', height: '36px' },
  },
  {
    group: 'Reviews',
    source:
      'ReviewsListItem · bookTitle marginBottom 8. The title shares a row with the dots now and ' +
      'the DATE sits under it, so the gap belongs to the date instead.',
    selector: '.m-rv-title',
    expect: { marginBottom: '0px' },
  },
  {
    group: 'Reviews',
    source: 'ReviewsListItem · the review body is clamped to numberOfLines={4}',
    selector: '.m-rv-text',
    expect: { webkitLineClamp: '4' },
  },
  {
    group: 'Reviews',
    source: 'ReviewsListItem · date — bodySmaller in greyDark3',
    selector: '.m-rv-date',
    expect: { color: 'rgb(101, 101, 101)' },
  },
  {
    group: 'Reviews',
    source:
      'getHeaderRejected is a bare strip ABOVE the Pressable with no background of its own. ' +
      'DIVERGENCE: an infobox INSIDE the card — yellowLight with a 3pt orange bar — so the colour ' +
      'marks the message rather than the whole review.',
    selector: '.m-rv-notice',
    expect: {
      backgroundColor: 'rgb(255, 236, 200)',
      borderLeftWidth: '3px',
      borderLeftColor: 'rgb(242, 100, 48)',
    },
  },
  {
    group: 'Reviews',
    source:
      'ONE separator. The app draws two — renderReviewsItem appends a 1pt greyLight3 View after ' +
      'every row AND the FlatList sets ItemSeparatorComponent to a colors.border hairline — so ' +
      'every pair of rows is divided by two lines in two different greys. The FlatList\u2019s is ' +
      'kept: idiomatic, and its colour is the separator the rest of the app uses.',
    selector: '.m-rv-sep',
    expect: { height: '1px', backgroundColor: 'rgb(224, 224, 224)' },
  },
  {
    group: 'ProfileRow',
    source: 'ProfileRow · initialsContainer 40pt + showOnlyInitialsStyles (colors.secondary)',
    // Discover only. On the log tab `showProfileCircleIcon` is false and ProfileRow renders an
    // empty View, so there is no avatar to measure.
    selector: '.m-rv.is-discover .m-rv-who .m-profile-avatar',
    expect: { width: '40px', height: '40px', fontSize: '12px', color: 'rgb(66, 66, 66)' },
  },

  // ── Discover > Challenges ───────────────────────────────────────────────
  {
    group: 'Challenges',
    source: 'ChallengeFilterStyles · filterContainer — greyLight4, 16/20, marginBottom 40',
    selector: '.m-chl-filter',
    expect: {
      paddingTop: '16px',
      paddingLeft: '20px',
      marginBottom: '40px',
      backgroundColor: 'rgb(245, 245, 245)',
    },
  },
  {
    group: 'Challenges',
    source: 'ChallengeFilterStyles · filterButton — 36pt, its 8pt padding cancelled by -8 margin',
    selector: '.m-chl-filter-btn',
    expect: { height: '36px', paddingLeft: '8px', marginLeft: '-8px' },
  },
  {
    group: 'Challenges',
    source: 'ChallengeFilterStyles · filterText 15/bold/16 greyDark3',
    selector: '.m-chl-filter-text',
    expect: {
      fontSize: '15px',
      lineHeight: '16px',
      fontWeight: '700',
      color: 'rgb(101, 101, 101)',
    },
  },
  {
    group: 'Challenges',
    source: 'ChallengesListStyles · challengeTitleSection marginHorizontal 20, marginBottom 24',
    selector: '.m-chl-secthead',
    expect: { marginLeft: '20px', marginRight: '20px', marginBottom: '24px' },
  },
  {
    group: 'Challenges',
    source: 'ChallengeTitleComponent — only a section at index > 0 takes MARGIN_TOP 32',
    selector: '.m-chl-secthead.has-gap',
    expect: { marginTop: '32px' },
  },
  {
    group: 'Challenges',
    source: 'ChallengesListStyles · challengeSubtitle — greyDark3, marginTop 4',
    selector: '.m-chl-subtitle',
    expect: { marginTop: '4px', color: 'rgb(101, 101, 101)' },
  },
  {
    group: 'Challenges',
    source:
      'ChallengeCardStyles · cardContainer — radius 12, 2pt greyLight6, mx 20, mb 24, min 265',
    selector: '.m-chl-card',
    expect: {
      borderRadius: '12px',
      borderTopWidth: '2px',
      borderTopColor: 'rgb(250, 250, 250)',
      marginLeft: '20px',
      marginBottom: '24px',
      minHeight: '265px',
    },
  },
  {
    group: 'Challenges',
    source:
      'ChallengeCardStyles · detailContainer — the SECOND border, 2pt greyLight3 at radius 10',
    selector: '.m-chl-card-inner',
    expect: {
      borderRadius: '10px',
      borderTopWidth: '2px',
      borderTopColor: 'rgb(242, 242, 242)',
      backgroundColor: 'rgb(255, 255, 255)',
    },
  },
  {
    group: 'Challenges',
    source: 'ChallengeCardStyles · headerImageWrapper rounds only the TOP corners, to 8',
    selector: '.m-chl-banner-wrap',
    expect: {
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      borderBottomLeftRadius: '0px',
      overflow: 'hidden',
    },
  },
  {
    group: 'Challenges',
    source: 'useBannerAspectRatio — the 920x351 guideline until a real image reports its own',
    selector: '.m-chl-banner-img',
    expect: { aspectRatio: '920 / 351' },
  },
  {
    group: 'Challenges',
    source: 'ChallengeCardStyles · challengeStateContainer — hung 25pt BELOW the banner edge',
    selector: '.m-chl-state',
    expect: {
      position: 'absolute',
      right: '10px',
      bottom: '-25px',
      padding: '5px',
      borderRadius: '18px',
      backgroundColor: 'rgb(255, 255, 255)',
    },
  },
  {
    group: 'Challenges',
    source: 'ChallengeCardStyles · challengeSectionContainer — a 16pt gutter, paddingTop 24',
    selector: '.m-chl-meta',
    expect: { paddingLeft: '16px', paddingRight: '16px', paddingTop: '24px' },
  },
  {
    group: 'Challenges',
    source: 'ChallengeCardStyles · dateText greyDark3 marginTop 4',
    selector: '.m-chl-dates',
    expect: { marginTop: '4px', color: 'rgb(101, 101, 101)' },
  },
  {
    group: 'Challenges',
    source: 'ChallengeCardStyles · logTypeView — marginVertical 17, marginHorizontal 12, wraps',
    selector: '.m-chl-types',
    expect: {
      marginTop: '17px',
      marginBottom: '17px',
      marginLeft: '12px',
      flexWrap: 'wrap',
    },
  },

  // ── Discover > Events ───────────────────────────────────────────────────
  {
    group: 'Events',
    source: 'Events.jsx · contentContainerStyle { margin: 20 }',
    selector: '.m-ev',
    expect: { marginTop: '20px', marginLeft: '20px', marginRight: '20px' },
  },
  {
    group: 'Events',
    source: 'MicrositeEventStyles · eventContainer — greyLight7, radius 10, padding 24, mt 35',
    selector: '.m-ev-panel',
    expect: {
      minHeight: '250px',
      padding: '24px',
      marginTop: '35px',
      borderRadius: '10px',
      backgroundColor: 'rgb(249, 249, 249)',
    },
  },
  {
    group: 'Events',
    source: 'MicrositeEventStyles · dateIconContainer — 53pt at top 15 / left 20 of the PRESSABLE',
    selector: '.m-ev-chip',
    expect: {
      position: 'absolute',
      top: '15px',
      left: '20px',
      width: '53px',
      height: '53px',
      borderTopLeftRadius: '7.91px',
      backgroundColor: 'rgb(255, 255, 255)',
    },
  },
  {
    group: 'Events',
    source: 'MicrositeEventStyles · dateMonthContainer — a 21pt red cap, top corners only',
    selector: '.m-ev-chip-month',
    expect: {
      height: '21px',
      width: '53px',
      backgroundColor: 'rgb(232, 86, 72)',
      borderTopLeftRadius: '7.91px',
      borderBottomLeftRadius: '0px',
      fontSize: '15px',
      fontWeight: '800',
    },
  },
  {
    group: 'Events',
    source: 'MicrositeEventStyles · dateText — 26/800, greyDark1, paddingTop 5',
    selector: '.m-ev-chip-day',
    expect: { fontSize: '26px', fontWeight: '800', paddingTop: '5px' },
  },
  {
    group: 'Events',
    source: 'MicrositeEventStyles · titleText — titleRegular at marginTop 20, clamped to 2',
    selector: '.m-ev-title',
    expect: { marginTop: '20px', webkitLineClamp: '2' },
  },
  {
    group: 'Events',
    source: 'MicrositeEventStyles · dateOngoingText — a hardcoded #0079ce, not a brand token',
    selector: '.m-ev-when',
    expect: {
      color: 'rgb(0, 121, 206)',
      fontSize: '14px',
      fontWeight: '700',
      lineHeight: '21px',
      marginTop: '3px',
    },
  },
  {
    group: 'Events',
    source: 'EventDescription — 5 lines on a normal phone, and NO style of its own',
    selector: '.m-ev-desc',
    expect: { webkitLineClamp: '5', marginTop: '0px' },
  },

  // ── Activities (one list, two row variants) ─────────────────────────────
  {
    group: 'ActivitiesList',
    source: 'ActivitiesList.tsx · horizontal — paddingHorizontal 24, gap 16',
    selector: '.m-acts-h',
    expect: { gap: '16px', paddingLeft: '24px', paddingRight: '24px', flexDirection: 'row' },
  },
  {
    group: 'ActivitiesList',
    source: 'ActivityItemBadge · itemButton marginTop 24',
    selector: '.m-actb',
    expect: { marginTop: '24px' },
  },
  {
    group: 'ActivitiesList',
    source: 'ActivityItemBadge · BADGE_SIZE 87, radius half — the whole component',
    selector: '.m-actb-art',
    expect: { width: '87px', height: '87px', borderTopLeftRadius: '43.5px' },
  },
  {
    group: 'ActivitiesList',
    source: 'ActivitiesList.tsx · contentContainerStyle — paddingBottom 20, and a COLUMN',
    selector: '.m-acts',
    expect: { flexDirection: 'column', paddingBottom: '20px' },
  },
  {
    group: 'ActivitiesList',
    source: 'ActivityItem.styles.ts · badgeImageView 76pt / border 4, badgeImage 56pt',
    selector: '.m-act-ring',
    expect: { width: '76px', height: '76px', borderTopWidth: '4px' },
  },

  // ── Streaks ─────────────────────────────────────────────────────────────
  {
    group: 'Carousel',
    source:
      'StreaksCarousel — itemWidth is windowWidth - 64, so 329 on a 393 screen. The shared ' +
      'Carousel gets there from its 32pt peek rather than a measured width, which is why the ' +
      'Reading Motivation card had to drop its own 20pt margin: two insets made it 289.',
    selector: '.m-car-slide',
    expect: { width: '329px' },
  },
  {
    group: 'Streaks',
    source: 'StreaksCardStyles.card — radius 10, marginTop 30, paddingTop 26, paddingBottom 40',
    selector: '.m-st-card',
    expect: {
      borderRadius: '10px',
      marginTop: '30px',
      paddingTop: '26px',
      paddingBottom: '40px',
    },
  },
  {
    group: 'Streaks',
    source: 'StreaksCardStyles.achievement — 26/900/-0.48, pulled up 5 into the artwork',
    selector: '.m-st-achievement',
    expect: {
      fontSize: '26px',
      fontWeight: '900',
      letterSpacing: '-0.48px',
      marginTop: '-5px',
    },
  },
  {
    group: 'Streaks',
    source: 'StreaksCardStyles.text — 16/bold/-0.26 at marginTop 4',
    selector: '.m-st-text',
    expect: { fontSize: '16px', fontWeight: '700', letterSpacing: '-0.26px', marginTop: '4px' },
  },
  {
    group: 'Carousel',
    source: 'StreaksCarouselStyles.dots — 10pt greyDark3; inactive keeps its size at 0.2 opacity',
    selector: '.m-car-dot:not(.is-active)',
    expect: {
      width: '10px',
      height: '10px',
      borderRadius: '5px',
      backgroundColor: 'rgb(101, 101, 101)',
      opacity: '0.2',
    },
  },
  {
    group: 'Carousel',
    source:
      'react-native-snap-carousel defaults — inactiveSlideScale 0.9, inactiveSlideOpacity 0.7',
    selector: '.m-car-slide:not(.is-active)',
    expect: { opacity: '0.7', transform: 'matrix(0.9, 0, 0, 0.9, 0, 0)' },
  },
  {
    group: 'MonthHeader',
    source: 'StreaksCalendarsStyles.calendarHeader — marginTop 15, marginBottom 10, inset 10',
    selector: '.m-monthhead',
    expect: {
      marginTop: '15px',
      marginBottom: '10px',
      paddingLeft: '10px',
      paddingRight: '10px',
    },
  },
  {
    group: 'MonthHeader',
    source: 'StreaksCalendarsStyles.monthText — bold 16 at -0.32, greyDark1',
    selector: '.m-monthhead-title',
    expect: {
      fontSize: '16px',
      fontWeight: '700',
      letterSpacing: '-0.32px',
      color: 'rgb(42, 42, 42)',
    },
  },
  {
    group: 'Streaks',
    source:
      'StreaksCalendarsStyles.dayHeader — bold, colors.gray #a3a3a3. The source pins it to a 32pt ' +
      'column; here the row is a 7-column grid, so the column comes from the grid and only the ' +
      'type is asserted. `react-native-calendars` writes three-letter names, not initials.',
    selector: '.m-st-weekday',
    expect: { fontWeight: '700', color: 'rgb(163, 163, 163)' },
    textOneOf: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  {
    group: 'Streaks',
    source: 'CalendarDayStyles.container — 36pt square per day',
    selector: '.m-st-day',
    expect: { width: '36px', height: '36px' },
  },
  {
    group: 'Streaks',
    source: 'CalendarDayStyles.day — 14 bold at -0.26, greyDark3',
    // `.m-st-day` matches today first, which recolours its number — so name a plain day.
    selector:
      '.m-st-day:not(.is-today):not(.is-marked):not(.is-future):not(.is-outside) .m-st-daynum',
    expect: {
      fontSize: '14px',
      fontWeight: '700',
      letterSpacing: '-0.26px',
      color: 'rgb(101, 101, 101)',
    },
  },
  {
    group: 'Streaks',
    source: 'CalendarDayStyles.starContainer — hangs 5 BELOW the cell, not inside it',
    selector: '.m-st-star',
    expect: { bottom: '-5px' },
  },
  {
    group: 'Streaks',
    source: 'TimesGoalMetCard.styles — yellowExtraLight ground, shared card geometry',
    selector: '.m-st-goalcard',
    expect: { backgroundColor: 'rgb(254, 246, 230)', marginTop: '30px', paddingBottom: '40px' },
  },
  {
    group: 'Streaks',
    source: 'TimesGoalMetCard.styles.starBadge — a 56pt yellow disc',
    selector: '.m-st-goal-badge',
    expect: {
      width: '56px',
      height: '56px',
      borderRadius: '28px',
      backgroundColor: 'rgb(255, 188, 66)',
    },
  },
  {
    group: 'Streaks',
    source: 'TimesGoalMetCard.styles.iconContainer — 90pt, matching the streak cards artwork box',
    selector: '.m-st-goal-icon',
    expect: { height: '90px' },
  },
  {
    group: 'Streaks',
    source: 'TimesGoalMetCard.styles.count — 26/800/28/0.35 in orangeVivid',
    selector: '.m-st-goal-count',
    expect: {
      fontSize: '26px',
      fontWeight: '800',
      lineHeight: '28px',
      letterSpacing: '0.35px',
      color: 'rgb(225, 81, 28)',
      marginBottom: '4px',
    },
  },
  {
    group: 'Streaks',
    source: 'TimesGoalMetCard.styles.label — 16/700/20/-0.35 in greyDark3',
    selector: '.m-st-goal-label',
    expect: {
      fontSize: '16px',
      fontWeight: '700',
      lineHeight: '20px',
      letterSpacing: '-0.35px',
      color: 'rgb(101, 101, 101)',
    },
  },
  {
    group: 'Streaks',
    source: 'TimesGoalMetCard.styles.column / textColumn — both a fixed 115 wide',
    selector: '.m-st-goal-col',
    expect: { width: '115px' },
  },

  // ── Highlights (route `statistics`) ─────────────────────────────────────
  {
    group: 'Highlights',
    source:
      'Statistics.tsx — ScrollView [backgroundView, { paddingTop: 30 }]. DIVERGENCE: 0, because ' +
      'the FilterBar heading the screen is full-bleed and flush under the top tabs, so the 30 ' +
      'became a white gap above it rather than air around a floating control.',
    selector: '.m-hl',
    expect: { paddingTop: '0px', backgroundColor: 'rgb(255, 255, 255)' },
  },
  {
    group: 'Highlights',
    source: 'Statistics.styles.segmentedControlContainer — 100% wide, padding 16, hairline rule',
    selector: '.m-hl-control-wrap',
    expect: { padding: '16px', borderBottomColor: 'rgb(224, 224, 224)' },
  },
  {
    group: 'Highlights',
    source: 'Chart.styles.chartRow — 200pt tall, paddingHorizontal 10',
    selector: '.m-hl-chart-row',
    expect: { height: '200px', paddingLeft: '10px', paddingRight: '10px' },
  },
  {
    group: 'Highlights',
    source: 'Chart.styles.xAxis — marginHorizontal 20, labels 10pt grey',
    selector: '.m-hl-xaxis',
    expect: { marginLeft: '20px', marginRight: '20px', fontSize: '10px' },
  },
  {
    group: 'Highlights',
    source: 'ReadingStatistics / Peaks — every row is marginLeft 32 / marginTop 48',
    selector: '.m-hl-row',
    expect: { marginLeft: '32px', marginTop: '48px' },
  },
  {
    group: 'Highlights',
    source: 'the label is a bare fontSize 12 plus blackFont — which is #424242, NOT black',
    selector: '.m-hl-row-title',
    expect: { fontSize: '12px', marginLeft: '8px', color: 'rgb(66, 66, 66)' },
  },
  {
    group: 'Highlights',
    source: 'the value row sits at marginTop 16',
    selector: '.m-hl-row-val',
    expect: { marginTop: '16px', flexDirection: 'row' },
  },
  {
    group: 'Highlights',
    source: 'the number is 41/bold in blackFont (#424242)',
    selector: '.m-hl-val',
    expect: { fontSize: '41px', fontWeight: '700', color: 'rgb(66, 66, 66)' },
  },
  {
    group: 'Highlights',
    source: 'the unit is paragraphMedium (an explicit 16) offset down with a bare `top: 24`',
    selector: '.m-hl-unit',
    expect: {
      position: 'relative',
      top: '24px',
      marginLeft: '8px',
      fontSize: '16px',
      color: 'rgb(66, 66, 66)',
    },
  },
  {
    group: 'Highlights',
    source: 'a two-value row: second value at marginLeft 16, and its unit at top 25 — not 24',
    selector: '.m-hl-unit2',
    expect: { top: '25px' },
  },
  {
    group: 'Highlights',
    source: 'the statistics block closes with marginBottom 48',
    selector: '.m-hl-rows',
    expect: { marginBottom: '48px' },
  },

  // ── Book detail (the `bookDetail` modal, from Reading Log and All Titles) ─
  {
    group: 'BookDetail',
    source: 'BookDetailHeaderBackgroundColorStyles — a 130pt band under a 44pt stretched curve',
    selector: '.m-bd2-band-fill',
    expect: { height: '130px' },
  },
  {
    group: 'BookDetail',
    source: 'BookDetailHeaderBackgroundColorStyles.headerCurve — 44pt, pinned to the band base',
    selector: '.m-bd2-curve',
    expect: { height: '44px', position: 'absolute', bottom: '0px' },
  },
  {
    group: 'BookDetail',
    source: 'BookDetailHeaderStyles.infoContainer — marginTop -122 lifts the cover out of the band',
    selector: '.m-bd2-info',
    expect: { marginTop: '-122px', paddingLeft: '20px', paddingRight: '20px' },
  },
  {
    group: 'BookDetail',
    source: 'BookDetailHeaderStyles.bookContainer — a fixed 120x180 cover box',
    selector: '.m-bd2-cover-wrap',
    expect: { width: '120px', height: '180px' },
  },
  {
    group: 'BookDetail',
    source: 'bookShadowWrapper — hung 6 below, 20 tall, inset 10, BEHIND the cover on z-index -1',
    selector: '.m-bd2-cover-shadow',
    expect: { bottom: '-6px', height: '20px', paddingLeft: '10px', zIndex: '-1' },
  },
  {
    group: 'BookDetail',
    source: 'bookShadow — a black block at 7%, not a box-shadow',
    selector: '.m-bd2-cover-shadow-fill',
    expect: { opacity: '0.07', borderRadius: '10px' },
  },
  {
    group: 'BookDetail',
    source: 'BookDetailHeaderStyles.bookTitle — detailPageTitle, centred, marginTop 24',
    selector: '.m-bd2-title',
    expect: { marginTop: '24px', textAlign: 'center', fontSize: '22px' },
  },
  {
    group: 'BookDetail',
    source: 'authorText — an explicit 16 in greyDark3 at marginTop 6',
    selector: '.m-bd2-author',
    expect: { fontSize: '16px', marginTop: '6px', color: 'rgb(101, 101, 101)' },
  },
  {
    group: 'BookDetail',
    source: 'bottomButtonsContainer marginTop 20; logReadingButton takes flex 1',
    selector: '.m-bd2-buttons',
    expect: { marginTop: '20px', flexDirection: 'row' },
  },
  {
    group: 'BookDetail',
    source: 'addReviewButton — a 12pt left margin and nothing else, so it hugs its label',
    selector: '.m-bd2-review',
    expect: { marginLeft: '12px' },
  },
  {
    group: 'BookDetail',
    source: 'tabContainer — the full SCREEN width, breaking out of the 20pt gutter, marginTop 16',
    selector: '.m-bd2-tabs',
    expect: { width: '393px', marginTop: '16px' },
  },
  {
    group: 'BookDetail',
    source: 'BookDetailStyles / backgroundContainer — the panel sits on cloudWhite, not white',
    selector: '.m-bd2',
    expect: { backgroundColor: 'rgb(252, 252, 252)' },
  },

  // ── Discover > Book Lists ───────────────────────────────────────────────
  {
    group: 'BookLists',
    source: 'BookListsStyles — bookLists paddingVertical 24, content paddingBottom 56',
    selector: '.m-blist',
    expect: { paddingTop: '24px', paddingBottom: '56px', backgroundColor: 'rgb(255, 255, 255)' },
  },
  {
    group: 'BookLists',
    source: 'BookListItem — the `bookLists` origin pads 16 vertically (the others use 10)',
    // The padding and gutter live on the inner item; the pressable outside it is full width, so
    // the pressed wash is too.
    selector: '.m-blist-item',
    expect: { paddingTop: '16px', paddingBottom: '16px', marginLeft: '20px', marginRight: '20px' },
  },
  {
    group: 'BookLists',
    source: 'BookListItem — `bookLists` marginRight is 36, wider because the shadows sit in it',
    selector: '.m-blist-cover-wrap',
    expect: { marginRight: '36px', width: '80px', height: '120px' },
  },
  {
    group: 'BookLists',
    source: 'BookListItemStyles.imageContainer — 80×120 at radius 8',
    selector: '.m-blist-cover',
    expect: { width: '80px', height: '120px', borderRadius: '8px', overflow: 'hidden' },
  },
  {
    group: 'BookLists',
    source: 'firstShadow — 80×110 at left 8, black 7%',
    selector: '.m-blist-shadow-1',
    expect: { width: '80px', height: '110px', left: '8px', opacity: '0.07', borderRadius: '8px' },
  },
  {
    group: 'BookLists',
    source: 'secondShadow — 80×100 at left 16, black 5%',
    selector: '.m-blist-shadow-2',
    expect: { width: '80px', height: '100px', left: '16px', opacity: '0.05' },
  },
  {
    group: 'BookLists',
    source: 'bookCount — bodySmall in greyDark3 at marginTop 4',
    selector: '.m-blist-count',
    expect: { marginTop: '4px', fontSize: '14px', color: 'rgb(101, 101, 101)' },
  },

  // ── Type ladder (generated, but worth asserting it reached the DOM) ─────
  {
    group: 'Type',
    source: 'assets/themes/fontStyles.tsx · sectionTitle (iOS branch)',
    selector: '.m-t-section-title',
    expect: { fontSize: '20px', fontWeight: '800', letterSpacing: '0.32px', lineHeight: '24px' },
  },
  {
    group: 'Type',
    source: 'fontStyles.tsx · itemTitle (iOS branch)',
    selector: '.m-t-item-title',
    expect: { fontSize: '17px', fontWeight: '700', letterSpacing: '-0.31px', lineHeight: '20px' },
  },
  {
    group: 'Type',
    source: 'fontStyles.tsx · subHeading (iOS branch)',
    selector: '.m-t-sub-heading',
    expect: { fontSize: '14px', fontWeight: '500', letterSpacing: '-0.22px', lineHeight: '17px' },
  },
]

/**
 * Structural assertions — what actually RENDERED, rather than what the CSS computes to.
 *
 * Every style assertion above has the same blind spot: it reads properties off a selector, so it
 * is silent about elements that should not be there, elements that are missing entirely, and
 * elements that measure perfectly while being painted behind something else. All three of those
 * shipped here before anyone noticed, which is why this list exists:
 *
 *   - invented badge captions      → every `.m-hbadge` style assertion passed
 *   - omitted streak corner art    → reported `missing`, which is not a failure
 *   - fundraiser banner hidden     → 80pt overlap and the exact aspect ratio, 80pt unpainted
 *
 * Kept deliberately small. A child count breaks on a harmless wrapper and a text assertion breaks
 * on a copy change, so this covers only structure the app genuinely fixes, elements already proven
 * easy to forget, and the overlap idioms where CSS paint order can silently invert.
 *
 * Fields:
 *   children     exact number of ELEMENT children (text nodes ignored)
 *   required     a missing selector is a FAILURE, not a skip — but only inside its `scope`
 *   scope        the assertion applies only when THIS selector is on the page
 *   onTop        nothing may cover the element's probe point
 *   notInside    the element must NOT be a descendant of this selector
 *   centeredIn   the element's horizontal midpoint must match this container's (±1.5px)
 *   probe        'center' (default) or 'top' — where onTop samples. Use 'top' for the
 *                `marginTop: -h/2` overlap idiom, where the overlap is the top half and a centre
 *                probe sits just past it
 *   text         exact trimmed textContent
 *   textOneOf    trimmed textContent must be one of these
 *
 * `required` without `scope` would mean "must exist on every page", which is never what is meant:
 * a Home component is legitimately absent on the Log tab. Scoped, it says the thing it should —
 * "given this component rendered, this part of it must be there" — which is what catches an
 * omitted child rather than an unrendered parent.
 */
export const STRUCTURE = [
  {
    group: 'Streaks',
    source:
      'CalendarDay — a day outside the month is a DOT, never a greyed-out number. The number is ' +
      'the branch you reach for when simplifying, and it makes the month boundary vanish.',
    selector: '.m-st-day.is-outside .m-st-daynum',
    scope: '.m-st-calendar',
    notInside: '.m-st-calendar',
    note: 'There should be NO such element — an outside day renders `calendarDot` instead.',
  },
  {
    group: 'SheetHeader',
    source:
      'the three-slot header — the centre stays centred whatever sits either side of it, which ' +
      'is the whole reason the slot exists. Book Talks is the case that proves it: the trailing ' +
      '“Finish Later” appears and disappears with the conversation state, and Benny must not move.',
    selector: '.m-bc-header .m-sheethead-slot--center',
    scope: '.m-bc-header',
    required: true,
    centeredIn: '.m-bc-header',
  },
  {
    group: 'SheetHeader',
    source: 'dismiss goes LEFT on every sheet — Book Talks had it on the right as a close_modal',
    selector: '.m-bc-header .m-sheethead-slot--start .m-sheethead-btn',
    scope: '.m-bc-header',
    required: true,
  },
  {
    group: 'HomeBadges',
    source: 'Badge.tsx circle branch — a single <Image>, and nothing else',
    selector: '.m-hbadge',
    children: 0,
    note: 'There is no name or date under a Home badge. Captions belong to the list variant.',
  },
  {
    group: 'StreaksMessage',
    source:
      'StreaksMessage.tsx — `showStreakGraphics` paints backgroundBottomRight, a red curve across ' +
      'the card corner. DIVERGENCE: dropped. On the home grey it is the only card with art behind ' +
      'its text, and the flame pill in that same corner already says what the curve decorated. ' +
      'The assertion is INVERTED rather than deleted — it used to guard against the art being ' +
      'omitted by accident, and now guards against it coming back the same way.',
    selector: '.m-streak-bg',
    scope: '.m-streak',
    notInside: '.m-streak',
    note: 'There should be no such element.',
  },
  {
    group: 'FundraisersHomeCard',
    source: 'HomeCardHeader — the banner punches up out of the band on marginTop -80',
    selector: '.m-fund-banner',
    scope: '.m-fund',
    required: true,
    onTop: true,
    note:
      'The band is position:relative, so it paints above a STATIC sibling whatever the DOM order. ' +
      'Geometry cannot detect that; only asking the page what is on top can.',
  },
  {
    group: 'ChallengeCarouselCard',
    source: 'ChallengeCarouselCard.tsx — banner, title, dates',
    selector: '.m-cc',
    children: 3,
  },
  {
    group: 'ChallengeCarouselCard',
    source: 'the banner is the card’s own art, not a background',
    selector: '.m-cc-banner',
    scope: '.m-cc',
    required: true,
    onTop: true,
  },
  {
    group: 'MyStats',
    source: 'MyStats.tsx — the fixed button label',
    selector: '.m-mystats .m-btn-label',
    text: 'View Detailed Statistics',
  },
  {
    group: 'DailyGoalBanner',
    source: 'DailyGoalBanner.tsx getBannerContent — three fixed headlines, no others',
    selector: '.m-dgb-headline',
    // Only the DEFAULT banner has a headline. The `staticTitle` variant — which the Reading Log
    // uses — replaces the headline/subheader pair with one quiet label, so requiring a headline
    // inside every `.m-dgb` was wrong.
    scope: '.m-dgb:not(:has(.m-dgb-static))',
    required: true,
    textOneOf: ['Log Some Reading!', 'Keep going!', 'Well done!'],
  },
  {
    group: 'SectionHeader',
    source: 'home/shared/Header — a title and a View All pressable, nothing more',
    selector: '.m-secthead',
    children: 2,
  },
  {
    group: 'TabBar',
    source: 'BeanstackTabs.tsx — the plus slot is a spacer, not a tab',
    selector: '.m-tab-plus-slot',
    scope: '.m-tabbar',
    required: true,
    note: 'Without it the four real tabs sit in the wrong places.',
  },
  {
    group: 'Badge',
    source: 'Badge.tsx — the ring reports `earnedOn`, the disc reports `isEarned`',
    selector: '.m-badge-ring',
    scope: '.m-badges-list',
    required: true,
    childrenAtMost: 2,
    note:
      'Ring + disc, plus the check. This screen is earned-only (useEarnedBadges), so every row ' +
      'has a green ring and a check. The unearned states live in Badge for the challenge view, ' +
      'where the ring reports `earnedOn` and the disc the looser `isEarned`.',
  },
  {
    group: 'BennyChat',
    source: 'BennyChat.tsx — header, progress bar, messages, input. Nothing between.',
    selector: '.m-bc',
    scope: '.m-bc',
    required: true,
    childrenAtMost: 4,
    note: 'There is no book-title row. One was invented here once and removed.',
  },
  {
    group: 'BennyChat',
    source: 'logSessionScreens.tsx — presentation: modal, so it covers the tab bar and the FAB',
    selector: '.m-frame-sheet',
    scope: '.m-bc',
    required: true,
    onTop: true,
  },
  {
    group: 'BennyChat',
    source: 'BennyChatBubbleStyles.ts — maxWidth is width * 0.75 of the SCREEN, not the container',
    selector: '.m-bc-bubble',
    scope: '.m-bc',
    onTop: false,
    childrenAtMost: 2,
    note: 'A bubble is a headline plus a body, and the headline is optional.',
  },
  {
    group: 'ActivitiesList',
    source: 'ActivityItem.tsx — the medallion holds the disc plus an optional check',
    selector: '.m-act-ring',
    onTop: false,
    childrenAtMost: 2,
  },
  {
    group: 'Achievements',
    source: 'Achievement.tsx — a Pressable around ONE <Image>, and nothing else',
    selector: '.m-ach',
    scope: '.m-ach-list',
    required: true,
    children: 1,
    note:
      'No name, no earned date, no caption. The name reaches the screen only as the ' +
      'accessibility label; it is shown in the achievementDetail modal. Same anatomy as the ' +
      'Home badge strip, and the same place an invented caption would pass every style check.',
  },
  {
    group: 'Reviews',
    source: 'title row, date, body — the meta row is DISCOVER-ONLY and is not rendered here.',
    selector: '.m-rv:not(.is-discover) .m-rv-item:not(.is-rejected)',
    scope: '.m-rv-list',
    required: true,
    children: 3,
    note:
      'renderAuthor returns undefined unless type === "discover" and showProfileCircleIcon is ' +
      'false on the log tab, so there is no avatar and no name — which is why the meta row is ' +
      'omitted entirely rather than rendered empty. Adding an author here would look harmless ' +
      'and pass every style assertion.',
  },
  {
    group: 'BookDetail',
    source: 'logSessionScreens.tsx — bookDetail is presentation: modal, so it covers the tab bar',
    selector: '.m-frame-sheet',
    scope: '.m-bd2',
    required: true,
    onTop: true,
  },
  {
    group: 'BookDetail',
    source: 'BookDetail.tsx — tabs are Overview + Reading Sessions; Questions is conditional',
    selector: '.m-bd2-tabs',
    scope: '.m-bd2',
    required: true,
    childrenAtMost: 3,
    note:
      'Two tabs is the NORMAL case — the third only appears when getQuestionsForTab finds ' +
      'reading-integrity questions. A two-tab panel is not a loading state.',
  },
  {
    group: 'BookTalks',
    source: 'BookTalks.tsx renderItem — a text block and the share icon. Nothing else.',
    selector: '.m-bt-row',
    scope: '.m-bt',
    required: true,
    children: 2,
    note:
      'No cover, no status pill, no chevron. The row is the book title, one date line, and ' +
      'images.shareIcon — and the date line is the only place the In Progress / Completed fork ' +
      'shows, as "Started" vs "Finished".',
  },
  {
    group: 'BookTalks',
    source: 'BookTalks.tsx — the title and ONE date line, both inside bookSectionInfo',
    selector: '.m-bt-info',
    scope: '.m-bt',
    required: true,
    children: 2,
  },
  {
    group: 'BookTalks',
    source: 'ToggleTabs is the ListHeaderComponent — the In Progress / Completed switch',
    selector: '.m-bt-toggle',
    scope: '.m-bt',
    required: true,
    children: 2,
  },
  {
    group: 'AllTitles',
    source: 'AllTitles.tsx — ToggleTabs heads the list, All Titles / Completed',
    selector: '.m-at .m-toggle',
    scope: '.m-at',
    required: true,
    children: 2,
  },
  {
    group: 'AllTitles',
    source: 'renderSectionHeader — the month title and a Divider inset to the gutter',
    selector: '.m-at-divider',
    scope: '.m-at-section-head',
    required: true,
    onTop: false,
    note: 'The rule under each month heading is a real Divider, not a border on the heading.',
  },
  {
    group: 'AllTitles',
    source: 'renderItem (Completed) — the cover and its faked sibling shadow, nothing else',
    selector: '.m-at-tile',
    scope: '.m-at-grid',
    required: true,
    children: 2,
    note:
      'A completed tile is the BookImage plus the shadow View. No title caption under it and no ' +
      'completion badge — the title is drawn INSIDE the cover by BookImage.',
  },
  {
    group: 'Highlights',
    source:
      'Statistics.tsx — a switch between Statistics and Peaks heads the whole screen. The app ' +
      'uses a ToggleTabs; this is the shared FilterBar, which is what every other one-of-many ' +
      'choice in the Log opens. The two SegmentedControlTabs inside Statistics stay segmented — ' +
      'they scrub the same chart, where seeing all the options at once is the point.',
    selector: '.m-hl > .m-filterbar',
    scope: '.m-hl',
    required: true,
    note:
      'Two different SCREENS, not two filters: the Highlights half is Peaks — personal bests with ' +
      'no controls at all. The whole switch was missing here once, which left the screen looking ' +
      'like a single stats page.',
  },
  {
    group: 'Streaks',
    source: 'StreaksCard — artwork, the number, the label. Nothing else.',
    selector: '.m-st-card:not(.m-st-goalcard)',
    scope: '.m-car',
    required: true,
    children: 3,
  },
  {
    group: 'ActivitiesList',
    source: 'ActivityItemBadge — an 87pt image and NOTHING else: no ring, no check, no caption',
    selector: '.m-actb',
    scope: '.m-acts-h',
    required: true,
    children: 1,
    note:
      'Home passes horizontal={true}, which renders ActivityItemBadge — the same anatomy as the ' +
      'Home badge strip. The ringed medallion with three lines of text is ActivityItem, the ' +
      'VERTICAL row, and belongs to the Discover Activities tab. They were swapped here once, ' +
      'which also forced a fabricated 320pt row width to make the wrong row fit a rail.',
  },
  {
    group: 'BookLists',
    source: 'BookListItem — the cover stack, then the text block. No chevron on this origin.',
    selector: '.m-blist-item',
    scope: '.m-blist',
    required: true,
    children: 2,
    note:
      'The right arrow belongs to the dashboard and classroomLibrary origins only, and the ' +
      'second line is the book COUNT here rather than the author.',
  },
  {
    group: 'BookLists',
    source: 'BookListItem — the Pressable wraps the gutter, so the pressed wash is full width',
    selector: '.m-blist-row',
    scope: '.m-blist',
    required: true,
    children: 1,
    note:
      'The marginHorizontal is on `bookListsItem` INSIDE the Pressable, not on the Pressable. ' +
      'Putting it on the button inset the highlight too, which reads as a card rather than a row.',
  },
  {
    group: 'BookLists',
    source: 'BookListItem — two shadow blocks behind the cover, drawn back to front',
    selector: '.m-blist-cover-wrap',
    scope: '.m-blist',
    required: true,
    children: 3,
  },
  {
    group: 'Events',
    source: 'MicrositeEventCard — the date chip is a SIBLING of the panel, not a child of it',
    selector: '.m-ev-chip',
    scope: '.m-ev-card',
    required: true,
    notInside: '.m-ev-panel',
    onTop: true,
    note:
      'The chip is absolute against the Pressable, and the panel carries the 35pt margin between ' +
      'them — that is what makes it hang 20pt above the panel. Nested inside the panel it lands ' +
      'on the title instead, which is exactly what happened here first.',
  },
  {
    group: 'Challenges',
    source: 'ChallengeCardComponent — banner, name/dates block, type pills. No description.',
    selector: '.m-chl-card-inner',
    scope: '.m-chl-list',
    required: true,
    children: 3,
    note:
      'The card carries no description and no Join button — joining happens in a modal after ' +
      'you tap an unregistered card. Both were invented here once.',
  },
  {
    group: 'Reviews',
    source: 'ReviewsListItem — the log tab has NO avatar: showProfileCircleIcon is false there',
    selector: '.m-rv:not(.is-discover) .m-rv-who',
    scope: '.m-rv:not(.is-discover)',
    required: true,
    children: 1,
    note:
      'ProfileRow returns a bare <View /> when showProfileCircleIcon is false, so the log row ' +
      'opens straight onto the date. An initials circle here looks completely natural and is ' +
      'wrong — it was built that way once before this assertion existed.',
  },
  {
    group: 'Reviews',
    source:
      'the dots stay on the TITLE row whatever the status. The app moves them up into the ' +
      'rejected strip (`!isRejected && this.showDots()`), so the control changes position ' +
      'depending on whether a review came back — which is the one time you least want to hunt ' +
      'for it.',
    selector: '.m-rv-item.is-rejected .m-rv-head .m-rv-dots',
    scope: '.m-rv-item.is-rejected',
    required: true,
  },
  {
    group: 'Reviews',
    source: 'the rejected notice — the warning icon and its text, nothing else',
    selector: '.m-rv-notice',
    scope: '.m-rv-item.is-rejected',
    required: true,
    children: 2,
  },
  {
    group: 'ReadingMotivation',
    source: 'Recommendations.tsx — a StarIcon and the text, nothing else',
    selector: '.m-rmi-rec',
    scope: '.m-rmi-recs',
    required: true,
    children: 2,
  },
  {
    group: 'ReadingMotivation',
    source: 'PersonaCard.tsx — the artwork and one text block, nothing else',
    selector: '.m-rmi-persona',
    scope: '.m-rmi-types',
    required: true,
    children: 2,
    note: 'No score, no pill, no factor percentage — the card is art, title and definition.',
  },
  {
    group: 'ReadingMotivation',
    source: 'ReadingGoals.tsx — the cropped Benny disc, the number, the unit label',
    selector: '.m-rmi-goals-card',
    scope: '.m-rmi-goals',
    required: true,
    children: 3,
  },
  {
    group: 'ReadingMotivation',
    source: 'Recommendations.tsx — the first item never takes a divider',
    selector: '.m-rmi-rec:first-child',
    scope: '.m-rmi-recs-list',
    required: true,
  },
  {
    group: 'AchievementDetail',
    source: 'AchievementDetailScreen.tsx — the SafeAreaView header is a SIBLING of the ScrollView',
    selector: '.m-ad-header',
    scope: '.m-ad',
    required: true,
    notInside: '.m-ad-scroll',
    note:
      'This is the one structural difference from the badge sheet, whose header IS inside its ' +
      'ScrollView. Outside it the header is fixed; move it in and it scrolls away, which no ' +
      'measurement of either header would notice.',
  },
  {
    group: 'AchievementDetail',
    source: 'AchievementDetailFullHeight.tsx — the disc holds the image and NOTHING else',
    selector: '.m-ad-medallion',
    scope: '.m-ad',
    required: true,
    children: 1,
    onTop: true,
    probe: 'top',
    note:
      'No ring and no earned check — those belong to a badge. The two sheets are close enough ' +
      'that copying the badge medallion wholesale is the obvious mistake, and every style ' +
      'assertion here would still pass if you did.',
  },
  {
    group: 'AchievementDetail',
    source:
      'HomeModalNavigator.tsx — achievementDetail is a `presentation: modal` sibling of homeStack',
    selector: '.m-frame-sheet',
    scope: '.m-ad',
    required: true,
    onTop: true,
  },
  {
    group: 'BadgeDetail',
    source: 'HomeModalNavigator.tsx — badgeDetail is a `presentation: modal` SIBLING of homeStack',
    selector: '.m-frame-sheet',
    scope: '.m-bd',
    required: true,
    onTop: true,
    note:
      'The tab navigator is itself just the `homeTabs` screen inside HomeStackNavigator, so a ' +
      'modal presented beside it covers the whole screen — tab bar and FAB included. A sheet ' +
      'that left the tab bar showing would be the wrong navigator shape, not a z-index nicety.',
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetail.tsx — the medallion straddles the band on marginTop -80',
    selector: '.m-bd-medallion',
    scope: '.m-bd',
    required: true,
    onTop: true,
    probe: 'top',
    note:
      'Same overlap idiom as the fundraiser banner, which measured perfectly while painting ' +
      'behind its band. Only a hit test catches that — and only a hit test inside the overlap: ' +
      'the medallion is 160pt pulled up 80pt, so its centre sits at the band’s lower edge and a ' +
      'centre probe passes while the whole overlap is hidden.',
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetail.tsx — completedCircle holds the image plus an optional check',
    selector: '.m-bd-ring',
    scope: '.m-bd',
    required: true,
    childrenAtMost: 2,
    note: 'No progress ring here: CircularProgressBar is the fundraiser branch only.',
  },
  {
    group: 'BadgeDetail',
    source: 'BadgeDetail.tsx — showExtras gates the whole awards block, nothing inside it',
    selector: '.m-bd-awards',
    scope: '.m-bd',
    onTop: false,
    note:
      'Rewards, then tickets, then certificates — in that order, and only those three. Each is ' +
      'an <Award>; there is no heading above them and no empty state inside.',
  },
  {
    group: 'BadgeDetail',
    source: 'Award.styles.ts · wrapper — an icon and a text column, nothing else',
    selector: '.m-bd-award',
    scope: '.m-bd',
    children: 2,
  },
]

/**
 * Places we knowingly depart from the source. Each one is a decision, not a defect — listing them
 * here keeps them out of the assertion set without hiding them.
 */
export const DEVIATIONS = [
  {
    what: 'PlusMenu FAB lift',
    source: 'PlusMenu.tsx · FAB_LIFT = 20',
    ours: 'FAB_LIFT = 10',
    why: 'At 20 the FAB centre sits ~24pt above the line the tab icons sit on. Design call.',
  },
  {
    what: 'StreaksMessage vertical placement',
    source: 'Home.tsx backLowerContainer (height 285) + streaksContainer marginTop -275',
    ours: 'ordinary margins',
    why: 'RN layout scaffolding that nets ~10pt of spacing; meaningless on the web.',
  },
  {
    what: 'Platform forks',
    source: 'fontStyles.tsx and ~149 Platform.OS sites',
    ours: 'the iOS branch everywhere',
    why: 'A design platform has to pick one; iOS reads as the design intent.',
  },
  {
    what: 'Hover states',
    source: 'none — the app has `pressed` only, no hover and no transitions',
    ours: '`pressed` maps to :active; :hover is added only to button-like controls',
    why:
      'A pointer affordance for reviewing a design. Mapping pressed to :hover instead fired a ' +
      'press state on mouseover and made those components behave unlike their neighbours.',
  },
  {
    what: 'Benny chat message list — bottom padding',
    source:
      'BennyChatStyles.flatListContentContainer: paddingTop 20, paddingHorizontal 20, no bottom',
    ours: 'padding: 20px on all sides',
    why:
      'With no bottom padding the last bubble sits flush against the input border once the ' +
      'conversation fills the list. Kept as a design decision rather than reproduced — worth ' +
      'raising with mobile engineering as a real gap in the app.',
  },
  {
    what: 'Badge and achievement artwork',
    source: 'badge_image_thumb_url / achievement_image_thumb_url — API-served per item',
    ours: 'a gradient fill per item, like the challenge banners',
    why:
      'No bundled asset exists to mirror. The circle geometry is exact; in the app the fill is the ' +
      'tenant primaryColor (greyLight1 when unearned) with the artwork contained on top.',
  },
]
