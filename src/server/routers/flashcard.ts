import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/trpc/trpc";
import { segment } from "@/utils/tokenizer";

type FlashcardEntry = {
  reading: string;
  glosses: string[];
};

// {
//     reading: "べんきょう",
//     glosses: ["study", "diligence"]
// }

type FlashcardDissectedItem = {
  text: string;
  entries: FlashcardEntry[];
};

// {
//     text: "勉強",
//     entries: [...],
//     dissected: [
//       { text: "勉", entries: [...] },
//       { text: "強", entries: [...] }
//     ]
//   }

export type FlashcardedResult = {
  text: string;
  entries: FlashcardEntry[];
  dissected: FlashcardDissectedItem[];
};
// input : "日本語-勉強-猫" 
// [
//     {
//       text: "日本語",
//       entries: [
//         {
//           reading: "にほんご",
//           glosses: ["Japanese language"],
//         },
//       ],
//       dissected: [
//         {
//           text: "日",
//           entries: [
//             {
//               reading: "にち",
//               glosses: ["day", "sun"],
//             },
//           ],
//         },
//         {
//           text: "本",
//           entries: [
//             {
//               reading: "ほん",
//               glosses: ["book", "origin"],
//             },
//           ],
//         },
//         {
//           text: "語",
//           entries: [
//             {
//               reading: "ご",
//               glosses: ["language", "word"],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       text: "勉強",
//       entries: [
//         {
//           reading: "べんきょう",
//           glosses: ["study", "diligence"],
//         },
//       ],
//       dissected: [
//         {
//           text: "勉",
//           entries: [
//             {
//               reading: "べん",
//               glosses: ["exertion"],
//             },
//           ],
//         },
//         {
//           text: "強",
//           entries: [
//             {
//               reading: "きょう",
//               glosses: ["strong"],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       text: "猫",
//       entries: [
//         {
//           reading: "ねこ",
//           glosses: ["cat"],
//         },
//       ],
//       dissected: [
//         {
//           text: "猫",
//           entries: [
//             {
//               reading: "ねこ",
//               glosses: ["cat"],
//             },
//           ],
//         },
//       ],
//     },
//   ]
async function buildFlashcardResult(text: string, to: "en" | "id"): Promise<FlashcardedResult[]> {
  const words = text
    .split("-")
    .map((item) => item.trim())
    .filter(Boolean);

  return Promise.all(
    words.map(async (word) => {
      const tokens = await segment(word, to);
      const token = tokens[0];

      if (!token) {
        return {
          text: word,
          entries: [],
          dissected: [],
        } satisfies FlashcardedResult;
      }

      const entries = token.matches.map((match) => ({
        reading: match.reading,
        glosses: match.glosses,
      }));

      const dissected = await Promise.all(
        token.text.split("").map(async (character) => {
          const [charToken] = await segment(character, to);

          return {
            text: charToken?.text ?? character,
            entries:
              charToken?.matches.map((match) => ({
                reading: match.reading,
                glosses: match.glosses,
              })) ?? [],
          } satisfies FlashcardDissectedItem;
        })
      );

      return {
        text: token.text,
        entries,
        dissected,
      } satisfies FlashcardedResult;
    })
  );
}

const flashcardInput = z.object({
  text: z.string().trim().min(1),
});

export const flashcardRouter = createTRPCRouter({
  en: publicProcedure.input(flashcardInput).query(async ({ input }) => {
    return buildFlashcardResult(input.text, "en");
  }),
  id: publicProcedure.input(flashcardInput).query(async ({ input }) => {
    return buildFlashcardResult(input.text, "id");
  }),
});
