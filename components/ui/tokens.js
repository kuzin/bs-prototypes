// ─── Design tokens ────────────────────────────────────────────────────────────
// Section colors mirror ReadingHealth's SECTIONS (the canonical app palette) so the
// Student Profile stays in sync with the landing cards, ReadingHealth tiles, and RIS.
// `bar` = accent (charts / Hero icon / fills); `bg`/`text` = soft tile + chip tint.
export const C = {
  motivation: { bg: '#FDEEE6', text: '#993C1D', bar: '#E8866A', icon: 'ti-flame' },
  integrity: { bg: '#E8EFFE', text: '#1E40AF', bar: '#1D4ED8', icon: 'ti-shield-check' },
  habits: { bg: '#E6F8EF', text: '#0F6E56', bar: '#16A97A', icon: 'ti-calendar-stats' },
  skills: { bg: '#F1EBFF', text: '#5B21B6', bar: '#7C3AED', icon: 'ti-book-2' },
}

export const LABEL = {
  motivation: 'Motivation',
  integrity: 'Integrity',
  habits: 'Habits',
  skills: 'Skills',
}

// ─── Genre color palette ──────────────────────────────────────────────────────
export const GENRE_COLORS = {
  Survival: { bg: '#FEF3C7', color: '#92400E', border: '#FCD34D' },
  Historical: { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' },
  Dystopian: { bg: '#EDE9FE', color: '#5B21B6', border: '#C4B5FD' },
  Adventure: { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7' },
  Fantasy: { bg: '#FCE7F3', color: '#9D174D', border: '#F9A8D4' },
  Mystery: { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' },
  'Sci-Fi': { bg: '#F0F9FF', color: '#0369A1', border: '#BAE6FD' },
  Humor: { bg: '#FEF9C3', color: '#854D0E', border: '#FEF08A' },
}

// ─── Icons8 Material Two Tone ─────────────────────────────────────────────────
export const I8_TOKEN = '1ewyMILco4xnWbLgvwOavHZyCzAukfeNCaMoatj4'
export const I8_IDS = {
  'ti-flame': 87233,
  'ti-shield-check': 87381,
  'ti-calendar-stats': 89201,
  'ti-book-2': 85806,
  'ti-user': 86344,
  'ti-trophy': 89388,
  'ti-chart-bar': 89413,
  'ti-medal': 101947,
  'ti-star': 89281,
  'ti-message-circle': 85516,
  'ti-dots': 89163,
  'ti-chevron-down': 89221,
  'ti-circle-check': 93306,
  'ti-bulb': 109603,
  'ti-alert-triangle': 88582,
  'ti-message-x': 93132,
  'ti-check': 83076,
  'ti-clock': 89374,
  'ti-x': 88571,
  'ti-arrow-left': 89346,
  'ti-trending-up': 87707,
  'ti-signature': 92235,
  'ti-swap': 99581,
  'ti-list': 88608,
  'ti-reading-log': 99095,
  'ti-gift': 89229,
  'ti-pencil': 89364,
  'ti-puzzle': 88627,
  'ti-badge': 90032,
  'ti-certificate': 86736,
  'ti-rating': 88628,
  'ti-paragraph': 99557,
}

// ─── Book cover fallback palettes ─────────────────────────────────────────────
export const COVER_PALETTES = [
  ['#DBEAFE', '#1E40AF'],
  ['#FCE7F3', '#9D174D'],
  ['#D1FAE5', '#065F46'],
  ['#FEF3C7', '#92400E'],
  ['#EDE9FE', '#5B21B6'],
  ['#FFEDD5', '#9A3412'],
]
