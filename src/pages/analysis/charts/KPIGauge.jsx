import React from 'react';
import {
  selectedMainCurrencyId,
  SelectedCurrencySymbol,
} from '../../../redux/store/slice/currencySlice';
import { useSelector } from 'react-redux';

const  KPIGauge = ({ value, targetType }) => {
  console.log(targetType, 'target in KPIGauge');
  const SelectedCurrencySymbolVar = useSelector(SelectedCurrencySymbol);
  const { gav, debt, toGo, nav, debtRatio } = value || {}
  const radii = { outer: 100, middle: 80, inner: 60 };
  const strokeWidth = 12;

  const arc = (value, radius) => {
    const circumference = 2 * Math.PI * radius;
    const fraction = Math.min(Math.max(value / gav, 0), 1);
    const arcLen = fraction * circumference;
    return `${arcLen} ${circumference - arcLen}`;
  };

  const colors = {
    nav: '#8B5CF6',      
    debt: '#FACC15',    
    toGo: '#FF4A4A',     
    bg: '#2A2A2A',      
    text: '#FFFFFF',
    subtext: '#AAAAAA'
  };

  function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}


  return (
    <div className="w-full flex flex-col items-center p-4 bg-[#0A0A0C] border border-b-[#19191D] rounded-lg text-white">
      <div className="w-full flex justify-start items-center ml-8 mt-4">
        <h2 className="text-lg font-semibold">KPI</h2>
        
      </div>

     <svg width={300} height={300} viewBox="0 0 280 280">
  <g transform="translate(0, 0)">
    {(() => {
      const cx = 140, cy = 140, r = 100; // Increased radius
      const strokeWidth = 16;
      const gapDeg = 16; // Increased gap between arcs

      const values = [
  { label: 'NAV', value: nav, color: colors.nav },
  { label: 'DEBT', value: debt, color: colors.debt },
  { label: 'TOGO', value: toGo, color: colors.toGo },
];

const nonZeroArcs = values.filter(v => v.value > 0);
const total = nonZeroArcs.reduce((sum, v) => sum + v.value, 0);
const totalArcDeg = 360 - gapDeg * nonZeroArcs.length;


      const navDeg = (nav / total) * totalArcDeg;
      const debtDeg = (debt / total) * totalArcDeg;
      const toGoDeg = (toGo / total) * totalArcDeg;

      let startAngle = -90;

      const arcs = [
        { label: 'NAV', value: nav, deg: navDeg, color: colors.nav },
        { label: 'DEBT', value: debt, deg: debtDeg, color: colors.debt },
        { label: 'TOGO', value: toGo, deg: toGoDeg, color: colors.toGo },
      ];

      return arcs.flatMap((arc, i) => {
  if (arc.value <= 0) {
    // Skip rendering if value is zero or negative
    return [];
  }

  const endAngle = startAngle + arc.deg;
  const d = describeArc(cx, cy, r, startAngle, endAngle);
  const path = (
    <path
      key={i}
      d={d}
      fill="none"
      stroke={arc.color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  );
  startAngle = endAngle + gapDeg;
  return [path];
});

    })()}
    <g transform="translate(140, 140)">
  <text textAnchor="middle" fill={colors.text} y="-14" fontSize="12">
    Current GAV
  </text>
  <text textAnchor="middle" y="8" fontSize="12" fill={colors.text}>
    {SelectedCurrencySymbolVar}{Number(gav).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  </text>
  <text textAnchor="middle" y="28" fontSize="12" fill={colors.text}>
    {debtRatio?.toFixed(2)}% debt ratio
  </text>
</g>

  </g>
</svg>




      <div className="mt-4 flex flex-col text-sm w-full px-4 space-y-2">
  {[
    { label: "NAV", value: nav, color: colors.nav },
    ...(targetType !== "NAV" ? [{ label: "DEBT", value: debt, color: colors.debt }] : []),
    { label: "TOGO", value: toGo, color: colors.toGo },
  ].map(({ label, value, color }) => (
    <div key={label} className="flex items-center w-full gap-2">
      {/* Label */}
      <div className="flex items-center gap-2 min-w-[60px] flex-shrink-0">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </div>

      {/* Dashed line */}
      <div className="flex-grow h-[1px]">
        <svg width="100%" height="2" viewBox="0 0 100 2" preserveAspectRatio="none">
          <line
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            stroke="#37373F"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        </svg>
      </div>

      {/* Value */}
      <div className="text-right whitespace-nowrap">
        {SelectedCurrencySymbolVar}
        {Number(value).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default KPIGauge;