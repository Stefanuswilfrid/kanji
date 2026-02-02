import { CHARACTERS_PER_LEVEL, JLPT_LEVELS, Level } from "@/data/constants";
import { SidebarItem } from "./sidebar";
import clsx from "clsx";
import { ResetButton } from "@/components/hsk/reset-button";
import { ProgressBar } from "@/components/progress-bar";

export function JLPTLevelItems({ isDrawer = false }: { isDrawer?: boolean }) {
    return JLPT_LEVELS.map((level) => {
         return (
      <JLPTLevelItem
        key={level}
        isDrawer={isDrawer}
        completedCount={12}
        progress={12}
        isActive={false}
        level={level}
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
}: {
  level: Level;
  completedCount: number;
  progress: number;
  isActive: boolean;
  isDrawer?: boolean;
}) {
  const totalCharacters = CHARACTERS_PER_LEVEL[level];

  return (
    <SidebarItem
      isDrawer={isDrawer}
      rightItem={
      <ResetButton disabled={progress === 0} level={level} />
    }
      key={level}
      isActive={isActive}
      href={`/hsk/${level}?page=1`}
    >
      <div className={clsx("flex items-center justify-between", progress === 1 && "text-sky-400")}>
        <span className={clsx("text-sm", progress === 1 && "text-yellow-500")}>JLPT {level}</span>
        <span className="text-xs">
          <span className={clsx(progress === 0 && "text-sky-400", progress > 0 && progress < 1 && "text-sky-400")}>
            {completedCount}
          </span>{" "}
          / {totalCharacters}
        </span>
      </div>
      <div className="mt-0.5">
        <ProgressBar value={12/totalCharacters} />
      </div>
    </SidebarItem>
  );
}