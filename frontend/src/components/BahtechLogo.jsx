export default function BahtechLogo({ size = 'md' }) {
  const heights = { sm: 20, md: 28, lg: 38 }
  const h = heights[size] || heights.md

  return (
    <img
      src="/logo-bahtech.png"
      alt="Bahtech"
      style={{ height: h, objectFit: 'contain' }}
    />
  )
}
