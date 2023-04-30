import React from "react";

type IconProps = {
  height: string;
  width: string;
};

function Saru(props: IconProps) {
  const { width, height } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 227"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M153.45 0H102.3C93.9404 0 89.7607 10.1099 95.6699 16.0298L112.64 32.999L93.3467 50.5386C83.5723 43.0737 71.3594 38.6401 58.1104 38.6401C26.0166 38.6401 0 64.6567 0 96.75C0 125.262 20.5342 148.978 47.6201 153.916V164.87H20.751C14.9609 164.87 10.2607 169.57 10.2607 175.36C10.2607 181.15 14.9609 185.85 20.751 185.85H47.6201V215.87C47.6201 221.66 52.3203 226.36 58.1104 226.36C63.9102 226.36 68.6006 221.67 68.6006 215.89V185.85H92.9004C98.6904 185.85 103.391 181.15 103.391 175.36C103.391 169.57 98.6904 164.87 92.9004 164.87H68.6006V153.916C95.6865 148.978 116.22 125.262 116.22 96.75C116.22 85.4849 113.015 74.9683 107.466 66.063L127.494 47.8535L143.53 63.8901C149.44 69.7998 159.55 65.6099 159.55 57.25V6.1001C159.55 2.72998 156.82 0 153.45 0ZM79.8867 91.1377C79.6592 90.9849 79.4453 90.8169 79.2461 90.6357C77.3535 88.9185 76.7422 86.0249 78.0996 83.6099L84.2402 72.6699C84.9902 71.3398 83.5098 69.8599 82.1797 70.6099L71.2402 76.75C69.1611 77.9185 66.7256 77.626 64.9932 76.3159C64.042 75.5967 63.3047 74.5723 62.9502 73.3101L59.5596 61.25C59.1504 59.7798 57.0596 59.7798 56.6504 61.25L53.2598 73.3101C52.2598 76.8701 48.1904 78.5601 44.9697 76.75L34.0303 70.6099C32.7002 69.8599 31.2197 71.3398 31.9697 72.6699L38.1104 83.6099C39.9199 86.8301 38.2305 90.8999 34.6699 91.8999L22.6104 95.29C21.1396 95.71 21.1396 97.79 22.6201 98.21L34.6797 101.6C38.2402 102.6 39.9297 106.67 38.1201 109.89L31.9805 120.83C31.2305 122.16 32.71 123.64 34.04 122.89L44.9805 116.75C45.8252 116.275 46.7285 116.041 47.6201 116.019C47.79 116.014 47.96 116.018 48.1289 116.029C50.4443 116.179 52.583 117.742 53.2705 120.19L56.6602 132.25C57.0703 133.72 59.1602 133.72 59.5703 132.25L62.96 120.19C63.6963 117.568 66.1006 115.961 68.6006 116.019C69.4961 116.039 70.4014 116.273 71.25 116.75L82.1797 122.88C83.5098 123.63 84.9902 122.15 84.2402 120.82L78.0996 109.88C76.29 106.66 77.9805 102.59 81.54 101.59L93.5996 98.2002C95.0703 97.79 95.0703 95.7002 93.5996 95.29L81.54 91.8999C80.9316 91.729 80.3779 91.4683 79.8867 91.1377Z"
      />
    </svg>
  );
}

export default Saru;