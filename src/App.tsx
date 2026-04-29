import { useState, useMemo, useEffect } from "react";
import Navbar from "./components/Navbar";
import SearchHero from "./components/SearchHero";
import NumberCard from "./components/NumberCard";
import AdminDashboard from "./components/AdminDashboard";
import { MobileNumber, NumberCategory } from "./lib/numbers";
import { motion, AnimatePresence } from "motion/react";
import { Award, TrendingUp, Info, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { 
  auth, 
  googleProvider, 
  db, 
  handleFirestoreError, 
  OperationType 
} from "./lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, query, orderBy, doc, getDoc } from "firebase/firestore";

export default function App() {
  const [view, setView] = useState<"home" | "admin">("home");
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [numbers, setNumbers] = useState<MobileNumber[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activePrefix, setActivePrefix] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<NumberCategory | null>(null);

  // Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Simple admin check: hardcoded for bootstrap email + custom doc check
        const isAdminEmail = u.email === 'atmanganat@gmail.com';
        const adminDoc = await getDoc(doc(db, "admins", u.uid));
        setIsAdmin(isAdminEmail || adminDoc.exists());
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  // Data Fetching
  useEffect(() => {
    const q = query(collection(db, "numbers"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MobileNumber[];
      setNumbers(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "numbers");
    });
    return () => unsubscribe();
  }, []);

  const filteredNumbers = useMemo(() => {
    return numbers.filter((item) => {
      const matchesSearch = item.full_number.includes(searchQuery) || 
                          item.price.toString().includes(searchQuery);
      const matchesPrefix = activePrefix ? item.prefix === activePrefix : true;
      const matchesCategory = activeCategory ? item.category === activeCategory : true;
      
      return matchesSearch && matchesPrefix && matchesCategory;
    });
  }, [numbers, searchQuery, activePrefix, activeCategory]);

  const vipNumbers = useMemo(() => filteredNumbers.filter(n => n.isVip), [filteredNumbers]);
  const regularNumbers = useMemo(() => filteredNumbers.filter(n => !n.isVip), [filteredNumbers]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView("home");
  };

  const handleLogoClick = () => {
    setView("home");
    setSearchQuery("");
    setActivePrefix(null);
    setActiveCategory(null);
  };

  return (
    <div className="min-h-screen bg-brand-midnight text-slate-100 selection:bg-brand-electric/30">
      <Navbar 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        isAdmin={isAdmin}
        onAdminToggle={() => setView(view === "home" ? "admin" : "home")}
        onLogoClick={handleLogoClick}
      />
      
      <div className="flex">
        <main className={`flex-1 min-w-0 text-white ${
          view === "home" ? "pt-[200px] md:pt-[152px]" : "pt-18"
        }`}>
          {view === "admin" && isAdmin ? (
            <div className="p-8">
              <AdminDashboard />
            </div>
          ) : (
            <>
              <SearchHero 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery}
                activePrefix={activePrefix}
                setActivePrefix={setActivePrefix}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
              
              <section className="max-w-6xl mx-auto px-6 py-12">
                
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <div className="flex justify-center py-24">
                      <div className="w-12 h-12 border-4 border-brand-electric border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : filteredNumbers.length > 0 ? (
                    <div className="space-y-16">
                      
                      {/* VİP Section */}
                      {vipNumbers.length > 0 && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <Award className="w-6 h-6 text-brand-gold" />
                            <h2 className="text-2xl font-bold font-display">VİP Seçimlər</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-brand-gold/50 to-transparent" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vipNumbers.map((num) => (
                              <div key={num.id}>
                                <NumberCard item={num} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Regular Section */}
                      {regularNumbers.length > 0 && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-brand-electric" />
                            <h2 className="text-2xl font-bold font-display">Təklif Olunanlar</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-brand-electric/50 to-transparent" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {regularNumbers.map((num) => (
                              <div key={num.id}>
                                <NumberCard item={num} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-24 text-center"
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Info className="w-8 h-8 text-slate-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Nəticə tapılmadı</h3>
                      <p className="text-slate-400">Axtarış meyarlarınıza uyğun nömrə mövcud deyil.</p>
                      <button 
                        onClick={() => {
                          setSearchQuery("");
                          setActivePrefix(null);
                          setActiveCategory(null);
                        }}
                        className="mt-6 text-brand-electric hover:underline font-medium"
                      >
                        Filtrləri təmizlə
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </section>
            </>
          )}
        </main>
      </div>

      <footer className="mt-24 border-t border-white/5 py-12 px-4 bg-brand-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold">Xəttim<span className="text-brand-electric">.az</span></span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Xəttim.az. Bütün hüquqlar qorunur.</p>
          <div className="flex gap-6">
            <a target="_blank" href="https://www.instagram.com/xettim.az/" className="text-slate-400 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">WhatsApp</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Telegram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
