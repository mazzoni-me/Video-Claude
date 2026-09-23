import { FESTIVAL_YELLOW } from "./palette";

type Hair = "curly" | "bob";

type Pose = {
  leftUpperArm: number;
  leftForearm: number;
  rightUpperArm: number;
  rightForearm: number;
  leftThigh: number;
  leftShin: number;
  rightThigh: number;
  rightShin: number;
};

const STROKE = 14;

// Angles are in degrees, 0 = limb pointing straight down.
// Positive rotates towards the figure's left side of the screen.
const Limb: React.FC<{
  x: number;
  y: number;
  upper: number;
  lower: number;
  upperLength: number;
  lowerLength: number;
  color: string;
  bracelet?: boolean;
}> = ({ x, y, upper, lower, upperLength, lowerLength, color, bracelet }) => (
  <g transform={`translate(${x} ${y}) rotate(${upper})`}>
    <line x1={0} y1={0} x2={0} y2={upperLength} stroke={color} />
    <g transform={`translate(0 ${upperLength}) rotate(${lower})`}>
      <line x1={0} y1={0} x2={0} y2={lowerLength} stroke={color} />
      {bracelet ? (
        <rect
          x={-13}
          y={lowerLength - 22}
          width={26}
          height={12}
          rx={6}
          fill={FESTIVAL_YELLOW}
          stroke="none"
        />
      ) : null}
    </g>
  </g>
);

export const StickFigure: React.FC<{
  color: string;
  hair: Hair;
  pose: Pose;
  size: number;
}> = ({ color, hair, pose, size }) => {
  const headX = 150;
  const headY = 90;
  const headR = 36;

  return (
    <svg
      viewBox="0 0 300 500"
      width={size * 0.6}
      height={size}
      style={{ overflow: "visible" }}
    >
      <g
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {hair === "bob" ? (
          <path
            d={`M ${headX - 50} 136 L ${headX - 50} 88 Q ${headX - 50} 38 ${headX} 38 Q ${headX + 50} 38 ${headX + 50} 88 L ${headX + 50} 136 Z`}
            fill={color}
            stroke="none"
          />
        ) : null}

        <line x1={150} y1={headY + headR} x2={150} y2={285} stroke={color} />

        <Limb
          x={150}
          y={290}
          upper={pose.leftThigh}
          lower={pose.leftShin}
          upperLength={80}
          lowerLength={78}
          color={color}
        />
        <Limb
          x={150}
          y={290}
          upper={pose.rightThigh}
          lower={pose.rightShin}
          upperLength={80}
          lowerLength={78}
          color={color}
        />

        {hair === "bob" ? (
          <path d="M 150 240 L 104 318 L 196 318 Z" fill={color} stroke={color} />
        ) : null}

        <Limb
          x={150}
          y={160}
          upper={pose.rightUpperArm}
          lower={pose.rightForearm}
          upperLength={62}
          lowerLength={58}
          color={color}
        />

        {/* Faceless silhouette: head and hair share the figure colour. */}
        <circle cx={headX} cy={headY} r={headR} fill={color} stroke="none" />
        {hair === "bob" ? (
          <path
            d={`M ${headX - 44} ${headY - 8} Q ${headX - 44} ${headY - 50} ${headX} ${headY - 50} Q ${headX + 44} ${headY - 50} ${headX + 44} ${headY - 8} Z`}
            fill={color}
            stroke="none"
          />
        ) : (
          <CurlyHair cx={headX} cy={headY} r={headR} color={color} />
        )}

        {/* Drawn last so the bracelet stays visible when the arm is raised. */}
        <Limb
          x={150}
          y={160}
          upper={pose.leftUpperArm}
          lower={pose.leftForearm}
          upperLength={62}
          lowerLength={58}
          color={color}
          bracelet
        />
      </g>
    </svg>
  );
};

const CurlyHair: React.FC<{
  cx: number;
  cy: number;
  r: number;
  color: string;
}> = ({ cx, cy, r, color }) => {
  // Small overlapping bumps in the same colour as the head give a soft,
  // curly outline without drawing individual curls.
  const bumps: { x: number; y: number; size: number }[] = [];
  for (let deg = -190; deg <= 10; deg += 18) {
    const a = (deg * Math.PI) / 180;
    bumps.push({
      x: cx + Math.cos(a) * (r + 2),
      y: cy - 6 + Math.sin(a) * (r + 4),
      size: 13,
    });
  }

  return (
    <g fill={color} stroke="none">
      {bumps.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={b.size} />
      ))}
    </g>
  );
};
