import React, { useState, useEffect, useRef } from 'react';
import { XIcon } from 'lucide-react';
import { TailSpin } from 'react-loader-spinner';
import { ChevronDown, ChevronUp } from 'lucide-react';


export default function AddTargetModal({ isOpen, onClose, onAdd, currencyOptions }) {
  const [targetKey, setTargetKey] = useState('GAV');
  const [amount, setAmount] = useState('');
const [loading, setLoading] = useState(false);
const dropdownRef = useRef();
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const options = ["GAV"];


useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#0A0A0C] border border-[#19191D] rounded-2xl w-full max-w-md p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <XIcon size={20} />
        </button>

        <h2 className="text-xl font-semibold text-white">Add target</h2>

        <div className="space-y-1">
  <label className="block text-sm text-gray-300">Target</label>
  <div className="relative" ref={dropdownRef}>
    <button
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className="w-full flex justify-between items-center bg-gray-950 border border-[#19191D] rounded-2xl text-white p-2"
    >
      {targetKey}
      {isDropdownOpen ? (
        <ChevronUp size={16} />
      ) : (
        <ChevronDown size={16} />
      )}
    </button>

    {isDropdownOpen && (
      <ul className="absolute w-full mt-1 bg-[#0A0A0C] border border-[#19191D] rounded-2xl z-10">
        {options.map((option) => (
          <li
            key={option}
            onClick={() => {
              setTargetKey(option);
              setIsDropdownOpen(false);
            }}
            className="p-2 text-white hover:bg-gray-800 cursor-pointer"
          >
            {option}
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
        <div className="space-y-1">
          <label className="block text-sm text-gray-300">Target amount</label>
          <div className="flex">
            <input
              type="number"
              className="flex-1 bg-[#0A0A0C] text-white rounded-l-lg p-2"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
           
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
  setLoading(true);
  try {
    await onAdd({ targetKey, amount });
  } finally {
    setLoading(false);
  }
}}

            disabled={!targetKey || !amount}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white disabled:opacity-50"
          >
             {loading ? (
      <TailSpin height={20} width={20} color="white" ariaLabel="loading" />
    ) : (
      'Add target'
    )}
          </button>
        </div>
      </div>
    </div>
  );
}
