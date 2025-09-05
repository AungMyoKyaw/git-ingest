import * as React from "react";
const GaugeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <circle cx={10} cy={10} r={8} stroke="#222" strokeWidth={1.5} fill="#fff" />
    <path
      d="M10 10v-4"
      stroke="#6366f1"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <circle cx={10} cy={10} r={1.5} fill="#6366f1" />
  </svg>
);
export default GaugeIcon;
