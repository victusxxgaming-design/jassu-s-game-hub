import { useRef, useState } from "react";
import { Crosshair, Settings, Minus, X } from "lucide-react";

const LEFT = ["Enable Hook", "Aimbot Visible", "Silent Aim", "Drag Aimbot", "Ignore Knock", "No Recoil", "Sniper Scope", "AimFov"];
const RIGHT = ["Esp Line", "Esp CornerBox", "Esp Skeleton", "Esp Info", "Esp Rgb", "Esp Tracker", "Esp Rank", "ESP Weapon", "Invalid Timer", "Esp Fix"];

function Box({ on }: { on: boolean }) {
  return (
    <span
      className={`grid h-[15px] w-[15px] shrink-0 place-items-center rounded-[3px] border transition-colors ${
        on ? "border-[#ff1a1a] bg-[#ff1a1a]" : "border-[#5a5a5a] bg-[#1b1b1b]"
      }`}
    >
      {on && <span className="h-[6px] w-[6px] rounded-[1px] bg-white" />}
    </span>
  );
}

function KeyBtn() {
  return (
    <span className="ml-2 rounded-[3px] border border-[#4a4a4a] bg-[#2a2a2a] px-2 py-[1px] text-[9px] font-bold text-white">Key</span>
  );
}

function Check({ label, on, toggle, keyBtn }: { label: string; on: boolean; toggle: () => void; keyBtn?: boolean }) {
  return (
    <div className="flex h-[18px] items-center">
      <button type="button" onClick={toggle} className="flex items-center gap-2 text-[10.5px] font-bold text-[#e8e8e8] hover:text-white">
        <Box on={on} />
        {label}
      </button>
      {keyBtn && <KeyBtn />}
    </div>
  );
}

function Bar({ value, max, onChange, h = 9 }: { value: number; max: number; onChange: (v: number) => void; h?: number }) {
  const p = (value / max) * 100;
  return (
    <div className="relative w-full rounded-[3px] bg-[#3a3a3a]" style={{ height: h }}>
      <div className="absolute inset-y-0 left-0 rounded-[3px] bg-[#ff0000]" style={{ width: `${p}%` }} />
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}

export function CheatPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [state, setState] = useState<Record<string, boolean>>({});
  const [fov, setFov] = useState(1010);
  const [thr, setThr] = useState(15);
  const [dist, setDist] = useState(25);
  const [tab, setTab] = useState(0);

  const toggle = (k: string) => setState((s) => ({ ...s, [k]: !s[k] }));

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: y * -6, y: x * 8 });
  };

  return (
    <div style={{ perspective: "1000px" }} className="pointer-events-auto">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        className="w-[330px] select-none overflow-hidden rounded-[4px] bg-[#141414] shadow-2xl shadow-black/70 transition-transform duration-200 ease-out"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, fontFamily: "Segoe UI, Arial, sans-serif" }}
      >
        {/* Title bar */}
        <div className="flex h-[30px] items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black italic leading-[0.8] text-[#ff1a1a] [text-shadow:1px_1px_0_#fff]">
              JASSU<br />CHEATS
            </span>
            <span className="text-[12px] tracking-wide text-white"><span className="text-[#ff2a2a]">JASSU</span> CHEATS</span>
          </div>
          <div className="flex gap-[2px]">
            {[Crosshair, Settings].map((I, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTab(i)}
                className={`grid h-[22px] w-[26px] place-items-center rounded-[3px] ${tab === i ? "bg-[#ff0000]" : "bg-[#262626]"} text-white`}
              >
                <I className="h-3 w-3" strokeWidth={3} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Minus className="h-3 w-3 text-white/80" />
            <X className="h-3 w-3 text-[#ff2a2a]" />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-[6px] px-[5px]">
          <div className="flex flex-col gap-[5px] rounded-[3px] bg-[#1c1c1c] px-2 py-2">
            {LEFT.map((l) => (
              <Check key={l} label={l} on={!!state[l]} toggle={() => toggle(l)} keyBtn={l === "Aimbot Visible"} />
            ))}
            <div className="mt-1 text-[8.5px] text-[#ddd]">AimFov</div>
            <div className="flex items-center gap-2">
              <Bar value={fov} max={1300} onChange={setFov} h={10} />
              <span className="text-[9px] font-bold text-white">{fov}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="text-[8px] text-[#ddd]">Drag Threshold</div>
                <Bar value={thr} max={100} onChange={setThr} />
              </div>
              <div className="space-y-1">
                <div className="text-[8px] text-[#ddd]">Drag Distance</div>
                <Bar value={dist} max={100} onChange={setDist} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[5px] rounded-[3px] bg-[#1c1c1c] px-2 py-2">
            {RIGHT.map((l) => (
              <Check key={l} label={l} on={!!state[l]} toggle={() => toggle(l)} keyBtn={l === "Esp Fix"} />
            ))}
            <div className="flex h-[18px] items-center gap-2 text-[10.5px] font-bold text-[#e8e8e8]">
              <button type="button" onClick={() => toggle("Nick Name")}><Box on={!!state["Nick Name"]} /></button>
              Nick Name
              <span className="flex-1 truncate rounded-[3px] border border-[#3a3a3a] bg-[#222] px-1.5 py-[1px] text-[8.5px]">JASSU CHEATS</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between px-2 py-[5px] text-[8.5px] font-bold">
          <span className="text-[#ffd400]">Esp Fix Auto Refresh Disabled</span>
          <span className="text-white">User: C E O</span>
        </div>
      </div>
    </div>
  );
}
