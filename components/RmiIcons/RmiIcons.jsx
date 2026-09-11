// Icons for the 10 RMI motivation factors (5 intrinsic + 5 extrinsic).
//
// These are the app's own drawings, copied out of bs-product
// (`app/assets/images/icons/rmi-factors/`) and served from `public/bs-icons/`
// via <BsIcon>. They used to be stroked Tabler glyphs, which read as our
// approximation of the factors rather than the factors themselves.
//
// The shape of this export is unchanged — an element per factor key — so
// consumers still render it directly, pass it as an `icon` prop, or
// cloneElement() it to resize. What changed is that the drawings carry their
// own colour now, so a `color` on the parent no longer tints them.

import { BsIcon } from '@components/BsIcons/BsIcons'

const SIZE = 18

const factor = (name) => <BsIcon set="rmi-factors" name={name} size={SIZE} />

export const RMI_ICONS = {
  // ── Intrinsic ──
  enjoyment: factor('enjoyment'),
  curiosity: factor('curiosity'),
  importance: factor('importance'),
  confidence: factor('confidence'),
  challenge: factor('challenge'),
  // ── Extrinsic ──
  social: factor('social'),
  recognition: factor('recognition'),
  grades: factor('grades'),
  competition: factor('competition'),
  compliance: factor('compliance'),
  // Not one of the ten — the app's placeholder for an unscored factor.
  mystery: factor('mystery'),
}
