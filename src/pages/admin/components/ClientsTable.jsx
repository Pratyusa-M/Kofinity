import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { ScrollArea } from './ui/scroll-area';
import moment from 'moment';

const ClientsTable = ({ clients, nationalities, selectedNation, setSelectedNation, search, setSearch }) => {

  const isMobile = useIsMobile();
console.log("clients", clients)
console.log("nationalities,", nationalities)

  const setSelectedNationfFunc = (nation) => {
    if (nation?.name === 'All Nations') {
      setSelectedNation(null);
      return;
    }
    setSelectedNation(nation);
  }

  const setSearchFunc = (search) => {
    if (search === '') {
      return;
    }
    setSearch(search);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        
        {/* <div className="md:ml-auto">
          <button className="w-full md:w-auto flex items-center justify-center gap-2 border border-slate-700 rounded-full px-4 py-2 bg-slate-900/70 text-white hover:bg-slate-800 font-medium transition-colors">
            <span>Export</span>
            <ArrowDown size={18} />
          </button>
        </div> */}
      </div>
      
      <div className="bg-slate-800/50 rounded-xl border border-slate-700">
        {isMobile ? (
          <div className="p-2 space-y-4">
            {clients?.length === 0 ? (
              <p className="text-center text-slate-400 py-4">No clients found</p>
            ) : (
              clients?.map((client) => (
                <div key={client.email} className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-3">
                          {client?.profileUrl ? (<img src={client.profileUrl} className='w-8 h-8 rounded-full' />) : (<div className='w-8 h-8 rounded-full bg-slate-600'/>)}
                    <span className="text-white font-medium text-wrap max-w-full">{client.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-slate-400">Nationality</p>
                      <p className="text-slate-200">{client.nationality}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Fiscal Residence</p>
                      <p className="text-slate-200">{client.fiscalResidence}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Email</p>
                      <p className="text-slate-200 truncate">{client.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Last Login</p>
                      <p className="text-slate-200 truncate">{client?.lastLogin ?  moment(client.lastLogin).format("MM/DD/YY") : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Verification</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs
                        ${client.isVerified ? 'bg-green-500/20 text-blue-400' :
                       'bg-red-500/20 text-red-400'
                        }`}>
                        {client.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                  
                </div>
              ))
            )}
          </div>
        ) : (
          <ScrollArea className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-slate-400 font-medium">User Name</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Nationality</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Fiscal Residence</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Email</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Last Login</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Verification</th>
                </tr>
              </thead>
              <tbody>
                {clients?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-slate-400">No clients found</td>
                  </tr>
                ) : (
                  clients?.map((client) => (
                    <tr key={client.email} className="border-b border-slate-700/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {client?.profileUrl ? (<img src={client.profileUrl} className='w-8 h-8 rounded-full' />) : (<div className='w-8 h-8 rounded-full bg-slate-600'/>)}
                          <span className="text-white">{client.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{client.nationality}</td>
                      <td className="p-4 text-slate-300">{client.fiscalResidence}</td>
                      <td className="p-4 text-slate-300">{client.email}</td>
                      <td className="p-4 text-slate-300">{client?.lastLogin ? moment(client.lastLogin).format("MM/DD/YY HH:MM:SS") : "N/A"}</td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs
                          ${!client.isVerified ? 'bg-red-500/20 text-red-400' :
                          'bg-green-500/20 text-green-400'
                          }`}>
                          {client.isVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </td>
                     
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default ClientsTable;