"use client";
import { motion } from "framer-motion";

const SKILLS = [
  { name: "algorithm design", key: "algo" },
  { name: "complexity", key: "complexity" },
  { name: "confirmation", key: "confirmation" },
  { name: "coding", key: "coding" },
  { name: "behavioural", key: "behavioural" },
  { name: "testing", key: "testing" },
];

export default function SkillTree({ scores }: { scores: Record<string, number> }) {
  // Size is the bounding box, center is the mid-point
  const size = 400; 
  const center = size / 2;
  const radius = size * 0.32; // Slightly reduced to give labels more room within the box

  const getCoords = (index: number, length: number, currentRadius: number) => {
    // -Math.PI / 2 keeps the first point at the very top (12 o'clock)
    const angle = (index * 2 * Math.PI) / length - Math.PI / 2;
    return {
      x: center + currentRadius * Math.cos(angle),
      y: center + currentRadius * Math.sin(angle),
    };
  };

  const fillPoints = SKILLS.map((_, i) => {
    const score = scores[SKILLS[i].key] || 0;
    const { x, y } = getCoords(i, SKILLS.length, radius * score);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[400px] mx-auto antialiased">
      <svg 
        viewBox={`0 0 ${size} ${size}`} 
        className="w-full h-full overflow-visible"
      >
        {/* Concentric Grid Rings */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((tick) => (
          <polygon
            key={tick}
            points={SKILLS.map((_, i) => {
              const { x, y } = getCoords(i, SKILLS.length, radius * tick);
              return `${x},${y}`;
            }).join(" ")}
            className="fill-none stroke-border/20 stroke-[0.5]"
          />
        ))}

        {/* Radial Spokes */}
        {SKILLS.map((_, i) => {
          const { x, y } = getCoords(i, SKILLS.length, radius);
          return (
            <line
              key={`line-${i}`}
              x1={center} y1={center} x2={x} y2={y}
              className="stroke-border/10 stroke-[0.5]"
            />
          );
        })}

        {/* Data Polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ points: fillPoints, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="fill-button-primary/10 stroke-button-primary stroke-[1.5]"
          style={{ strokeLinejoin: "round" }}
        />

        {/* Vertex Dots to soften the points */}
        {SKILLS.map((_, i) => {
          const score = scores[SKILLS[i].key] || 0;
          const { x, y } = getCoords(i, SKILLS.length, radius * score);
          return (
            <circle
              key={`dot-${i}`}
              cx={x} cy={y}
              r="2.5"
              className="fill-button-primary"
            />
          );
        })}
      </svg>

      {/* Floating Labels */}
      {SKILLS.map((skill, i) => {
        // Radius + 55 ensures labels don't overlap the outer ring
        const { x, y } = getCoords(i, SKILLS.length, radius + 55);
        const scoreValue = (scores[skill.key] || 0) * 100;
        
        return (
          <div
            key={skill.key}
            style={{
              position: "absolute",
              left: `${(x / size) * 100}%`,
              top: `${(y / size) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
            className="flex flex-col items-center justify-center text-center select-none w-24 "
          >
            <span className="text-[10px] font-mono uppercase tracking-tight font-bold">
              {skill.name}
            </span>
            <span className="text-[13px] font-sans font-light text-foreground ">
              {scoreValue.toFixed(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}