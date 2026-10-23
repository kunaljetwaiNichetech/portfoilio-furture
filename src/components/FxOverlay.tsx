export default function FxOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <div className="fx-scanlines absolute inset-0" />
      <div className="fx-grain absolute" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%)' }} />
    </div>
  )
}
