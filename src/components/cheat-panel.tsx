import { useRef, useState } from "react";
import { Crosshair, Settings, Minus, X } from "lucide-react";

const LEFT = ["Enable Hook", "Aimbot Visible", "Silent Aim", "Drag Aimbot", "Ignore Knock", "No Recoil", "Sniper Scope", "AimFov"];
const RIGHT = ["Esp Line", "Esp CornerBox", "Esp Skeleton", "Esp Info", "Esp Rgb", "Esp Tracker", "Esp Rank", "ESP Weapon", "Invalid Timer", "Esp Fix"];

function Check({ label, on, toggle, keyBtn }: { label: string; on: boolean; toggle: () => void; keyBtn?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-2 text-[11px] font-semibold text-white/90 hover:text-white"
      >
        <span
          className={`h-3.5 w-3.5 rounded-[3px] border transition-colors ${on ? "border-red-500 bg-red-600" : "border-white/40 bg-transparent"}`}
        />
        {label}
      </button>
      {keyBtn && (
        <span className="rounded border border-white/15 bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-white/90">Key</span>
      )}
    </div>
  );
}

function Slider({ label, value, max, onChange, showValue }: { label: string; value: number; max: number; onChange: (v: number) => void; showValue?: boolean }) {
  return (
    <div className="space-y-1">
      <div className="text-[9px] text-white/80">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="panel-range w-full"
          style={{ ["--p" as string]: `${(value / max) * 100}%` }}
        />
        {showValue && <span className="w-7 text-[10px] font-semibold text-white">{value}</span>}
      </div>
    </div>
  );
}

export function CheatPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [state, setState] = useState<Record<string, boolean>>({ "Enable Hook": true, "Esp Line": true, "Esp Skeleton": true });
  const [fov, setFov] = useState(1010);
  const [thr, setThr] = useState(20);
  const [dist, setDist] = useState(25);
  const [tab, setTab] = useState(0);

  const toggle = (k: string) => setState((s) => ({ ...s, [k]: !s[k] }));

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: y * -10, y: x * 12 });
  };

  return (
    <div style={{ perspective: "1000px" }} className="pointer-events-auto">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        className="w-[340px] sm:w-[400px] select-none rounded-md border border-white/10 bg-neutral-950/90 shadow-2xl shadow-red-900/30 backdrop-blur transition-transform duration-200 ease-out"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black italic leading-none text-red-600">JC</span>
            <span className="text-xs font-semibold tracking-wide"><span className="text-red-500">JASSU</span> <span className="text-white">CHEATS</span></span>
          </div>
          <div className="flex overflow-hidden rounded">
            {[Crosshair, Settings].map((I, i) => (
              <button key={i} type="button" onClick={() => setTab(i)} className={`px-2.5 py-1 ${tab === i ? "bg-red-600 text-white" : "bg-neutral-800 text-white/80"}`}>
                <I className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Minus className="h-3 w-3" />
            <X className="h-3 w-3 text-red-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 px-1.5">
          <div className="space-y-2 rounded bg-neutral-900 p-2.5">
            {LEFT.map((l) => (
              <Check key={l} label={l} on={!!state[l]} toggle={() => toggle(l)} keyBtn={l === "Aimbot Visible"} />
            ))}
            <Slider label="AimFov" value={fov} max={1500} onChange={setFov} showValue />
            <div className="grid grid-cols-2 gap-2">
              <Slider label="Drag Threshold" value={thr} max={100} onChange={setThr} />
              <Slider label="Drag Distance" value={dist} max={100} onChange={setDist} />
            </div>
          </div>
          <div className="space-y-2 rounded bg-neutral-900 p-2.5">
            {RIGHT.map((l) => (
              <Check key={l} label={l} on={!!state[l]} toggle={() => toggle(l)} keyBtn={l === "Esp Fix"} />
            ))}
            <div className="flex items-center gap-2 text-[11px] font-semibold text-white/90">
              <span className="h-3.5 w-3.5 rounded-[3px] border border-white/40" />
              Nick Name
              <span className="flex-1 truncate rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[9px]">JASSU CHEATS</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between px-3 py-1.5 text-[9px] font-semibold">
          <span className="text-yellow-400">Esp Fix Auto Refresh Disabled</span>
          <span className="text-white">User: C E O</span>
        </div>
      </div>
    </div>
  );
}
