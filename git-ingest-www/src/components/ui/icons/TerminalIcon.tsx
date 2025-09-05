import * as React from "react";
const TerminalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <rect x={2} y={4} width={16} height={12} rx={2} fill="#222" />
    <path
      d="M6 8l2 2-2 2"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x={12} y={12} width={4} height={1.5} rx={0.75} fill="#fff" />
  </svg>
);
export default TerminalIcon;
