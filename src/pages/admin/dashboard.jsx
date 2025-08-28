// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './components/Header';
import Stats from './components/Stats';
import ClientsTable from './components/ClientsTable';
import { baseUrl } from '../../utils/baseUrl';
import { Download } from 'lucide-react';
import  { CustomDropdownNations, CustomDropdownVerification } from './components/Dropdown'

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const h = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return debounced;
}

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const debouncedSearch   = useDebouncedValue(search, 300);
  const [page, setPage]   = useState(1);
  const [limit]  = useState(10);
  const [isVerified, setisVerified] = useState({ label: "Verified" , value: true }); 
  const [nationalities, setNationalities] = useState([]);
  const [selectedNation, setSelectedNation] = useState(null);
  const [clients, setClients]             = useState([]);
  const [totalPages, setTotalPages]       = useState(1);
  const [loading, setLoading]             = useState(true);
  const [metrics, setMetrics]             = useState({});
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const resp = await axios.get(`${baseUrl}admin/metrics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMetrics(resp.data.data || {});
      } catch (err) {
        console.error(err);
        toast.error('Failed to load metrics');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const resp = await axios.get(`${baseUrl}country`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNationalities([{ name: "All Nations", id: 300, code: "ALN" }, ...(resp.data.data || [])]);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load nationalities');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const resp = await axios.get(`${baseUrl}admin/clients`, {
          params: {
            page,
            limit,
            isVerified : isVerified.value,
            ...(debouncedSearch && { search: debouncedSearch }),
            ...(selectedNation && { nationality: selectedNation.id })
          },
          headers: { Authorization: `Bearer ${token}` }
        });

        const { clients: fetched = [], totalPages = 1 } = resp.data.data;
        setTotalPages(totalPages);

        setClients(
          fetched.map((c) => ({
            name: c.userName || "-",
            nationality: c.nationality?.name || '-',
            fiscalResidence: c.fiscalResidence || '-',
            email: c.email,
            isVerified: c.isVerified,
            lastLogin: c.loggedIn || null,
            profileUrl: c.profileUrl || ""
          }))
        );
      } catch (err) {
        console.error(err);
        toast.error('Failed to load clients');
      } finally {
        setLoading(false);
      }
    })();
  }, [page, limit, isVerified, debouncedSearch, selectedNation]);

  const handleNationChange = (option) => {
    setSelectedNation(option);
    setPage(1);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseUrl}admin/export-user-data`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', 
      });
      setIsExporting(false);
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exported_users.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setIsExporting(false);
      toast.error('Failed to export user data');
    }
  };
  
  

  return (
    <div className="min-h-screen bg-slate-900">
      <ToastContainer position="top-right" />
      <Header />

      <main className="p-4 md:p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Client Dashboard</h2>
          <p className="text-slate-400">Overview of all clients using the Kofinity platform</p>
        </div>

        <Stats metrics={metrics} />

        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-56 lg:w-[18rem] bg-slate-800/50 border border-slate-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />


          {/* <select
            value={selectedNation || 'All Nations'}
            onChange={(e) => handleNationChange(e.target.value)}
            className="w-full md:w-56 bg-slate-800/50 border border-slate-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option>All Nations</option>
            {nationalities.map((nat) => (
              <option key={nat} value={nat}>
                {nat}
              </option>
            ))}
          </select>

           <select
            value={isVerified}
            onChange={(e) => setisVerified(e.target.value)}
            className="w-full md:w-56 bg-slate-800/50 border border-slate-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          > 
            <option value={true}>Verified</option>
            <option value={false}>Not Verified</option>
           
          </select> */}
          <CustomDropdownNations
  options={nationalities}
  onChange={handleNationChange}
  selected={selectedNation}
  setSelected={setSelectedNation}
/>

<CustomDropdownVerification
  options={[{ label: 'Verified', value: true }, { label: 'Not Verified', value: false }]}
  onChange={(option) => setisVerified(option.value)}
  selected={isVerified}
  setSelected={setisVerified}
/>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <TailSpin
              height="80"
              width="80"
              color="#4f46e5"
              ariaLabel="loading-indicator"
              visible={true}
            />
          </div>
        ) : (
          <>
          <div className="flex justify-between items-center">
  <div>
    
  </div>

  <button
    onClick={handleExport}
    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
  >
    {isExporting ? (
      <TailSpin
        height="20"
        width="20"
        color="white"
        ariaLabel="loading-indicator"
        visible={true}
      />
    ) : (
      <Download className="inline" />
    )}
  </button>
</div>

            <ClientsTable clients={clients} />

            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-50"
              >
                <ChevronLeft className="inline mr-1" />
                Previous
              </button>
              <span className="text-slate-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-50"
              >
                Next
                <ChevronRight className="inline ml-1" />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
