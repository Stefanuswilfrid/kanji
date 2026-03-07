import { useWindowSize } from "@/hooks/useWindowSize";
import React from "react";
import Confetti from "react-confetti";

const ConfettiContext = React.createContext(
    {} as {
      party: () => void;
    }
  );
  
export function useConfetti() {
    return React.useContext(ConfettiContext);
  }
  
  export function ConfettiProvider({ children }: { children: React.ReactNode }) {
    const [party, setParty] = React.useState(false);
  
    const { width, height } = useWindowSize();
  
    return (
      <ConfettiContext.Provider
        value={{
          party: () => setParty(true),
        }}
      >
        <div className="fixed z-50 top-0 h-screen w-screen pointer-events-none">
          <Confetti
            width={width}
            height={height}
            numberOfPieces={party ? 800 : 0}
            tweenDuration={20000}
            recycle={false}
            onConfettiComplete={(confetti) => {
              setParty(false);
              confetti?.reset();
            }}
          />
        </div>
        {children}
      </ConfettiContext.Provider>
    );
  }