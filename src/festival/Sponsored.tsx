import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./fonts";
import { INTRO_BACKGROUND } from "./palette";

export const Sponsored: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: INTRO_BACKGROUND,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 600,
          fontSize: 44,
          letterSpacing: interpolate(enter, [0, 1], [2, 10]),
          color: "#FFFFFF",
          opacity: enter * (1 - exit),
          transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
          textShadow: "0 3px 0 rgba(94, 70, 160, 0.3)",
        }}
      >
        sponsored by
      </div>
    </AbsoluteFill>
  );
};
