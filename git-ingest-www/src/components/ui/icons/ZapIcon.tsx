import * as React from "react";
const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <polygon
      points="10,2 15,10 11,10 14,18 5,8 9,8"
      fill="#facc15"
      stroke="#b45309"
      strokeWidth={1.5}
    />
  </svg>
);
export default ZapIcon;
