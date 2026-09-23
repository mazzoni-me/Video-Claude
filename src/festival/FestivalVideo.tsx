import { AbsoluteFill, Sequence } from "remotion";
import { DanceScene } from "./DanceScene";
import { Sponsored } from "./Sponsored";
import { Title } from "./Title";

export const TITLE_DURATION = 150;
export const SPONSORED_DURATION = 70;
export const DANCE_DURATION = 300;
export const FESTIVAL_DURATION =
  TITLE_DURATION + SPONSORED_DURATION + DANCE_DURATION;

export const FestivalVideo: React.FC = () => {
  return (
    <AbsoluteFill>
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
        <DanceScene />
      </Sequence>
    </AbsoluteFill>
  );
};
