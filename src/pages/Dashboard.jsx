import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Wrench, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ResidenceSelector from '../components/dashboard/ResidenceSelector';
import SubscriptionCard from '../components/dashboard/SubscriptionCard';
import CodeDisplay from '../components/dashboard/CodeDisplay';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [residences, setResidences] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [units, setUnits] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  useEffect(() => {
    if (user?.email) loadData();
  }, [user?.email]);

  useEffect(() => {
    if (selectedId) {
      loadUnits(selectedId);
      loadMaintenanceRequests(selectedId);
    } else {
      setUnits([]);
      setMaintenanceRequests([]);
    }
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
        monthly_total:
          Number(row.codes_purchased || row.student_code_limit || 0) * 250,
      }));

      setResidences(allResidences);
      setSelectedId(allResidences.length > 0 ? allResidences[0].id : null);
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async (resId) => {
    const allUnits = await api.entities.Unit.filter(
      { residence_id: resId },
      'unit_label'
    );
    setUnits(allUnits);
  };

  const loadMaintenanceRequests = async (resId) => {
    try {
      setMaintenanceLoading(true);

      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('residence_id', resId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMaintenanceRequests(data || []);
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const selectedResidence = residences.find((r) => r.id === selectedId);

  const recentMaintenance = useMemo(
    () => maintenanceRequests.slice(0, 3),
    [maintenanceRequests]
  );

  const pendingCount = useMemo(
    () => maintenanceRequests.filter((request) => request.status === 'pending').length,
    [maintenanceRequests]
  );

  const completedCount = useMemo(
    () => maintenanceRequests.filter((request) => request.status === 'completed').length,
    [maintenanceRequests]
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (residences.length === 0) {
    return (
      <div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Manager Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back
            {user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Building Info</h3>
            <p className="text-sm text-muted-foreground">
              No building has been set up yet.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Subscription</h3>
            <p className="text-sm text-muted-foreground">
              Subscription details will appear after building setup.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/get-started">
                <Button
                  size="sm"
                  className="w-full justify-start bg-destructive hover:bg-destructive/90 text-white border-destructive"
                >
                  <Plus className="w-3.5 h-3.5 mr-2" />
                  Set Up Your First Building
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/manager/maintenance')}
          className="mt-6 w-full text-left p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              <h3 className="text-base font-semibold text-foreground">
                Maintenance Requests
              </h3>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm font-medium text-foreground">
              No maintenance requests yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Requests will appear here once residents are linked and begin submitting them.
            </p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manager Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back
            {user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ResidenceSelector residences={residences} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </motion.div>

      {selectedResidence && (
        <motion.div key={selectedId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="p-6 rounded-2xl border border-border bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-3">Building Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{selectedResidence.building_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-medium text-right max-w-[60%]">
                    {selectedResidence.building_address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total units</span>
                  <span className="font-medium">
                    {selectedResidence.number_of_units}
                  </span>
                </div>
              </div>
            </div>

            <SubscriptionCard residence={selectedResidence} />

            <div className="p-6 rounded-2xl border border-border bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>

              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={async () => {
                    try {
                      const payload = {
                        manager_name: selectedResidence.manager_name,
                        manager_email: selectedResidence.manager_email,
                        owner_email: selectedResidence.owner_email,

                        building_name: selectedResidence.building_name,
                        building_address: selectedResidence.building_address,

                        number_of_units: selectedResidence.number_of_units,
                        numbering_format: selectedResidence.numbering_format,

                        manager_phone: selectedResidence.manager_phone,

                        emergency_ambulance: selectedResidence.emergency_ambulance,
                        emergency_fire: selectedResidence.emergency_fire,
                        emergency_police: selectedResidence.emergency_police,

                        max_visitors: selectedResidence.max_visitors,
                        sleepover_fee: selectedResidence.sleepover_fee,

                        house_rules_url: selectedResidence.house_rules_url,

                        student_code_limit:
                          selectedResidence.student_code_limit ||
                          selectedResidence.codes_purchased,

                        monthly_total: selectedResidence.monthly_total,

                        payment_type: 'renewal',
                        residence_id: selectedResidence.id,
                      };

                      const { data, error } = await supabase.functions.invoke(
                        'initialize-paystack',
                        {
                          body: payload,
                        }
                      );

                      if (error) throw error;

                      if (data?.authorization_url) {
                        window.location.href = data.authorization_url;
                      }
                    } catch (err) {
                      console.error('Renewal payment error:', err);
                      alert('Failed to initialize renewal payment.');
                    }
                  }}
                >
                  Renew Subscription
                </Button>

                <Link to="/get-started">
                  <Button
                    size="sm"
                    className="w-full justify-start bg-destructive hover:bg-destructive/90 text-white border-destructive"
                  >
                    <Plus className="w-3.5 h-3.5 mr-2" />
                    Add Another Building
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <CodeDisplay residence={selectedResidence} units={units} />
        </motion.div>
      )}
    </div>
  );
}
