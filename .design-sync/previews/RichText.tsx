import React from 'react'
import { RichText } from 'bs-prototypes'

const REVIEW =
  '<h2>A page-turner from start to finish</h2>' +
  '<p>This was hands-down my <strong>favorite read</strong> of the reading challenge. ' +
  'Benny would give it five stars!</p>' +
  '<p>What stood out to me:</p>' +
  '<ul><li>Characters that feel real</li><li>A twist I never saw coming</li>' +
  '<li>Short chapters — perfect for keeping a reading streak alive</li></ul>'

const CHALLENGE =
  '<h2>Summer Reading 2026</h2>' +
  '<p>Read <strong>20 minutes a day</strong> all summer to earn badges, build your ' +
  'reading streak, and climb the class leaderboard.</p>' +
  '<blockquote>Every book you log gets you closer to the 1,000-minute trophy.</blockquote>'

export const BookReview = () => {
  const [html, setHtml] = React.useState(REVIEW)
  return <RichText value={html} onChange={setHtml} placeholder="Tell readers about it…" />
}

export const ChallengeDescription = () => {
  const [html, setHtml] = React.useState(CHALLENGE)
  return (
    <RichText
      value={html}
      onChange={setHtml}
      tokens={['{{first_name}}', '{{class_name}}']}
      placeholder="Describe the challenge…"
    />
  )
}
