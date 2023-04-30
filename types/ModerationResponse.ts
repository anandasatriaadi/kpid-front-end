import FrameResult from "@/types/FrameResult";
import ModerationResult from "@/types/ModerationResult";
import ModerationStatus from "@/types/ModerationStatus";

type ModerationResponse = {
  _id: string;
  user_id: string;
  filename: string;
  program_name: string;
  station_name: string;
  start_time: string;
  end_time: string;
  fps: number;
  duration: number;
  total_frames: number;
  recording_date?: Date;
  description?: string;
  status?: ModerationStatus;
  created_at?: Date;
  updated_at?: Date;
  result?: ModerationResult[];
  frames?: FrameResult[];
  videos?: string[];
};

export default ModerationResponse;
