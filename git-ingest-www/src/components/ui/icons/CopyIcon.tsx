import * as React from "react";
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <rect
      x={6}
      y={6}
      width={10}
      height={10}
      rx={2}
      fill="#fff"
      stroke="#222"
      strokeWidth={1.5}
    />
    <rect
      x={4}
      y={4}
      width={10}
      height={10}
      rx={2}
      fill="#e5e7eb"
      stroke="#222"
      strokeWidth={1.2}
    />
  </svg>
);
export default CopyIcon;
