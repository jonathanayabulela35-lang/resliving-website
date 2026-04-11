import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, Plus, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import ResidenceSelector from '../components/dashboard/ResidenceSelector';
import SubscriptionCard from '../components/dashboard/SubscriptionCard';
import CodeDisplay from '../components/dashboard/CodeDisplay';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [residences, setResidences] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) loadData();
  }, [user?.email]);

  useEffect(() => {
    if (selectedId) loadUnits(selectedId);
  }, [selectedId]);

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('residences')
        .select('*')
        .or(`owner_email.eq.${user.email},manager_email.eq.${user.email}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const allResidences = (data || []).map((row) => ({
        ...row,
        building_name: row.name,
        building_address: row.address,
        number_of_units: row.num_units,
        monthly_total: Number(row.codes_purchased || row.student_code_limit || 0) * 150,
      }));
      setResidences(allResidences);
      if (allResidences.length > 0) setSelectedId(allResidences[0].id);
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async (resId) => {
    const allUnits = await api.entities.Unit.filter({ residence_id: resId }, 'unit_label');
    setUnits(allUnits);
  };

  const selectedResidence = residences.find((r) => r.id === selectedId);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  if (residences.length === 0) {
    return (
      <div className="py-20 lg:py-28">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6"><Building2 className="w-7 h-7 text-primary" /></div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No Buildings Yet</h2>
          <p className="text-sm text-muted-foreground mb-8">Set up your first building to get started with ResLiving.</p>
          <Link to="/get-started"><Button size="lg" className="bg-destructive hover:bg-destructive/90 text-white h-12 px-8 text-base font-semibold"><Plus className="w-4 h-4 mr-2" />Set Up Your Building</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manager Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <ResidenceSelector residences={residences} selectedId={selectedId} onSelect={setSelectedId} />
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
          </div>
        </motion.div>

        {selectedResidence && (
          <motion.div key={selectedId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3 className="text-sm font-semibold text-foreground mb-3">Building Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{selectedResidence.building_name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium text-right max-w-[60%]">{selectedResidence.building_address}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total units</span><span className="font-medium">{selectedResidence.number_of_units}</span></div>
                </div>
              </div>
              <SubscriptionCard residence={selectedResidence} />
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
                <div className="space-y-2"><Link to="/get-started"><Button variant="outline" size="sm" className="w-full justify-start"><Plus className="w-3.5 h-3.5 mr-2" />Add Another Building</Button></Link></div>
              </div>
            </div>
            <CodeDisplay residence={selectedResidence} units={units} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
