import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";

export default function ResidenceSelector({ residences, selectedId, onSelect }) {
  if (!residences || residences.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      <Building2 className="w-4 h-4 text-primary" />
      <Select value={selectedId || ""} onValueChange={onSelect}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select a building" />
        </SelectTrigger>
        <SelectContent>
          {residences.map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.building_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}