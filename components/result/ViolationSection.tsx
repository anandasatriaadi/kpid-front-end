import httpRequest from "@/common/HttpRequest";
import Layout from "@/components/Layout";
import ViolationIconCard from "@/components/ViolationIconCard";
import { NextPageWithLayout } from "@/pages/_app";
import FrameResult from "@/types/FrameResult";
import ModerationDecision from "@/types/ModerationDecision";
import ModerationResponse from "@/types/ModerationResponse";
import ModerationResult from "@/types/ModerationResult";
import { isNil, isNilOrEmpty } from "@/utils/BooleanUtil";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import {
  faClock,
  faFileDownload,
  faGaugeHigh,
  faPenToSquare,
  faStopwatch,
  faTelevision,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Collapse, message, Skeleton, Tabs } from "antd";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { Tab } from "rc-tabs/lib/interface";
import * as React from "react";
import PasalResponse from "@/types/PasalResponse";
import debounce from "@/utils/Debounce";
import Image from "next/image";
import ViolationDesc from "@/components/result/ViolationDesc";

function ViolationSection() {
  return <div>ViolationSection</div>;
}

export default ViolationSection;
