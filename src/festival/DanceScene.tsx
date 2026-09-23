import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StickFigure } from "./StickFigure";
import { PASTEL_BACKGROUNDS, PASTEL_FIGURES } from "./palette";

// How many frames each colour lasts before switching.
const COLOR_STEP = 5;

type DancerProps = {
  hair: "curly" | "bob";
  color: string;
  // Beats per second and phase make each dancer move in their own way.
  tempo: number;
  phase: number;
  baseX: number;
  enterDelay: number;
};

const Dancer: React.FC<DancerProps> = ({
  hair,
  color,
  tempo,
  phase,
  baseX,
  enterDelay,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const t = (frame / fps) * Math.PI * 2 * tempo + phase;
  const s = Math.sin(t);
  const c = Math.cos(t);
  const slow = Math.sin(t / 4);

  const pose = {
    leftUpperArm: 125 + 45 * s,
    leftForearm: 35 + 35 * Math.sin(t + 1.2),
    rightUpperArm: -(110 + 55 * Math.sin(t + Math.PI * 0.8)),
    rightForearm: -(25 + 40 * Math.sin(t + 2)),
    leftThigh: 14 + 18 * Math.max(0, s),
    leftShin: -Math.max(0, 40 * s),
    rightThigh: -14 - 18 * Math.max(0, -s),
    rightShin: Math.max(0, -40 * s),
  };

  const bounce = Math.abs(Math.sin(t)) * 45;
  const sway = 8 * c;
  const drift = 110 * slow;
  // Every so often the dancer quickly turns around, flipping horizontally.
  const turn = Math.max(-1, Math.min(1, Math.cos(t / 3) * 5));

  const enter = spring({
    frame: frame - enterDelay,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const size = height * 0.72;

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${baseX + drift}px)`,
        bottom: height * 0.1,
        transform: `translateX(-50%) scale(${enter})`,
        transformOrigin: "bottom center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -18,
          width: size * 0.42,
          height: 36,
          transform: `translateX(-50%) scaleX(${1 - bounce / 150})`,
          borderRadius: "50%",
          background: "rgba(60, 40, 90, 0.12)",
        }}
      />
      <div
        style={{
          transform: `translateY(${-bounce}px) rotate(${sway}deg) scaleX(${turn})`,
          transformOrigin: "bottom center",
        }}
      >
        <StickFigure color={color} hair={hair} pose={pose} size={size} />
      </div>
    </div>
  );
};

export const DanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const step = Math.floor(frame / COLOR_STEP);
  const n = PASTEL_BACKGROUNDS.length;
  const background = PASTEL_BACKGROUNDS[step % n];
  // Offset the figure colours so they never share the background's hue.
  const manColor = PASTEL_FIGURES[(step + 2) % n];
  const womanColor = PASTEL_FIGURES[(step + 4) % n];

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: background }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <Dancer
          hair="curly"
          color={manColor}
          tempo={1.05}
          phase={0}
          baseX={-330}
          enterDelay={0}
        />
        <Dancer
          hair="bob"
          color={womanColor}
          tempo={0.9}
          phase={1.7}
          baseX={330}
          enterDelay={6}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
