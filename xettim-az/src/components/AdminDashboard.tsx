import React, { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { MobileNumber, NumberCategory, formatPhoneNumber } from "../lib/numbers";
import { Plus, Edit2, Trash2, X, Check, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PREFIXES = ["010", "050", "051", "055", "070", "077", "099"];
const CATEGORIES: NumberCategory[] = ["VİP", "Qızıl", "Gümüş", "Ardıcıl"];

export default function AdminDashboard() {
  const [numbers, setNumbers] = useState<MobileNumber[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<MobileNumber>>({
    prefix: "050",
    full_number: "050",
    price: 0,
    category: "Gümüş",
    status: "available",
    isVip: false
  });

  useEffect(() => {
    const q = query(collection(db, "numbers"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MobileNumber[];
      setNumbers(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "numbers");
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.full_number || formData.full_number.length < 3) {
      alert("Zəhmət olmasa düzgün nömrə daxil edin.");
      return;
    }
    
    if (formData.price === undefined || formData.price < 0) {
      alert("Qiymət 0-dan az ola bilməz.");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "numbers", editingId), {
          prefix: formData.prefix,
          full_number: formData.full_number,
          price: formData.price,
          category: formData.category,
          status: formData.status,
          isVip: formData.isVip,
          updatedAt: serverTimestamp()
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "numbers"), {
          prefix: formData.prefix,
          full_number: formData.full_number,
          price: formData.price,
          category: formData.category,
          status: formData.status,
          isVip: formData.isVip,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        setIsAdding(false);
      }
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "numbers");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu nömrəni silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteDoc(doc(db, "numbers", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `numbers/${id}`);
    }
  };

  const startEdit = (number: MobileNumber) => {
    setEditingId(number.id);
    setFormData(number);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      prefix: "050",
      full_number: "050",
      price: 0,
      category: "Gümüş",
      status: "available",
      isVip: false
    });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-display">İnventarın İdarə Edilməsi</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-brand-electric text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-electric/90 transition-all shadow-lg shadow-brand-electric/20"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Nömrə</span>
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-black/60 backdrop-blur-sm"
          >
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-xl w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editingId ? "Nömrəni Düzəlt" : "Yeni Nömrə Əlavə Et"}</h2>
                <button onClick={resetForm} className="p-2 hover:bg-white/5 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prefiks</label>
                    <select 
                      value={formData.prefix}
                      onChange={(e) => setFormData({...formData, prefix: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-electric outline-none"
                    >
                      {PREFIXES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nömrə (10 rəqəm)</label>
                    <input 
                      type="text"
                      value={formData.full_number}
                      onChange={(e) => setFormData({...formData, full_number: e.target.value})}
                      placeholder="0501234567"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-electric outline-none"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qiymət (AZN)</label>
                    <input 
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-electric outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kateqoriya</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as NumberCategory})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-electric outline-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={formData.isVip}
                      onChange={(e) => setFormData({...formData, isVip: e.target.checked})}
                      className="w-5 h-5 rounded border-white/10 bg-white/5 text-brand-gold focus:ring-brand-gold/20"
                    />
                    <span className="text-sm font-medium">VİP Status</span>
                  </label>

                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-sm focus:border-brand-electric outline-none"
                    >
                      <option value="available">Mövcuddur</option>
                      <option value="sold">Satılıb</option>
                      <option value="reserved">Rezerv</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-white text-brand-black px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Yadda saxla</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-brand-sidebar border border-gray-800 rounded-3xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-brand-input border-b border-gray-800">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Nömrə</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Kateqoriya</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Qiymət</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {numbers.map((number) => (
              <tr key={number.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-white">
                    <span className="font-mono font-bold text-lg">{formatPhoneNumber(number.full_number)}</span>
                    {number.isVip && <span className="text-[10px] bg-brand-gold/20 text-brand-gold px-1.5 py-0.5 rounded font-black border border-brand-gold/30 uppercase">VİP</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-400">{number.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-white">{number.price} AZN</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter ${
                    number.status === 'available' ? 'bg-brand-cyber/10 text-brand-cyber border border-brand-cyber/20' : 
                    number.status === 'sold' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                  }`}>
                    {number.status === 'available' ? 'Mövcuddur' : number.status === 'sold' ? 'Satılıb' : 'Rezerv'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => startEdit(number)}
                      className="p-2 hover:text-brand-electric transition-all text-gray-500"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(number.id)}
                      className="p-2 hover:text-red-500 transition-all text-gray-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {numbers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  Hələ heç bir nömrə əlavə edilməyib.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
