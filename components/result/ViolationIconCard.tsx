import { Tooltip } from "antd";
import Sadis from "../icons/Sadis";
import Sara from "../icons/Sara";
import Saru from "../icons/Saru";
import SiaranPartisan from "../icons/SiaranPartisan";
import Sihir from "../icons/Sihir";

type IconProps = {
  className?: string;
  height: number;
  sara: number;
  saru: number;
  sadis: number;
  sihir: number;
  siaran: number;
  cardStyle: boolean;
};

function ViolationIconCard(props: IconProps) {
  const {
    className = "",
    height,
    sara,
    saru,
    sadis,
    sihir,
    siaran,
    cardStyle = false,
  } = props;

  const tooltipClassName =
    "relative flex flex-col justify-center " +
    (cardStyle ? "rounded-lg bg-white py-3 px-4 shadow-md" : "");
  const iconStyle = {
    height: `${height + 24}px`,
    width: `${height + 32}px`,
  };
  const getIconClassName = (count: number) => {
    return (
      "absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-sm " +
      (count > 0 ? (count > 2 ? "bg-red-500" : "bg-amber-400") : "bg-lime-500")
    );
  };

  return (
    <div className={"flex flex-wrap gap-4 " + className}>
      <Tooltip className={tooltipClassName} title="SARA">
        <span style={iconStyle}>
          <Sara width={`${height}px`} height={`${height}px`} />
          <p className={getIconClassName(sara)}>{sara}</p>
        </span>
      </Tooltip>
      <Tooltip className={tooltipClassName} title="SARU">
        <span style={iconStyle}>
          <Saru width={`${height}px`} height={`${height}px`} />
          <p className={getIconClassName(saru)}>{saru}</p>
        </span>
      </Tooltip>
      <Tooltip className={tooltipClassName} title="SADIS">
        <span style={iconStyle}>
          <Sadis width={`${height}px`} height={`${height}px`} />
          <p className={getIconClassName(sadis)}>{sadis}</p>
        </span>
      </Tooltip>
      <Tooltip className={tooltipClassName} title="SIHIR">
        <span style={iconStyle}>
          <Sihir width={`${height}px`} height={`${height}px`} />
          <p className={getIconClassName(sihir)}>{sihir}</p>
        </span>
      </Tooltip>
      <Tooltip className={tooltipClassName} title="Siaran Partisan">
        <span style={iconStyle}>
          <SiaranPartisan width={`${height}px`} height={`${height}px`} />
          <p className={getIconClassName(siaran)}>{siaran}</p>
        </span>
      </Tooltip>
    </div>
  );
}

export default ViolationIconCard;
