import { useEffect, useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import ResidenceSelector from '../components/dashboard/ResidenceSelector';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

export default function Visitors() {
  const { user } = useAuth();

  const [residences, setResidences] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [visitorsLoading, setVisitorsLoading] = useState(false);

  useEffect(() => {
    if (user?.email) loadResidences();
  }, [user?.email]);

  useEffect(() => {
    if (selectedId) {
      loadVisitors(selectedId);
    } else {
      setVisitors([]);
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

  const loadVisitors = async (residenceId) => {
    try {
      setVisitorsLoading(true);
      const data = await api.entities.Visitor.filter(
        { residence_id: residenceId },
        '-created_date'
      );
      setVisitors(data || []);
    } finally {
      setVisitorsLoading(false);
    }
  };

  const activeVisitors = useMemo(
    () =>
      visitors.filter(
        (visitor) =>
          visitor.status === 'entered' ||
          visitor.status === 'active' ||
          visitor.status === 'inside'
      ),
    [visitors]
  );

  const historyVisitors = useMemo(
    () =>
      visitors.filter(
        (visitor) =>
          visitor.status !== 'entered' &&
          visitor.status !== 'active' &&
          visitor.status !== 'inside'
      ),
    [visitors]
  );

  const displayedVisitors =
    tab === 'active'
      ? activeVisitors
      : tab === 'history'
      ? historyVisitors
      : visitors;

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
            <Users className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Visitors</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            View active visitors and visitor history for your building.
          </p>
        </div>

        <ResidenceSelector
          residences={residences}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setTab('all')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'all'
              ? 'bg-primary text-white'
              : 'border border-border bg-background text-foreground hover:bg-muted'
          }`}
        >
          All ({visitors.length})
        </button>

        <button
          onClick={() => setTab('active')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'active'
              ? 'bg-primary text-white'
              : 'border border-border bg-background text-foreground hover:bg-muted'
          }`}
        >
          Active ({activeVisitors.length})
        </button>

        <button
          onClick={() => setTab('history')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'history'
              ? 'bg-primary text-white'
              : 'border border-border bg-background text-foreground hover:bg-muted'
          }`}
        >
          History ({historyVisitors.length})
        </button>
      </div>

      {visitorsLoading ? (
        <div className="py-8 flex items-center justify-center">
          <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : displayedVisitors.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            No visitors found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Visitor entries for this building will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedVisitors.map((visitor) => (
            <div
              key={visitor.id}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary capitalize">
                      {visitor.status || 'Unknown'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-foreground mt-3">
                    {[visitor.visitor_name, visitor.visitor_surname]
                      .filter(Boolean)
                      .join(' ') || 'Unnamed visitor'}
                  </p>

                  <p className="text-sm text-muted-foreground mt-1">
                    Unit {visitor.unit_number || '—'} · Code{' '}
                    {visitor.visitor_code || '—'}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <span className="text-muted-foreground">Entry:</span>{' '}
                  <span className="text-foreground font-medium">
                    {formatDateTime(visitor.entry_time)}
                  </span>
                </div>

                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <span className="text-muted-foreground">Exit:</span>{' '}
                  <span className="text-foreground font-medium">
                    {formatDateTime(visitor.exit_time)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
