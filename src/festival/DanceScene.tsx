import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { beatsAt } from "./music";
import { StickFigure } from "./StickFigure";
import { PASTEL_BACKGROUNDS, PASTEL_FIGURES } from "./palette";

// Colours switch this many times per beat.
const COLOR_CHANGES_PER_BEAT = 2;

type DancerProps = {
  hair: "curly" | "bob";
  color: string;
  // Beats elapsed in the song, drives every movement.
  beats: number;
  // Offset (in radians) so the two dancers don't move in unison.
  phase: number;
  baseX: number;
  enterDelay: number;
};

const Dancer: React.FC<DancerProps> = ({
  hair,
  color,
  beats,
  phase,
  baseX,
  enterDelay,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  // One movement cycle every two beats, so every bounce lands on a beat.
  const t = Math.PI * beats + phase;
  const s = Math.sin(t);
  const c = Math.cos(t);

  const pose = {
    leftUpperArm: 105 + 40 * s,
    leftForearm: 15 + 30 * Math.sin(t + 1.2),
    rightUpperArm: -(110 + 55 * Math.sin(t + Math.PI * 0.8)),
    rightForearm: -(25 + 40 * Math.sin(t + 2)),
    leftThigh: 14 + 18 * Math.max(0, s),
    leftShin: -Math.max(0, 40 * s),
    rightThigh: -14 - 18 * Math.max(0, -s),
    rightShin: Math.max(0, -40 * s),
  };

  const size = height * 0.32;
  const bounce = Math.abs(s) * size * 0.08;
  const sway = 8 * c;
  const drift = 90 * Math.sin(t / 4);
  // Every so often the dancer quickly turns around, flipping horizontally.
  const turn = Math.max(-1, Math.min(1, Math.cos(t / 3 + phase) * 5));

  const enter = spring({
    frame: frame - enterDelay,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${baseX + drift}px)`,
        bottom: height * 0.22,
        transform: `translateX(-50%) scale(${enter})`,
        transformOrigin: "bottom center",
      }}
    >
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

export const DanceScene: React.FC<{ startFrame: number }> = ({
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const beats = beatsAt(startFrame + frame, fps);

  const step = Math.floor(beats * COLOR_CHANGES_PER_BEAT);
  const n = PASTEL_BACKGROUNDS.length;
  const index = ((step % n) + n) % n;
  const background = PASTEL_BACKGROUNDS[index];
  // Offset the figure colours so they never share the background's hue.
  const manColor = PASTEL_FIGURES[(index + 2) % n];
  const womanColor = PASTEL_FIGURES[(index + 4) % n];

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
          beats={beats}
          phase={0}
          baseX={-220}
          enterDelay={0}
        />
        <Dancer
          hair="bob"
          color={womanColor}
          beats={beats}
          phase={1.7}
          baseX={220}
          enterDelay={6}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
