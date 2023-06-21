import ModerationDecision from "@/types/ModerationDecision";
import ModerationResult from "@/types/ModerationResult";
import { Button } from "antd";
import * as React from "react";

type ViolationPanelProps = {
  index: number;
  moderationResult: ModerationResult;
  pasalValidationHandler: (index: number, decision: ModerationDecision) => void;
};

function ValidationButtons({
  index,
  moderationResult,
  pasalValidationHandler,
}: ViolationPanelProps) {
  const [isChanging, setIsChanging] = React.useState(false);

  return (
    <div className="mt-4 flex justify-end gap-4">
      {moderationResult.decision.toUpperCase() === "PENDING" || isChanging ? (
        <>
          {isChanging && (
            <Button
              type="default"
              onClick={(e) => {
                setIsChanging(false);
              }}
            >
              Batalkan
            </Button>
          )}
          <Button
            type="default"
            onClick={(e) => {
              setIsChanging(false);
              pasalValidationHandler(index, ModerationDecision.INVALID);
            }}
          >
            Tidak Valid
          </Button>
          <Button
            type="primary"
            onClick={(e) => {
              setIsChanging(false);
              pasalValidationHandler(index, ModerationDecision.VALID);
            }}
          >
            Valid
          </Button>
        </>
      ) : (
        <Button
          type="default"
          onClick={(e) => {
            setIsChanging(!isChanging);
          }}
        >
          Ubah
        </Button>
      )}
    </div>
  );
}

export default ValidationButtons;
