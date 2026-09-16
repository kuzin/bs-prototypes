/**
 * Text, addressed by the role name the app uses.
 *
 * `<Text role="sectionTitle">` renders the generated `.m-t-section-title` class, which carries the
 * exact size / weight / letter-spacing / line-height / colour from `fontStyles.sectionTitle`. That
 * naming is the point: it makes the prototype legible as a spec, because "that heading is
 * fontStyles.sectionTitle" names something a mobile engineer can type.
 *
 * Roles are not enumerated here on purpose — the generated stylesheet is the list, so a role added
 * to the RN app arrives with the next `pnpm mobile:tokens` and needs no change in this file.
 */
const kebab = (s) =>
  s
    .replace(/Style$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .toLowerCase()

export function Text({ role = 'bodyRegular', as: As = 'span', lines, className = '', ...rest }) {
  const classes = [`m-t-${kebab(role)}`, lines ? `m-clamp-${lines}` : '', className]
    .filter(Boolean)
    .join(' ')
  return <As className={classes} {...rest} />
}
