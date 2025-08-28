// src/components/common/Stats.jsx
import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import PropTypes from 'prop-types';

const Stats = ({ metrics }) => {
  const {
    totalClients = 0,
    totalClientsChange = 0,
    newClients = 0,
    newClientsChange = 0,
  } = metrics || {};

  const renderChange = (change) => {
    const isPositive = change >= 0;
    const ArrowIcon = isPositive ? FiArrowUp : FiArrowDown;
    const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
    return (
      <p className={`flex items-center text-sm mt-1 ${colorClass}`}>
        <ArrowIcon className="inline mr-1" />
        {Math.abs(change)}% from last month
      </p>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Total Clients */}
      <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
        <p className="text-slate-400">Total Clients</p>
        <p className="text-3xl font-bold text-white mt-1">{totalClients}</p>
        {renderChange(totalClientsChange)}
      </div>

      {/* New Clients */}
      <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
        <p className="text-slate-400">New Clients</p>
        <p className="text-3xl font-bold text-white mt-1">{newClients}</p>
        {renderChange(newClientsChange)}
      </div>
    </div>
  );
};

Stats.propTypes = {
  metrics: PropTypes.shape({
    totalClients: PropTypes.number,
    totalClientsChange: PropTypes.number,
    newClients: PropTypes.number,
    newClientsChange: PropTypes.number,
  }),
};

export default Stats;
