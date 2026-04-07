import { useEffect, useRef } from "react";

type Props = { onTimeUp: () => void };

const Timer = ({ onTimeUp }: Props) => {
  const TOTAL = 300;
  // We track time via a ref + DOM update to avoid re-render flood
  const timeRef     = useRef(TOTAL);
  const circleRef   = useRef<SVGCircleElement>(null);
  const labelRef    = useRef<HTMLSpanElement>(null);
  const containerRef= useRef<HTMLDivElement>(null);
  const doneRef     = useRef(false);

  const RADIUS = 18;
  const CIRC   = 2 * Math.PI * RADIUS;

  useEffect(() => {
    const tick = setInterval(() => {
      timeRef.current -= 1;
      const t   = timeRef.current;
      const pct = t / TOTAL;

      // Update circle stroke
      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = `${CIRC * (1 - pct)}`;
        circleRef.current.style.stroke =
          t <= 30  ? "#ef4444" :
          t <= 60  ? "#f59e0b" : "#8b5cf6";
      }

      // Update label
      if (labelRef.current) {
        const m = Math.floor(t / 60);
        const s = t % 60;
        labelRef.current.textContent = `${m}:${s < 10 ? "0" + s : s}`;
      }

      // Pulse when low
      if (t <= 10 && containerRef.current) {
        containerRef.current.classList.add("animate-pulse");
      }

      if (t <= 0 && !doneRef.current) {
        doneRef.current = true;
        clearInterval(tick);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [onTimeUp]);

  const m0 = Math.floor(TOTAL / 60);
  const s0 = TOTAL % 60;

  return (
    <div ref={containerRef} className="flex items-center gap-2">
      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
        {/* Track */}
        <circle cx="22" cy="22" r={RADIUS} fill="none" stroke="#1f2937" strokeWidth="3" />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx="22" cy="22" r={RADIUS}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset="0"
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.5s" }}
        />
      </svg>
      <span ref={labelRef} className="text-sm font-mono font-medium text-gray-300 tabular-nums">
        {m0}:{s0 < 10 ? "0" + s0 : s0}
      </span>
    </div>
  );
};

export default Timer;
