import { CHARACTERS_PER_LEVEL, JLPT_LEVELS, Level } from "@/data/constants";
import { SidebarItem } from "./sidebar";
import clsx from "clsx";
import { ResetButton } from "@/components/jlpt/reset-button";
import { ProgressBar } from "@/components/progress-bar";
import { useParams } from "next/navigation";

export function JLPTLevelItems({
  isDrawer = false,
  locale,
}: {
  isDrawer?: boolean;
  locale: "en" | "id";
}) {
  const params = useParams();
  const currentLevel = params.level as unknown as Level;

  return JLPT_LEVELS.toReversed().map((level) => {
    return (
      <JLPTLevelItem
        key={level}
        isDrawer={isDrawer}
        completedCount={12}
        progress={12}
        isActive={currentLevel == level}
        level={level}
        locale={locale}
      />
    );
  });
}

function JLPTLevelItem({
  level,
  completedCount,
  progress,
  isActive,
  isDrawer = false,
  locale,
}: {
  level: Level;
  completedCount: number;
  progress: number;
  isActive: boolean;
  isDrawer?: boolean;
  locale: "en" | "id";
}) {
  const totalCharacters = CHARACTERS_PER_LEVEL[level];

  return (
    <SidebarItem
      isDrawer={isDrawer}
      rightItem={<ResetButton disabled={progress === 0} level={level} />}
      key={level}
      isActive={isActive}
      href={
        locale === "en" ? `/en/jlpt/${level}?page=1` : `/jlpt/${level}?page=1`
      }
    >
      <div
        className={clsx(
          "flex items-center justify-between",
          progress === 1 && "text-sky-400",
        )}
      >
        <span className={clsx("text-sm", progress === 1 && "text-yellow-500")}>
          JLPT {level}
        </span>
        <span className="text-xs">
          <span
            className={clsx(
              progress === 0 && "text-sky-400",
              progress > 0 && progress < 1 && "text-sky-400",
            )}
          >
            {completedCount}
          </span>{" "}
          / {totalCharacters}
        </span>
      </div>
      <div className="mt-0.5">
        <ProgressBar value={12 / totalCharacters} />
      </div>
    </SidebarItem>
  );
}
