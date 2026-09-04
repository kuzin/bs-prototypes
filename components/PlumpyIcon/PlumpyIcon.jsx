/**
 * PlumpyIcon — the duotone icon family the real Beanstack admin chrome uses.
 *
 * These are **the exact Icons8 Plumpy icons the Figma designs specify**, not
 * lookalikes. The rail nodes in Figma ("Comprehension Book Talks" file, Admin —
 * Flagged Sessions and Book Talks page) name their assets literally:
 * `icons8-staff`, `icons8-mission`, `icons8-opened-folder`,
 * `icons8-edit-property`, `icons8-deviation`, `icons8-pie-chart`,
 * `icons8-attendance`, `icons8-video`, `icons8-announcement`, `icons8-help`.
 * Each is matched below to its Icons8 id (fetched via the Icons8 MCP).
 *
 * Plumpy is a two-layer duotone family: a solid layer plus a layer at
 * `opacity=".35"`. That is the same construction the shipped app uses for its
 * hand-vendored rail icons (`.dark` #2A2A2A / `.light` #A5A5A5 at .35 in
 * bs-product `_menu.html.haml`), so a single `fill: currentColor` on the root
 * reproduces the real behavior exactly:
 *
 *   inactive → currentColor #2a2a2a
 *   active   → currentColor the accent; both layers tint together
 *
 * Keep every addition on the Plumpy pack so the family stays consistent, and
 * record the Icons8 id so it can be re-fetched.
 *
 * <PlumpyIcon name="people" />              // 24px, currentColor
 * <PlumpyIcon name="reports" size={20} />
 */

