import {
  faGhost,
  faHandHoldingHeart,
  faHandsPraying,
  faMarsAndVenusBurst,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "antd";
import React, { CSSProperties } from "react";

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
  const iconClassName =
    "absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-sm";

  return (
    <div className={"flex flex-wrap gap-4 " + className}>
      <Tooltip className={tooltipClassName} title="SARA">
        <span style={iconStyle}>
          <FontAwesomeIcon
            icon={faHandsPraying}
            height={`${height}px`}
            className="text-2xl text-gray-900"
          />
          <p className={iconClassName}>{sara}</p>
        </span>
      </Tooltip>
      <Tooltip className={tooltipClassName} title="SARU">
        <span style={iconStyle}>
          <FontAwesomeIcon
            icon={faMarsAndVenusBurst}
            height={`${height}px`}
            className="text-2xl text-gray-900"
          />
          <p className={iconClassName}>{saru}</p>
        </span>
      </Tooltip>
      <Tooltip className={tooltipClassName} title="SADIS">
        <span style={iconStyle}>
          <FontAwesomeIcon
            icon={faHandHoldingHeart}
            height={`${height}px`}
            className="text-2xl text-gray-900"
          />
          <p className={iconClassName}>{sadis}</p>
        </span>
      </Tooltip>
      <Tooltip className={tooltipClassName} title="SIHIR">
        <span style={iconStyle}>
          <FontAwesomeIcon
            icon={faGhost}
            height={`${height}px`}
            className="text-2xl text-gray-900"
          />
          <p className={iconClassName}>{sihir}</p>
        </span>
      </Tooltip>
      <Tooltip className={tooltipClassName} title="Siaran Partisan & Ilegal">
        <span style={iconStyle}>
          <FontAwesomeIcon
            icon={faPeopleGroup}
            height={`${height}px`}
            className="text-2xl text-gray-900"
          />
          <p className={iconClassName}>{siaran}</p>
        </span>
      </Tooltip>
    </div>
  );
}

export default ViolationIconCard;
