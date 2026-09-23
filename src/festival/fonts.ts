import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Poppins (SIL Open Font License) is bundled in public/fonts so rendering
// works without network access.
export const fontFamily = "Poppins";

const fontsLoaded = Promise.all(
  ["600", "800"].map((weight) =>
    loadFont({
      family: fontFamily,
      url: staticFile(`fonts/Poppins-${weight}.woff2`),
      weight,
    }),
  ),
);

export const waitUntilDone = () => fontsLoaded;