// name → { id (Icons8), figma (asset name in the design), body }
const PLUMPY = {
  people: {
    id: 'dwars4lWZcf4',
    figma: 'icons8-staff',
    body: (
      <>
        <path
          d="M20,16v3l-1.981,1H5.984L4,19v-3l1.35-1c0.55-1.18,1.76-2,3.15-2h7 c1.39,0,2.6,0.82,3.15,2L20,16z"
          opacity=".35"
        />
        <path d="M8.5,20h-5C2.12,20,1,18.88,1,17.5S2.12,15,3.5,15h1.85C5.12,15.45,5,15.96,5,16.5C5,18.43,6.57,20,8.5,20z" />
        <path d="M23,17.5c0,1.38-1.12,2.5-2.5,2.5h-5c1.93,0,3.5-1.57,3.5-3.5c0-0.54-0.12-1.05-0.35-1.5h1.85C21.88,15,23,16.12,23,17.5z" />
        <circle cx="12" cy="7" r="4" opacity=".35" />
        <circle cx="20" cy="9" r="3" opacity=".35" />
        <circle cx="4" cy="9" r="3" opacity=".35" />
      </>
    ),
  },
  challenges: {
    id: 'kT3iX5PnVlXm',
    figma: 'icons8-mission',
    body: (
      <>
        <path
          d="M9.53,9.619l-1.502,2.185c-0.085,0.373,0.046,0.779,0.372,1.023c0.442,0.332,1.068,0.242,1.399-0.2 l0.529-0.706l0.776,1.553c0.17,0.339,0.516,0.553,0.895,0.553s0.725-0.214,0.895-0.553l0.776-1.553l0.529,0.706 c0.331,0.441,0.957,0.53,1.399,0.2c0.33-0.247,0.463-0.659,0.372-1.036l-1.498-2.175C13.28,7.885,10.722,7.886,9.53,9.619z"
          opacity=".35"
        />
        <path d="M16.841,3.92l-2.946-1.473C13.306,2.153,12.658,2,12,2c-0.552,0-1,0.448-1,1v5.511c0.649-0.229,1.351-0.23,2-0.002V7 l3.71-1.237C17.555,5.482,17.638,4.319,16.841,3.92z" />
        <path d="M20.844,18.845l-4.873-7.048c0.091,0.377-0.042,0.788-0.372,1.036c-0.442,0.33-1.068,0.241-1.399-0.2l-0.529-0.706 l-0.776,1.553c-0.17,0.339-0.516,0.553-0.895,0.553s-0.725-0.214-0.895-0.553l-0.776-1.553L9.8,12.632 c-0.331,0.442-0.957,0.532-1.399,0.2c-0.326-0.245-0.457-0.65-0.372-1.023l-4.87,7.058C2.245,20.195,3.197,22.002,4.809,22 L19.2,21.979C20.81,21.977,21.758,20.17,20.844,18.845z" />
      </>
    ),
  },
  content: {
    id: 'J7jXaR4xV94m',
    figma: 'icons8-opened-folder',
    body: (
      <>
        <path d="M3.501,8h16.999C21.068,8,21.584,8.19,22,8.504V8c0-1.657-1.343-3-3-3h-8l-0.544-1.632C10.184,2.551,9.419,2,8.558,2H4 C2.895,2,2,2.895,2,4v4.504C2.416,8.19,2.932,8,3.501,8z" />
        <path
          d="M20.499,8H3.501c-1.545,0-2.72,1.387-2.466,2.911l1.097,6.582C2.373,18.94,3.624,20,5.091,20h13.818 c1.467,0,2.718-1.06,2.959-2.507l1.097-6.582C23.219,9.387,22.044,8,20.499,8z"
          opacity=".35"
        />
      </>
    ),
  },
  setup: {
    id: 'Oyrj07GHAVgu',
    figma: 'icons8-edit-property',
    body: (
      <>
        <path d="M18,21H6c-1.657,0-3-1.343-3-3V7h18v11C21,19.657,19.657,21,18,21z" opacity=".35" />
        <path d="M18,3H6C4.343,3,3,4.343,3,6v1h18V6C21,4.343,19.657,3,18,3z" />
        <path d="M16,12h-4c-0.553,0-1-0.448-1-1s0.447-1,1-1h4c0.553,0,1,0.448,1,1S16.553,12,16,12z" />
        <path d="M16,16h-4c-0.553,0-1-0.448-1-1s0.447-1,1-1h4c0.553,0,1,0.448,1,1S16.553,16,16,16z" />
        <circle cx="8" cy="11" r="1" />
        <circle cx="8" cy="15" r="1" />
        <path d="M23.138,14.376c-0.827-0.595-1.987-0.42-2.707,0.3l-5.832,5.832C14.216,20.892,14,21.412,14,21.955l0,1.259 C14,23.648,14.352,24,14.786,24l1.259,0c0.542,0,1.063-0.215,1.446-0.599l5.909-5.909C24.279,16.613,24.192,15.135,23.138,14.376z" />
      </>
    ),
  },
  insights: {
    id: 'zgqqrjsaFjvr',
    figma: 'icons8-deviation',
    body: (
      <>
        <circle cx="17" cy="7" r="4" />
        <path
          d="M9,21H5c-1.105,0-2-0.895-2-2v-4c0-1.105,0.895-2,2-2h4 c1.105,0,2,0.895,2,2v4C11,20.105,10.105,21,9,21z"
          opacity=".35"
        />
        <path
          d="M19,21h-4c-1.105,0-2-0.895-2-2v-4c0-1.105,0.895-2,2-2h4 c1.105,0,2,0.895,2,2v4C21,20.105,20.105,21,19,21z"
          opacity=".35"
        />
        <path
          d="M9,11H5c-1.105,0-2-0.895-2-2V5c0-1.105,0.895-2,2-2h4 c1.105,0,2,0.895,2,2v4C11,10.105,10.105,11,9,11z"
          opacity=".35"
        />
      </>
    ),
  },
  reports: {
    id: 'otctm2S04hky',
    figma: 'icons8-pie-chart',
    body: (
      <>
        <circle cx="12" cy="12" r="10" opacity=".35" />
        <path d="M12,3.062V10c0,1.105,0.895,2,2,2h6.938c0.6,0,1.067-0.527,1-1.123c-0.517-4.625-4.189-8.297-8.814-8.814 C12.527,1.996,12,2.462,12,3.062z" />
      </>
    ),
  },
  'client-success': {
    id: 'tK6X9WVGZwQ7',
    figma: 'icons8-attendance',
    body: (
      <>
        <path d="M20.5,11c-0.384,0-0.768-0.146-1.061-0.439L17.5,8.621l-1.939,1.939c-0.586,0.586-1.535,0.586-2.121,0 c-0.586-0.585-0.586-1.536,0-2.121L15.379,6.5l-1.939-1.939c-0.586-0.585-0.586-1.536,0-2.121c0.586-0.586,1.535-0.586,2.121,0 L17.5,4.379l1.939-1.939c0.586-0.586,1.535-0.586,2.121,0c0.586,0.585,0.586,1.536,0,2.121L19.621,6.5l1.939,1.939 c0.586,0.585,0.586,1.536,0,2.121C21.268,10.854,20.884,11,20.5,11z" />
        <path d="M17,22c-0.33,0-0.661-0.108-0.937-0.329l-2.5-2c-0.647-0.518-0.752-1.461-0.234-2.108c0.518-0.646,1.462-0.751,2.108-0.234 l1.395,1.116l3.553-3.948c0.553-0.615,1.503-0.667,2.118-0.111c0.616,0.554,0.666,1.502,0.111,2.118l-4.5,5 C17.82,21.832,17.411,22,17,22z" />
        <path
          d="M9.5,8h-7C1.671,8,1,7.329,1,6.5S1.671,5,2.5,5h7C10.329,5,11,5.671,11,6.5S10.329,8,9.5,8z"
          opacity=".35"
        />
        <path
          d="M9.5,19h-7C1.671,19,1,18.329,1,17.5S1.671,16,2.5,16h7c0.829,0,1.5,0.671,1.5,1.5S10.329,19,9.5,19z"
          opacity=".35"
        />
      </>
    ),
  },
  basics: {
    id: 'OCts8o0LpHho',
    figma: 'icons8-video',
    body: (
      <>
        <path d="M15.515,11.143l-5-3A1,1,0,0,0,9,9v6a1,1,0,0,0,1.515.858l5-3a1,1,0,0,0,0-1.715Z" />
        <rect width="20" height="16" x="2" y="4" opacity=".35" rx="3" />
      </>
    ),
  },
  announcement: {
    id: 'Zftbby3vkxVB',
    figma: 'icons8-announcement',
    body: (
      <>
        <polygon points="20,21 4,15 4,9 20,3" opacity=".35" />
        <path d="M5,14.5c0-0.386,0-4.614,0-5C5,8.672,4.328,8,3.5,8S2,8.672,2,9.5c0,0.386,0,4.614,0,5C2,15.328,2.672,16,3.5,16 S5,15.328,5,14.5z" />
        <path d="M22,20.5c0-0.386,0-16.614,0-17C22,2.672,21.328,2,20.5,2S19,2.672,19,3.5c0,0.386,0,16.614,0,17c0,0.828,0.672,1.5,1.5,1.5 S22,21.328,22,20.5z" />
        <path d="M7.995,16.498L7.96,16.591c-0.389,1.034,0.134,2.187,1.168,2.576L11,19.871c1.034,0.389,2.187-0.134,2.576-1.168 l0.037-0.099L7.995,16.498z" />
      </>
    ),
  },
  help: {
    id: 'uwLgnsOQTt4y',
    figma: 'icons8-help',
    body: (
      <>
        <circle cx="12" cy="12" r="10" opacity=".35" />
        <path d="M11.883,13.973h-0.006c-0.67,0-1.187-0.605-1.072-1.265c0.35-2.013,1.917-2.083,1.917-3.333c0-0.347-0.06-1.124-0.896-1.124 c-0.452,0-0.718,0.289-0.873,0.597c-0.209,0.417-0.691,0.622-1.15,0.541l0,0C9.107,9.265,8.68,8.519,8.975,7.877 C9.397,6.96,10.261,6,11.972,6c2.776,0,3.148,2.174,3.148,3.196c0,2.416-1.799,2.506-2.172,3.898 C12.813,13.596,12.403,13.973,11.883,13.973z M13.325,16.533c0,0.412-0.127,0.76-0.382,1.043C12.687,17.858,12.352,18,11.94,18 c-0.414,0-0.748-0.142-1.003-0.424c-0.255-0.283-0.384-0.631-0.384-1.043c0-0.403,0.129-0.75,0.384-1.045 c0.255-0.293,0.589-0.439,1.003-0.439c0.412,0,0.747,0.146,1.003,0.439C13.198,15.783,13.325,16.131,13.325,16.533z" />
      </>
    ),
  },
}

export const PLUMPY_NAMES = Object.keys(PLUMPY)

/** name → the Figma/Icons8 asset name, for the Pattern Library listing. */
export const PLUMPY_SOURCES = Object.fromEntries(
  Object.entries(PLUMPY).map(([name, i]) => [name, i.figma]),
)

export function PlumpyIcon({ name, size = 24, className = '', title }) {
  const icon = PLUMPY[name]
  if (!icon) return null
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={`plumpy-icon${className ? ` ${className}` : ''}`}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : 'true'}
    >
      {title && <title>{title}</title>}
      {icon.body}
    </svg>
  )
}
