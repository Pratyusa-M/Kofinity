import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  selectedMainCurrencyId,
  SelectedCurrencySymbol,
} from "../../../redux/store/slice/currencySlice";
import { useSelector } from 'react-redux';

const TABS = ['P&L', 'Cash Flow'];

export default function SemicircleGauge({ profitLoss, cashFlow, totalValue }) {
  const [activeTab, setActiveTab] = useState(0);
  const value = activeTab === 0 ? profitLoss : cashFlow;

  const max = Math.max(Math.abs(profitLoss), Math.abs(cashFlow)) || 1;
  const clamped = Math.max(-max, Math.min(max, value));
  const angle = (clamped / max) * 90; 
  const R = 90;
  const centerX = 100;
  const centerY = 100;
  const arcGap = 16; 
  const arcAngle = 90 - arcGap / 2;

  const negArc = describeArc(centerX, centerY, R, 180, 180 + arcAngle);
  const posArc = describeArc(centerX, centerY, R, 0 - arcAngle, 0);

  const baseWidth = 10; 
  const needleLength = 95;
  const needleAngleRad = (angle * Math.PI) / 180;
  const needleX = centerX + needleLength * Math.sin(needleAngleRad);
  const needleY = centerY - needleLength * Math.cos(needleAngleRad);

  const tooltipX = centerX + Math.sin(needleAngleRad) * 70;
  const tooltipY = centerY - Math.cos(needleAngleRad) * 70;

  const SelectedCurrencySymbolVar = useSelector(SelectedCurrencySymbol);

  return (
    <div className=" border border-b-[#19191D] rounded-2xl p-6 text-center text-white w-full h-full">
      <div className="flex bg-[#2A2A2A] rounded-full p-1 mb-4 w-max mx-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={clsx(
              'px-4 py-1 rounded-full text-sm transition',
              activeTab === i
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative w-full h-[150px]">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path
            d={negArc}
            fill="none"
            stroke="#ff5757"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d={posArc}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="20"
            strokeLinecap="round"
          />

          <g className="group">
            <polygon
              points={getNeedlePolygon(centerX, centerY, angle, needleLength)}
              fill="#999"
            />
            <circle cx={centerX} cy={centerY} r="6" fill="#999" />

            <foreignObject
              x={tooltipX - 24}
              y={tooltipY - 28}
              width="48"
              height="24"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <div
                className="text-xs bg-black/80 text-white rounded px-2 py-1 text-center"
                xmlns="http://www.w3.org/1999/xhtml"
              >
                {SelectedCurrencySymbolVar}{value?.toLocaleString()}
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>

      <div className="mt-[4.5rem]">
        <div className="text-gray-400 text-sm">Total</div>
        <div className="text-xl font-bold">{SelectedCurrencySymbolVar}{activeTab === 0 ? profitLoss?.toLocaleString() : cashFlow.toLocaleString()}</div>
      </div>

      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
          <span>Positive value</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#ff5757]" />
          <span>Negative value</span>
        </div>
      </div>
    </div>
  );
}

SemicircleGauge.propTypes = {
  profitLoss: PropTypes.number.isRequired,
  cashFlow: PropTypes.number.isRequired,
  totalValue: PropTypes.number.isRequired,
};


function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
}
function getNeedlePolygon(cx, cy, angleDeg, length) {
  const angleRad = (angleDeg * Math.PI) / 180;
  const tipX = cx + Math.sin(angleRad) * length;
  const tipY = cy - Math.cos(angleRad) * length;

  const baseWidth = 10; 
  const baseRadius = 15; 

  const offsetX = Math.cos(angleRad) * baseWidth / 2;
  const offsetY = Math.sin(angleRad) * baseWidth / 2;

  const baseLeftX = cx - offsetX;
  const baseLeftY = cy - offsetY;

  const baseRightX = cx + offsetX;
  const baseRightY = cy + offsetY;

  return `${tipX},${tipY} ${baseLeftX},${baseLeftY} ${baseRightX},${baseRightY}`;
}
