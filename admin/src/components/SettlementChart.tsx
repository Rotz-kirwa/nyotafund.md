export function SettlementChart() {
  return (
    <div className="rounded-2xl p-6 border border-white/5 bg-white/[0.02] mb-8 relative overflow-hidden backdrop-blur-md">
      <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Live Settlement Trends (24h)
      </h3>
      <div className="h-44 w-full relative flex items-end">
        {/* Glowing SVG Wave representing settlements */}
        <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Fill */}
          <path d="M0,100 C15,80 30,95 45,70 C60,45 75,60 90,40 C95,30 100,20 100,20 L100,100 Z" fill="url(#chartGlow)" />
          {/* Stroke */}
          <path d="M0,100 C15,80 30,95 45,70 C60,45 75,60 90,40 C95,30 100,20 100,20" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.04]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full h-px bg-white" />
          ))}
        </div>

        {/* Chart X-Axis Labels */}
        <div className="absolute bottom-2 inset-x-0 flex justify-between px-2 text-[10px] text-white/30 font-semibold uppercase tracking-wider">
          <span>08:00 AM</span>
          <span>12:00 PM</span>
          <span>04:00 PM</span>
          <span>08:00 PM</span>
          <span>12:00 AM</span>
          <span>Live</span>
        </div>
      </div>
    </div>
  );
}
