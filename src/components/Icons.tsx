type P = { className?: string }

export const LinkedInIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-4V9.75Z" />
  </svg>
)

export const GitHubIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
)

export const ArrowIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M5 19 19 5M9 5h10v10" />
  </svg>
)

export const DownloadIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M12 3v12m0 0 5-5m-5 5-5-5M4 21h16" />
  </svg>
)

export const RobotIcon = ({ className }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <rect x="6" y="9" width="20" height="16" rx="3" fill="#0A0A0A" stroke="#FF1E1E" strokeWidth="1.5" />
    <path d="M16 9V4" stroke="#FFFFFF" strokeWidth="1.5" />
    <circle cx="16" cy="3.5" r="1.8" fill="#FF1E1E" />
    <circle cx="11.5" cy="16" r="2.2" fill="#FF1E1E" />
    <circle cx="20.5" cy="16" r="2.2" fill="#FF1E1E" />
    <path d="M11 21h10" stroke="#FFFFFF" strokeWidth="1.5" />
    <path d="M3 14v6M29 14v6" stroke="#A1A1A1" strokeWidth="2" />
  </svg>
)
