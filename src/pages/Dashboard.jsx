import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, Plus, LogOut, Wrench } from 'lucide-react';
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
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [maintenanceTab, setMaintenanceTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  useEffect(() => {
    if (user?.email) loadData();
  }, [user?.email]);

  useEffect(() => {
    if (selectedId) {
      loadUnits(selectedId);
      loadMaintenanceRequests(selectedId);
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
          Number(row.codes_purchased || row.student_code_limit || 0) * 150,
      }));

      setResidences(allResidences);

      if (allResidences.length > 0) {
        setSelectedId(allResidences[0].id);
      }
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

  const pendingRequests = useMemo(
    () => maintenanceRequests.filter((request) => request.status === 'pending'),
    [maintenanceRequests]
  );

  const completedRequests = useMemo(
    () =>
      maintenanceRequests.filter((request) => request.status === 'completed'),
    [maintenanceRequests]
  );

  const displayedRequests =
    maintenanceTab === 'pending' ? pendingRequests : completedRequests;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (residences.length === 0) {
    return (
      <div className="py-20 lg:py-28">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            No Buildings Yet
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Set up your first building to get started with ResLiving.
          </p>
          <Link to="/get-started">
            <Button
              size="lg"
              className="bg-destructive hover:bg-destructive/90 text-white h-12 px-8 text-base font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Set Up Your Building
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Manager Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Welcome back
              {user?.user_metadata?.full_name
                ? `, ${user.user_metadata.full_name}`
                : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ResidenceSelector
              residences={residences}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {selectedResidence && (
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Building Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">
                      {selectedResidence.building_name}
                    </span>
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
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link to="/get-started">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Plus className="w-3.5 h-3.5 mr-2" />
                      Add Another Building
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <CodeDisplay residence={selectedResidence} units={units} />

            <div className="mt-6 p-6 rounded-2xl border border-border bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">
                    Maintenance Requests
                  </h3>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={maintenanceTab === 'pending' ? 'default' : 'outline'}
                    className={
                      maintenanceTab === 'pending'
                        ? 'bg-primary hover:bg-primary/90'
                        : ''
                    }
                    onClick={() => setMaintenanceTab('pending')}
                  >
                    Pending ({pendingRequests.length})
                  </Button>

                  <Button
                    size="sm"
                    variant={
                      maintenanceTab === 'completed' ? 'default' : 'outline'
                    }
                    className={
                      maintenanceTab === 'completed'
                        ? 'bg-primary hover:bg-primary/90'
                        : ''
                    }
                    onClick={() => setMaintenanceTab('completed')}
                  >
                    Completed ({completedRequests.length})
                  </Button>
                </div>
              </div>

              {maintenanceLoading ? (
                <div className="py-8 flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : displayedRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="text-sm font-medium text-foreground">
                    No {maintenanceTab} maintenance requests
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Requests for this building will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-xl border border-border p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary capitalize">
                              {request.status}
                            </span>
                            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-muted text-foreground capitalize">
                              {request.category}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-foreground mt-3">
                            Unit {request.unit_number}
                          </p>

                          <p className="text-sm text-muted-foreground mt-1">
                            {request.student_name || 'Student'} ·{' '}
                            {request.student_email}
                          </p>
                        </div>

                        {request.created_at ? (
                          <p className="text-xs text-muted-foreground">
                            {new Date(request.created_at).toLocaleString()}
                          </p>
                        ) : null}
                      </div>

                      <p className="text-sm text-foreground mt-3 leading-relaxed">
                        {request.details}
                      </p>

                      {request.image_url ? (
                        <a
                          href={request.image_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex mt-3 text-sm text-primary hover:underline"
                        >
                          View attached image
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
