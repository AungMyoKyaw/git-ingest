import * as React from "react";
const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <rect
      x={4}
      y={3}
      width={12}
      height={14}
      rx={2}
      fill="#fff"
      stroke="#222"
      strokeWidth={1.5}
    />
    <line x1={7} y1={7} x2={13} y2={7} stroke="#222" strokeWidth={1.2} />
    <line x1={7} y1={10} x2={13} y2={10} stroke="#222" strokeWidth={1.2} />
    <line x1={7} y1={13} x2={11} y2={13} stroke="#222" strokeWidth={1.2} />
  </svg>
);
export default FileTextIcon;
