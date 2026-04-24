import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';

export default function BuildingDetailsStep({ data, setData, onNext }) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleNumberingFormatChange = (value) => {
    setData((prev) => ({
      ...prev,
      numbering_format: value,
      custom_numbering_format:
        value === 'custom' ? prev.custom_numbering_format || '' : '',
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await api.storage.uploadAsset({
        file,
        category: 'house-rules',
        userId: user?.id || user?.email || 'anonymous',
      });
      update('house_rules_url', file_url);
    } finally {
      setUploading(false);
    }
  };

  const isValid =
    data.building_name &&
    data.building_address &&
    data.number_of_units > 0 &&
    data.manager_name &&
    data.manager_email &&
    data.manager_phone &&
    (data.numbering_format !== 'custom' || data.custom_numbering_format);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Building Details</h2>
          <p className="text-sm text-muted-foreground">Tell us about your building</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Building Name *</Label>
            <Input
              value={data.building_name || ''}
              onChange={(e) => update('building_name', e.target.value)}
              placeholder="e.g. Riverside Residence"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Building Address *</Label>
            <Input
              value={data.building_address || ''}
              onChange={(e) => update('building_address', e.target.value)}
              placeholder="e.g. 123 Main St, Cape Town"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Number of Units *</Label>
            <Input
              type="number"
              value={data.number_of_units || ''}
              onChange={(e) => update('number_of_units', parseInt(e.target.value) || 0)}
              placeholder="e.g. 50"
              min={1}
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Numbering Format</Label>
            <Select
              value={data.numbering_format || 'numeric'}
              onValueChange={handleNumberingFormatChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="numeric">Numeric (1, 2, 3...)</SelectItem>
                <SelectItem value="numeric_101">Numeric (101, 102, 103...)</SelectItem>
                <SelectItem value="alphanumeric_letter_first">Letter First (A1, A2...)</SelectItem>
                <SelectItem value="alphanumeric_number_first">Number First (1A, 1B...)</SelectItem>
                <SelectItem value="custom">Custom format</SelectItem>
              </SelectContent>
            </Select>

            {data.numbering_format === 'custom' && (
              <div className="mt-3">
                <Label className="text-sm font-medium mb-1.5 block">
                  Custom Numbering Format *
                </Label>
                <Input
                  value={data.custom_numbering_format || ''}
                  onChange={(e) => update('custom_numbering_format', e.target.value)}
                  placeholder="e.g. Block A - Room 01"
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold text-foreground mb-4">Manager Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Manager Name *</Label>
              <Input
                value={data.manager_name || ''}
                onChange={(e) => update('manager_name', e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Manager Email *</Label>
              <Input
                type="email"
                value={data.manager_email || ''}
                onChange={(e) => update('manager_email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Manager Phone *</Label>
              <Input
                value={data.manager_phone || ''}
                onChange={(e) => update('manager_phone', e.target.value)}
                placeholder="+27..."
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold text-foreground mb-4">Emergency Contacts</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Ambulance</Label>
              <Input
                value={data.emergency_ambulance || ''}
                onChange={(e) => update('emergency_ambulance', e.target.value)}
                placeholder="Enter ambulance contact"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Fire Department</Label>
              <Input
                value={data.emergency_fire || ''}
                onChange={(e) => update('emergency_fire', e.target.value)}
                placeholder="Enter fire department contact"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Police</Label>
              <Input
                value={data.emergency_police || ''}
                onChange={(e) => update('emergency_police', e.target.value)}
                placeholder="Enter police contact"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold text-foreground mb-4">Building Policies</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Max Visitors at a Time</Label>
              <Input
                type="number"
                value={data.max_visitors || ''}
                onChange={(e) => update('max_visitors', parseInt(e.target.value) || 0)}
                placeholder="e.g. 3"
                min={0}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Sleepover Fee (R)</Label>
              <Input
                type="number"
                value={data.sleepover_fee || ''}
                onChange={(e) => update('sleepover_fee', parseFloat(e.target.value) || 0)}
                placeholder="e.g. 50"
                min={0}
              />
            </div>
          </div>
          <div className="mt-5">
            <Label className="text-sm font-medium mb-1.5 block">House Rules PDF</Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
            {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
            {data.house_rules_url && !uploading && (
              <p className="text-xs text-green-600 mt-1">PDF uploaded successfully</p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={onNext}
            disabled={!isValid}
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 h-12 px-8 text-base font-semibold"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
