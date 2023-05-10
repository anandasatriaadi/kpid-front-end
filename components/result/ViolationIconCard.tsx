import { Tooltip } from "antd";
import * as React from "react";
import {
  ApplicationContext,
  ApplicationContextInterface,
} from "../../context/ApplicationContext";
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
  cardStyle?: boolean;
  hideWhenZero?: boolean;
  darkStyle?: boolean;
};

function ViolationIconCard(props: IconProps) {
  //#region ::: Variable Initialisations
  const {
    className = "",
    height,
    sara,
    saru,
    sadis,
    sihir,
    siaran,
    cardStyle = false,
    hideWhenZero = false,
    darkStyle = false,
  } = props;

  const { isMobile } = React.useContext(
    ApplicationContext
  ) as ApplicationContextInterface;

  const tooltipClassName =
    "relative flex flex-col justify-center bg-opacity-75 " +
    (cardStyle ? "rounded-lg py-2 md:py-3 px-3 md:px-4 " : "") +
    (darkStyle ? "bg-sky-700 text-sky-50" : "bg-sky-200 text-sky-700");

  const iconStyle = {
    height: isMobile ? `${height + 16}px` : `${height + 24}px`,
    width: isMobile ? `${height + 24}px` : `${height + 32}px`,
  };

  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  const getIconClassName = (count: number) => {
    return (
      "absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold " +
      (count > 0
        ? count > 2
          ? "bg-red-600 text-white"
          : "bg-amber-400 text-black"
        : "bg-lime-500 text-black")
    );
  };
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  //#endregion ::: UseEffect

  return (
    <div className={"flex flex-wrap gap-4 " + className}>
      {(!hideWhenZero || sara > 0) && (
        <Tooltip className={tooltipClassName} title="SARA">
          <span style={iconStyle}>
            <Sara width={`${height}px`} height={`${height}px`} />
            <p className={getIconClassName(sara)}>{sara}</p>
          </span>
        </Tooltip>
      )}
      {(!hideWhenZero || saru > 0) && (
        <Tooltip className={tooltipClassName} title="SARU">
          <span style={iconStyle}>
            <Saru width={`${height}px`} height={`${height}px`} />
            <p className={getIconClassName(saru)}>{saru}</p>
          </span>
        </Tooltip>
      )}
      {(!hideWhenZero || sadis > 0) && (
        <Tooltip className={tooltipClassName} title="SADIS">
          <span style={iconStyle}>
            <Sadis width={`${height}px`} height={`${height}px`} />
            <p className={getIconClassName(sadis)}>{sadis}</p>
          </span>
        </Tooltip>
      )}
      {(!hideWhenZero || sihir > 0) && (
        <Tooltip className={tooltipClassName} title="SIHIR">
          <span style={iconStyle}>
            <Sihir width={`${height}px`} height={`${height}px`} />
            <p className={getIconClassName(sihir)}>{sihir}</p>
          </span>
        </Tooltip>
      )}
      {(!hideWhenZero || siaran > 0) && (
        <Tooltip className={tooltipClassName} title="Siaran Partisan">
          <span style={iconStyle}>
            <SiaranPartisan width={`${height}px`} height={`${height}px`} />
            <p className={getIconClassName(siaran)}>{siaran}</p>
          </span>
        </Tooltip>
      )}
    </div>
  );
}

export default ViolationIconCard;
