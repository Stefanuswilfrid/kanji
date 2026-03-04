import { Divider } from "@/components/divider";
import { useLocale } from "@/locales/use-locale";
import { AudioButton } from "@/modules/jlpt/character/audio-button";
import type { TranslateApiResponse } from "../search-command-menu";

export function CommandMenuGroupCard({
  active,
  data,
  sentence,
}: {
  active: number[];
  data: TranslateApiResponse;
  sentence: string;
}) {
  const { t } = useLocale();

  const showTranslations = active.includes(0);
  const showDefinitions = active.includes(1);

  return (
    <div className="rounded-lg border border-secondary/10 bg-softblack">
      <div className="px-3 sm:px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-secondary/80">Query</p>
            <p className="mt-1 text-2xl md:text-3xl tracking-wide break-words">{sentence}</p>
          </div>
          <div className="shrink-0 mt-5">
            <AudioButton speed={1} size="normal" text={sentence} />
          </div>
        </div>
      </div>

      {showTranslations && (
        <>
          <Divider className="my-0" />
          <div className="px-3 sm:px-4 py-3">
            <p className="text-xs text-secondary/80">{t.commandMenuChips?.[0] ?? "Translation"}</p>
            <p className="mt-1 text-base text-smokewhite break-words">{data.translatedText}</p>
          </div>
        </>
      )}

      {showDefinitions && (
        <>
          <Divider className="my-0" />
          <div className="px-3 sm:px-4 py-3">
            <p className="text-xs text-secondary/80">{t.commandMenuChips?.[1] ?? "Word Definition"}</p>
            <p className="mt-1 text-sm text-secondary/90">Definition lookup isn’t wired yet.</p>
          </div>
        </>
      )}
    </div>
  );
}