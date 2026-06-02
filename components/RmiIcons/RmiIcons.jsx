// Icons for the 10 RMI motivation factors (5 intrinsic + 5 extrinsic).
// Rendered via the shared <Icon> (Tabler) so they match the rest of the system.
// Each entry is an element; consumers render it directly, pass it as an `icon`
// prop, or cloneElement() it to resize. Color inherits from CSS `color`.

import { Icon } from '@components/Icon/Icon'

const SIZE = 18

export const RMI_ICONS = {
  // ── Intrinsic ──
  enjoyment: <Icon name="smile" size={SIZE} />,
  curiosity: <Icon name="search" size={SIZE} />,
  importance: <Icon name="star" size={SIZE} />,
  confidence: <Icon name="shield-check" size={SIZE} />,
  challenge: <Icon name="trending-up" size={SIZE} />,
  // ── Extrinsic ──
  social: <Icon name="users" size={SIZE} />,
  recognition: <Icon name="award" size={SIZE} />,
  grades: <Icon name="file-text" size={SIZE} />,
  competition: <Icon name="chart-column" size={SIZE} />,
  compliance: <Icon name="clipboard-check" size={SIZE} />,
}
