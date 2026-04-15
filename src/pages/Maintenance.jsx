import { useEffect, useMemo, useState } from 'react';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResidenceSelector from '../components/dashboard/ResidenceSelector';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Maintenance() {
  const { user } = useAuth();

  const [residences, setResidences] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [maintenanceTab, setMaintenanceTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  useEffect(() => {
    if (user?.email) loadResidences();
  }, [user?.email]);

  useEffect(() => {
    if (selectedId) {
      loadMaintenanceRequests(selectedId);
    } else {
      setMaintenanceRequests([]);
    }
  }, [selectedId]);

  const loadResidences = async () => {
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
      }));

      setResidences(allResidences);
      setSelectedId(allResidences.length > 0 ? allResidences[0].id : null);
    } finally {
      setLoading(false);
    }
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

  const pendingRequests = useMemo(
    () => maintenanceRequests.filter((request) => request.status === 'pending'),
    [maintenanceRequests]
  );

  const completedRequests = useMemo(
    () => maintenanceRequests.filter((request) => request.status === 'completed'),
    [maintenanceRequests]
  );

  const displayedRequests =
    maintenanceTab === 'pending' ? pendingRequests : completedRequests;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Maintenance</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            View all building maintenance requests and their status.
          </p>
        </div>

        <ResidenceSelector
          residences={residences}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      <div className="flex gap-2 mb-6">
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
          variant={maintenanceTab === 'completed' ? 'default' : 'outline'}
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
                    {request.student_name || 'Student'} · {request.student_email}
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
  );
}
