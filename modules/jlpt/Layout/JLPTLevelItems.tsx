import { CHARACTERS_PER_LEVEL, HSK_LEVELS,Level } from "@/data/constants";
import { useCompletedCharacters } from "@/store/useCompletedCharactersStore";
import { SidebarItem } from "./Sidebar";
import clsx from "clsx";
import { ProgressBar } from "@/components/jlpt/ProgressBar";
import { ResetButton } from "@/components/jlpt/ResetButton";
import { useParams } from "next/navigation";

export function JLPTLevelItems({ isDrawer = false }: { isDrawer?: boolean }) {
  const completedCharacters = useCompletedCharacters();

  const params = useParams();
  const currentLevel = params?.level as unknown as Level;

  return HSK_LEVELS.map((level) => {
    const progress = completedCharacters[level].length / CHARACTERS_PER_LEVEL[level];
    const completedCount = completedCharacters[level].length;

    return (
      <JLPTLevelItem
        key={level}
        isDrawer={isDrawer}
        completedCount={completedCount}
        progress={progress}
        isActive={currentLevel == level}
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
      rightItem={<ResetButton disabled={progress === 0} level={level} />}
      key={level}
      isActive={isActive}
      href={`/jlpt/${level}?page=1`}
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
        <ProgressBar value={progress} />
      </div>
    </SidebarItem>
  );
}
