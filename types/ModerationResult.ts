import ModerationDecision from "@/types/ModerationDecision";

type ModerationResult = {
  second: number;
  clip_url: string;
  decision: ModerationDecision;
  category: string[];
};

export default ModerationResult;
