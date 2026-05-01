import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSearch, FaCircleNotch } from 'react-icons/fa';
import api from '../utils/api';
import { toast } from 'react-toastify';

const MyAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMode, setActiveMode] = useState('manual');

    useEffect(() => {
        fetchAttendance();
        fetchActiveMode();
    }, []);

    const fetchActiveMode = async () => {
        try {
            const { data } = await api.get('/api/staff-panel/attendance-config/settings');
            if (data.success) {
                setActiveMode(data.data.staffMode || 'manual');
            }
        } catch (error) {
            console.error('Failed to fetch mode', error);
        }
    };

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/staff-panel/attendance-staff/my-history');
            if (data.success) {
                setAttendance(data.data);
            }
        } catch (error) {
            toast.error('Failed to load attendance history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'present': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
            case 'absent': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
            case 'late': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
        }
    };

    const filtered = attendance.filter(a => 
        new Date(a.date).toLocaleDateString().includes(searchTerm)
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <FaCircleNotch className="animate-spin text-4xl text-blue-600 mb-4" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Retrieving Log History...</p>
        </div>
    );

    return (
        <div className="p-6 space-y-8 animate-fadeIn">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Personal Attendance</h2>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 border ${
                            activeMode === 'manual' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            activeMode === 'biometric' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                            activeMode === 'hybrid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            'bg-orange-50 text-orange-600 border-orange-100'
                        }`}>
                            <div className={`w-1 h-1 rounded-full animate-pulse ${
                                activeMode === 'manual' ? 'bg-blue-600' :
                                activeMode === 'biometric' ? 'bg-purple-600' :
                                activeMode === 'hybrid' ? 'bg-emerald-600' :
                                'bg-orange-600'
                            }`}></div>
                            {activeMode} Mode Live
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">Review your presence and work logs across the academic cycle</p>
                </div>
                <div className="relative group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        placeholder="FILTER BY DATE..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64 shadow-sm"
                    />
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Punch In</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Punch Out</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Mode</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((item, idx) => (
                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-8 py-5 font-bold text-slate-700">
                                        {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest inline-block ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-slate-600">{item.timeIn ? new Date(item.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                    <td className="px-8 py-5 text-sm font-medium text-slate-600">{item.timeOut ? new Date(item.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                    <td className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-400 rounded text-[9px] font-bold uppercase tracking-wider">
                                            {item.source || 'Manual'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyAttendance;
