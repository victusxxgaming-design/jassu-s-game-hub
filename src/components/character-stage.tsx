import { useEffect, useRef, useState } from "react";
import bg from "@/assets/ff-bg.jpg";
import char1 from "@/assets/char-1.png";
import char2 from "@/assets/char-2.png";
import char3 from "@/assets/char-3.png";

type Char = {
  src: string;
  alt: string;
  reaction: string;
  className: string;
};

const CHARACTERS: Char[] = [
  { src: char1, alt: "Rifle hero", reaction: "Booyah! 🔥", className: "left-[-6%] md:left-[1%] h-[62vh] md:h-[82vh] z-[3]" },
  { src: char2, alt: "Pistol heroine", reaction: "Let's go! 😎", className: "left-[16%] h-[66vh] z-[2] hidden lg:block" },
  { src: char3, alt: "Shotgun hero", reaction: "Bring it! 💥", className: "right-[-6%] md:right-[1%] h-[62vh] md:h-[82vh] z-[3]" },
];

function Character({ c, mouse }: { c: Char; mouse: { x: number; y: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.25; // head height
    const dx = Math.max(-1, Math.min(1, (mouse.x - cx) / (window.innerWidth / 2)));
    const dy = Math.max(-1, Math.min(1, (mouse.y - cy) / (window.innerHeight / 2)));
    setTilt({ ry: dx * 22, rx: -dy * 10, tx: dx * 14 });
  }, [mouse]);

  const scale = hover ? 1.14 : 1;
  const z = hover ? 120 : 0;

  return (
    <div
      ref={ref}
      className={`character-stage-item absolute bottom-0 pointer-events-auto ${c.className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        transform: `translateX(${tilt.tx}px) translateZ(${z}px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${scale})`,
        zIndex: hover ? 30 : undefined,
      }}
    >
      {hover && <div className="character-reaction">{c.reaction}</div>}
      <img
        src={c.src}
        alt={c.alt}
        draggable={false}
        className={`h-full w-auto select-none ${hover ? "character-hover" : "character-idle"}`}
      />
    </div>
  );
}

export function CharacterStage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMouse({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setMouse({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const px = typeof window === "undefined" ? 0 : (mouse.x / (window.innerWidth || 1) - 0.5) * -20;
  const py = typeof window === "undefined" ? 0 : (mouse.y / (window.innerHeight || 1) - 0.5) * -12;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <img
        src={bg}
        alt=""
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out"
        style={{ transform: `scale(1.08) translate(${px}px, ${py}px)` }}
      />
      <div className="character-stage-scrim absolute inset-0" />
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{ perspective: "1200px" }}>
        {CHARACTERS.map((c) => (
          <Character key={c.alt} c={c} mouse={mouse} />
        ))}
      </div>
    </div>
  );
}
