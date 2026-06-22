import React from 'react'
import { BennyBubble } from 'bs-prototypes'

export const Encouragement = () => (
  <BennyBubble>
    You're on a <strong>12-day reading streak</strong> — that's your longest yet! Keep it going and
    you'll unlock the Bookworm badge tonight. 🔥
  </BennyBubble>
)

export const WithTimestamp = () => (
  <BennyBubble timestamp="Jun 22 at 6:00 AM">
    Maya read <strong>248 minutes</strong> this week across 6 sessions. Her Lexile is up{' '}
    <strong>+45L</strong> since April — nice steady growth!
  </BennyBubble>
)

export const Nudge = () => (
  <BennyBubble>
    It's been <strong>3 days</strong> since your last log. A quick 15-minute read today keeps your
    RMI climbing — want me to pick a book?
  </BennyBubble>
)
