import { useEffect, useMemo, useRef, useState } from 'react';
import { Settings as SettingsIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResidenceSelector from '../components/dashboard/ResidenceSelector';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export default function Settings() {
  const { user } = useAuth();

  const [residences, setResidences] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.email) loadResidences();
  }, [user?.email]);

  useEffect(() => {
    if (selectedId) {
      loadResidenceSettings(selectedId);
    } else {
      setForm(null);
    }
  }, [selectedId]);

  const selectedResidence = useMemo(
    () => residences.find((item) => item.id === selectedId),
    [residences, selectedId]
  );

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

  const loadResidenceSettings = async (residenceId) => {
    const data = await api.entities.Residence.filter({ id: residenceId });
    setForm(data?.[0] || null);
  };

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      if (!selectedId || !form) {
        setNotice('Please select a building first.');
        return;
      }

      setSaving(true);
      setNotice('');

      await api.entities.Residence.update(selectedId, form);
      await loadResidenceSettings(selectedId);

      setNotice('Settings updated successfully.');
    } catch (error) {
      setNotice(error.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const uploadPdf = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setNotice('');

      const upload = await api.storage.uploadAsset({
        file,
        category: 'house-rules',
        residenceId: selectedId,
        userId: user.id,
      });

      update('house_rules_url', upload.file_url);
      setNotice('House rules PDF uploaded successfully.');
    } catch (error) {
      setNotice(error.message || 'Failed to upload PDF.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
            <SettingsIcon className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Manage building settings, house rules, manager details, and emergency contacts.
          </p>
        </div>

        <ResidenceSelector
          residences={residences}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {!selectedResidence || !form ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            No building selected
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Select a building to view and update its settings.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-background p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Building Rules
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Max Visitors per Unit
                </label>
                <input
                  type="number"
                  value={form.max_visitors ?? ''}
                  onChange={(e) => update('max_visitors', e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="e.g. 3"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Sleepover Fee
                </label>
                <input
                  type="number"
                  value={form.sleepover_fee ?? ''}
                  onChange={(e) => update('sleepover_fee', e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="e.g. 50"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">
              House Rules
            </h2>

            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={uploadPdf}
                className="block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium"
              />

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading
                    ? 'Uploading...'
                    : form.house_rules_url
                    ? 'Replace PDF'
                    : 'Upload PDF'}
                </Button>

                {form.house_rules_url ? (
                  <a
                    href={form.house_rules_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    View Current PDF
                  </a>
                ) : null}
              </div>

              <p className="text-xs text-muted-foreground">
                Upload a PDF of your building’s house rules so residents can access it.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Manager Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Manager Name
                </label>
                <input
                  type="text"
                  value={form.manager_name || ''}
                  onChange={(e) => update('manager_name', e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="Manager full name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Manager Email
                </label>
                <input
                  type="email"
                  value={form.manager_email || ''}
                  onChange={(e) => update('manager_email', e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="manager@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Manager Phone
                </label>
                <input
                  type="text"
                  value={form.manager_phone || ''}
                  onChange={(e) => update('manager_phone', e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="+27..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Emergency Contacts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Ambulance
                </label>
                <input
                  type="text"
                  value={form.emergency_ambulance || ''}
                  onChange={(e) => update('emergency_ambulance', e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="Ambulance contact"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Police
                </label>
                <input
                  type="text"
                  value={form.emergency_police || ''}
                  onChange={(e) => update('emergency_police', e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="Police contact"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Fire Department
                </label>
                <input
                  type="text"
                  value={form.emergency_fire || ''}
                  onChange={(e) => update('emergency_fire', e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="Fire department contact"
                />
              </div>
            </div>
          </div>

          {notice ? (
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
              {notice}
            </div>
          ) : null}

          <div>
            <Button
              onClick={saveSettings}
              disabled={saving || uploading}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
