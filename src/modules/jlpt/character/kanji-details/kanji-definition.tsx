export function KanjiDefinition({
    entry,
  }: {
    entry: {
      pos: string[];
      meanings: string[];
    };
  }) {
    return (
      <ul className="relative ml-8 pr-2 grid sm:grid-cols-2">
        {entry.meanings.map((meaning, index) => {
          return (
            <li key={index} className="list-disc">
              <div className="pr-6">{meaning}</div>
            </li>
          );
        })}
      </ul>
    );
  }
  