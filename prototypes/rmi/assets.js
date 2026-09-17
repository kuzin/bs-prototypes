// The app's own artwork — Benny, the checkpoint scenes, the Likert faces and
// the eleven motivation-type portraits — copied out of rmi-app's
// `app/assets/images` into `public/rmi/`.
//
// Everything is served under Vite's base (`/bs-prototypes/`), so a bare
// `/rmi/…` would 404 both in dev and on Pages; this prefixes it the way
// ReaderApp does.
export const asset = (path) => `${import.meta.env.BASE_URL}rmi/${path}`
