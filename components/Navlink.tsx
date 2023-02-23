import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  title: string;
  route: string;
  className?: string | undefined;
  bottomBorder?: boolean | undefined;
  useLinkStyle?: boolean | undefined;
  useAnchorTag?: boolean | undefined;
}

function Navlink(props: Props) {
  const route = useRouter();
  const bottomBorder =
    props.bottomBorder == undefined ? true : props.bottomBorder;
  const useLinkStyle =
    props.useLinkStyle == undefined ? true : props.useLinkStyle;

  const activeLinkStyle = useLinkStyle
    ? " text-sky-500 border-sky-500 hover:border-sky-300 hover:text-sky-300 transition-colors duration-300 "
    : "";
  const defaultLinkStyle = useLinkStyle
    ? " border-gray-100 hover:border-sky-500 hover:text-sky-500 transition-colors duration-300 "
    : "";
  return (
    <Link href={props.route} {...props}>
      {props.useAnchorTag == undefined || props.useAnchorTag ? (
        <a
          className={
            (props.className ? props.className : "") +
            (props.route == route.asPath ? activeLinkStyle : defaultLinkStyle) +
            (bottomBorder ? " border-b-2 " : "")
          }
        >
          {props.title}
        </a>
      ) : (
        <div
          className={
            (props.className ? props.className : "") +
            (props.route == route.asPath ? activeLinkStyle : defaultLinkStyle) +
            (bottomBorder ? " border-b-2 " : "")
          }
        >
          {props.title}
        </div>
      )}
    </Link>
  );
}

export default Navlink;
