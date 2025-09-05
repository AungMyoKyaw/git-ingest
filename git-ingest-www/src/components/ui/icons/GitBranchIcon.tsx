import * as React from "react";
const GitBranchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <circle cx={6} cy={6} r={2.5} fill="#6366f1" />
    <circle cx={14} cy={14} r={2.5} fill="#6366f1" />
    <path d="M6 6v8a2 2 0 002 2h4" stroke="#6366f1" strokeWidth={1.5} />
  </svg>
);
export default GitBranchIcon;
