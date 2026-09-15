/* Open Library's cover CDN. `?default=false` 404s on a missing cover rather
   than serving a blank, which is what lets `BookCover` fall back to its own
   gradient instead of showing an empty grey rectangle. */

export const coverUrl = (isbn) =>
  isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false` : null

/* The same CDN by Open Library's own numeric cover id. An ISBN can resolve to a
   foreign or coverless edition; a cover id is the exact image, so it's the more
   reliable handle when you have one — `coverId` wins over `isbn` in
   `BookCover`. */
export const coverIdUrl = (id) =>
  id ? `https://covers.openlibrary.org/b/id/${id}-M.jpg?default=false` : null
