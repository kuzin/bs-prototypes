import React from 'react'
import { ImageDropzone } from 'bs-prototypes'

const PREVIEW =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='320' height='120'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='0' stop-color='#0DA7BC'/><stop offset='1' stop-color='#0B3B5A'/>" +
      "</linearGradient></defs>" +
      "<rect width='320' height='120' fill='url(#g)'/>" +
      "<text x='160' y='66' font-family='Nunito, sans-serif' font-size='22' font-weight='800' " +
      "fill='white' text-anchor='middle'>Summer Reading 2026</text></svg>",
  )

export const Empty = () => {
  const [name, setName] = React.useState<string | undefined>(undefined)
  return (
    <ImageDropzone
      fileName={name}
      onFile={setName}
      hint="920 × 351px · jpg, png, gif · &lt; 10MB"
    />
  )
}

export const WithPreview = () => {
  const [name, setName] = React.useState<string | undefined>('summer-reading-banner.png')
  return (
    <ImageDropzone
      fileName={name}
      previewSrc={PREVIEW}
      onFile={setName}
      onClear={() => setName(undefined)}
      hint="920 × 351px · jpg, png, gif"
    />
  )
}
