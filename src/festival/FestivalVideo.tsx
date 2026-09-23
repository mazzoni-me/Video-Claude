import {
  AbsoluteFill,
  Audio,
  getStaticFiles,
  interpolate,
  Sequence,
  staticFile,
} from "remotion";
import { DanceScene } from "./DanceScene";
import { MUSIC_FILE, MUSIC_START_SECONDS } from "./music";
import { Sponsored } from "./Sponsored";
import { Title } from "./Title";

export const TITLE_DURATION = 150;
export const SPONSORED_DURATION = 70;
export const DANCE_DURATION = 300;
export const FESTIVAL_DURATION =
  TITLE_DURATION + SPONSORED_DURATION + DANCE_DURATION;


export const FestivalVideo: React.FC = () => {
  const hasMusic = getStaticFiles().some((f) => f.name === MUSIC_FILE);

  return (
    <AbsoluteFill>
      {hasMusic ? (
        <Audio
          src={staticFile(MUSIC_FILE)}
          startFrom={MUSIC_START_SECONDS * 30}
          volume={(f) =>
            interpolate(
              f,
              [0, 15, FESTIVAL_DURATION - 30, FESTIVAL_DURATION],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}
      <Sequence durationInFrames={TITLE_DURATION} name="Titolo">
        <Title />
      </Sequence>
      <Sequence
        from={TITLE_DURATION}
        durationInFrames={SPONSORED_DURATION}
        name="Sponsored by"
      >
        <Sponsored />
      </Sequence>
      <Sequence
        from={TITLE_DURATION + SPONSORED_DURATION}
        durationInFrames={DANCE_DURATION}
        name="Ballo"
      >
        <DanceScene startFrame={TITLE_DURATION + SPONSORED_DURATION} />
      </Sequence>
    </AbsoluteFill>
  );
};
