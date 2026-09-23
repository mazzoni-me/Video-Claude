import { measureText } from "@remotion/layout-utils";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily, waitUntilDone } from "./fonts";
import { FESTIVAL_YELLOW, INTRO_BACKGROUND } from "./palette";

const WORDS = ["Roma", "Europa", "Festival"];
const WORD_COLORS = ["#FFFFFF", "#FFFFFF", "#FFFFFF"];
const FONT_SIZE = 130;
const FONT_WEIGHT = "800";
const LINE_HEIGHT = 170;
// Frame at which each word starts rising from the bottom.
const ENTER_AT = [5, 25, 45];
const MERGE_AT = 80;
const EXIT_AT = 135;

export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const [handle] = useState(() => delayRender("Loading title font"));
  const [widths, setWidths] = useState<number[] | null>(null);

  useEffect(() => {
    waitUntilDone().then(() => {
      setWidths(
        WORDS.map(
          (text) =>
            measureText({
              text,
              fontFamily,
              fontSize: FONT_SIZE,
              fontWeight: FONT_WEIGHT,
            }).width,
        ),
      );
      continueRender(handle);
    });
  }, [handle]);

  if (!widths) {
    return null;
  }

  const totalWidth = widths.reduce((a, b) => a + b, 0);
  const merge = spring({
    frame: frame - MERGE_AT,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const pop = spring({
    frame: frame - (MERGE_AT + 22),
    fps,
    config: { damping: 8, stiffness: 200 },
  });
  const exit = interpolate(frame, [EXIT_AT, EXIT_AT + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const groupScale =
    interpolate(merge, [0, 1], [1.25, 1]) +
    interpolate(pop, [0, 0.5, 1], [0, 0.08, 0]) +
    exit * 0.15;

  let offset = -totalWidth / 2;

  return (
    <AbsoluteFill style={{ background: INTRO_BACKGROUND }}>
      <AbsoluteFill
        style={{
          transform: `scale(${groupScale}) translateY(${exit * -40}px)`,
          opacity: 1 - exit,
          filter: `blur(${exit * 12}px)`,
        }}
      >
        {WORDS.map((word, i) => {
          const enter = spring({
            frame: frame - ENTER_AT[i],
            fps,
            config: { damping: 13, stiffness: 110 },
          });
          const mergedX = offset + widths[i] / 2;
          offset += widths[i];
          const stackedY = (i - 1) * LINE_HEIGHT;

          const x = interpolate(merge, [0, 1], [0, mergedX]);
          const y =
            interpolate(merge, [0, 1], [stackedY, 0]) +
            interpolate(enter, [0, 1], [height, 0]);
          const color = interpolateColors(
            merge,
            [0, 1],
            [WORD_COLORS[i], FESTIVAL_YELLOW],
          );

          return (
            <div
              key={word}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                opacity: interpolate(enter, [0, 0.4], [0, 1], {
                  extrapolateRight: "clamp",
                }),
                fontFamily,
                fontWeight: FONT_WEIGHT,
                fontSize: FONT_SIZE,
                lineHeight: 1,
                whiteSpace: "pre",
                color,
                textShadow: "0 8px 0 rgba(94, 70, 160, 0.35)",
              }}
            >
              {word}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
