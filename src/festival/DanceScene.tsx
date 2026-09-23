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

  // One full side-to-side sway every two beats; arms flow over four beats.
  const sway = Math.PI * beats + phase;
  const flow = (Math.PI / 2) * beats + phase;
  const s = Math.sin(sway);

  const pose = {
    leftUpperArm: 115 + 40 * Math.sin(flow),
    leftForearm: 30 + 25 * Math.sin(flow + 0.9),
    rightUpperArm: -(115 + 40 * Math.sin(flow + Math.PI)),
    rightForearm: -(30 + 25 * Math.sin(flow + Math.PI + 0.9)),
    leftThigh: 8 + 8 * s,
    leftShin: -14 * Math.max(0, s) ** 2,
    rightThigh: -8 + 8 * s,
    rightShin: 14 * Math.max(0, -s) ** 2,
  };

  // Gentle knee dip on every beat instead of jumping.
  const dip = 8 * (1 - Math.cos(2 * sway)) * 0.5;
  const hipShift = 22 * s;
  const lean = 5 * s;
  const drift = 50 * Math.sin((Math.PI / 8) * beats + phase);

  const enter = spring({
    frame: frame - enterDelay,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });

  const size = height * 0.45;

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${baseX + drift}px)`,
        bottom: height * 0.18,
        transform: `translateX(-50%) scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
        transformOrigin: "bottom center",
        opacity: enter,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -12,
          width: size * 0.42,
          height: 24,
          transform: `translateX(calc(-50% + ${hipShift}px))`,
          borderRadius: "50%",
          background: "rgba(60, 40, 90, 0.12)",
        }}
      />
      <div
        style={{
          transform: `translate(${hipShift}px, ${dip}px) rotate(${lean}deg)`,
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
          baseX={-240}
          enterDelay={0}
        />
        <Dancer
          hair="bob"
          color={womanColor}
          beats={beats}
          phase={Math.PI / 2}
          baseX={240}
          enterDelay={6}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
