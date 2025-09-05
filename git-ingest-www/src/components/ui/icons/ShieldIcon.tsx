import * as React from "react";
const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <path d="M10 2l7 3v5c0 5-3.5 8-7 8s-7-3-7-8V5l7-3z" fill="#22c55e" />
    <path
      d="M10 2l7 3v5c0 5-3.5 8-7 8s-7-3-7-8V5l7-3z"
      stroke="#166534"
      strokeWidth={1.5}
    />
    <path d="M10 8v4" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
    <circle cx={10} cy={7} r={1} fill="#fff" />
  </svg>
);
export default ShieldIcon;
