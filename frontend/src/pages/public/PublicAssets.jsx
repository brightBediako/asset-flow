import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Badge, Button } from '@/components/ui/BaseComponents';
import { formatDate } from '@/lib/utils';
import { Plus, MapPin, Tag } from 'lucide-react';
import { Card } from '@/components/ui/BaseComponents';

export default function PublicAssets() {
  const [params, setParams] = useState({ page: 0, size: 12, search: '', status: 'AVAILABLE' });

  const { data, isLoading } = useQuery({
    queryKey: ['public-assets', params],
    queryFn: async () => {
      const resp = await apiClient.get('/assets/search', { params });
      return resp.data;
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Public Resource Catalog</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Browse currently available assets across our partner networks. Sign in to place a booking request.
          </p>
        </div>

        {/* Search Bar Alternative for Public Grid */}
        <div className="max-w-xl mx-auto">
           <div className="relative group">
              <input 
                 type="text" 
                 placeholder="Search assets (e.g. MacBook, Projector, Office Suite)..."
                 className="w-full h-14 pl-6 pr-24 bg-white border border-slate-200 rounded-2xl text-lg shadow-sm focus:ring-8 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none transition-all duration-300"
                 onChange={(e) => setParams(p => ({ ...p, search: e.target.value, page: 0 }))}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                 <Button>Search</Button>
              </div>
           </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
             ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {data?.content?.map((asset) => (
                 <motion.div 
                   key={asset.id}
                   whileHover={{ y: -4 }}
                   className="flex flex-col bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden group hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                 >
                   <div className="aspect-video bg-slate-100 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                         <Box className="h-16 w-16" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge status={asset.status}>{asset.status}</Badge>
                      </div>
                   </div>
                   <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 rounded-md">{asset.category}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">{asset.name}</h3>
                      <div className="space-y-2 mt-auto">
                         <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="h-4 w-4" /> {asset.location}
                         </div>
                         <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Tag className="h-4 w-4" /> SKU: {asset.sku || 'N/A'}
                         </div>
                      </div>
                      <Button className="w-full mt-6" variant="secondary">View Details</Button>
                   </div>
                 </motion.div>
               ))}
               {!data?.content?.length && (
                 <div className="col-span-full py-20 text-center">
                    <p className="text-slate-400 font-medium">No assets matching your search criteria.</p>
                 </div>
               )}
            </div>
            
            {/* Simple pagination */}
            {data?.totalPages > 1 && (
               <div className="flex items-center justify-center gap-2 mt-12">
                  <Button 
                    variant="outline" 
                    disabled={data.first}
                    onClick={() => setParams(p => ({ ...p, page: p.page - 1 }))}
                  >Previous</Button>
                  <span className="text-sm font-bold text-slate-500">Page {data.number + 1} of {data.totalPages}</span>
                  <Button 
                    variant="outline" 
                    disabled={data.last}
                    onClick={() => setParams(p => ({ ...p, page: p.page + 1 }))}
                  >Next</Button>
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { Box } from 'lucide-react';
import { motion } from 'motion/react';
