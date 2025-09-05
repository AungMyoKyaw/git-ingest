import * as React from "react";
const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <rect x={3} y={5} width={14} height={2} rx={1} fill="#222" />
    <rect x={5} y={9} width={10} height={2} rx={1} fill="#6366f1" />
    <rect x={7} y={13} width={6} height={2} rx={1} fill="#22c55e" />
  </svg>
);
export default FilterIcon;
