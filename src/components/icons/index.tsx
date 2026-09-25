// Chevron exact du header source (10×7, fill currentColor)
export function ChevronDown({ className = "h-[10px] w-[10px]" }: { className?: string }) {
  return (
    <svg className={className} width="10" height="7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 6.16667L0 1.16667L1.16667 0L5 3.83333L8.83333 0L10 1.16667L5 6.16667Z" fill="currentColor" />
    </svg>
  );
}

// Icône checkmark des listes "branded"
export function Checkmark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
      <path d="M7 12.5L10.5 16L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5 0.5L15 6L10.5 11.5M15 6H0" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
