/** Shared SVG filter: animated displacement + red channel split, applied to project thumbnails on hover. */
export default function SvgFilters() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="distort" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.06" numOctaves="2" seed="3" result="noise">
            <animate attributeName="baseFrequency" dur="1.6s" values="0.012 0.06;0.02 0.12;0.012 0.06" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feOffset in="displaced" dx="-6" dy="0" result="shifted" />
          <feColorMatrix
            in="shifted"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0"
            result="redLayer"
          />
          <feBlend in="displaced" in2="redLayer" mode="screen" />
        </filter>
      </defs>
    </svg>
  )
}
