import type { ReactNode } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FilterItem = { label: string; count?: number };

const appliedFilters = [
  { label: "All Categories", active: true },
  { label: "Location", active: false },
  { label: "Ratings", active: false },
  { label: "Status", active: false },
];

const subCategories: FilterItem[] = [
  { label: "All Categories", count: 197 },
  { label: "Pharmacies", count: 89 },
  { label: "Clinics & ENT", count: 38 },
  { label: "Wellness & Spa", count: 52 },
  { label: "Medical Supplies", count: 7 },
  { label: "Physiotherapy", count: 63 },
  { label: "Occupational Safety", count: 135 },
  { label: "Hygiene Services", count: 30 },
  { label: "Safety Training", count: 30 },
];

const locations: FilterItem[] = [
  { label: "All Cities", count: 235 },
  { label: "Kisumu", count: 11 },
  { label: "Mombasa", count: 50 },
  { label: "Nairobi", count: 1208 },
  { label: "Nakuru", count: 28 },
  { label: "Eldoret", count: 42 },
  { label: "Kericho", count: 42 },
  { label: "Other Cities", count: 130 },
];

const ratings = ["5 Stars", "4+ Stars", "3+ Stars"];
const statuses = ["Open Now Only", "Verified Only"];

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="group border-t pt-4">
      <summary className="mb-3 flex cursor-pointer list-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 text-muted-foreground transition-transform -rotate-90 group-open:rotate-0" />
      </summary>
      {children}
    </details>
  );
}

function CheckList({ items, prefix }: { items: FilterItem[]; prefix: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={item.label} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Checkbox id={`${prefix}-${i}`} />
            <Label htmlFor={`${prefix}-${i}`} className="text-sm font-normal">
              {item.label}
            </Label>
          </div>
          {item.count !== undefined && (
            <span className="text-xs text-muted-foreground">{item.count}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function RadioList({ items, name }: { items: string[]; name: string }) {
  return (
    <RadioGroup defaultValue={items[0]} className="space-y-2">
      {items.map((item, i) => (
        <div key={item} className="flex items-center gap-2">
          <RadioGroupItem value={item} id={`${name}-${i}`} />
          <Label htmlFor={`${name}-${i}`} className="text-sm font-normal">
            {item}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export function FilterSidebar() {
  return (
    <aside className="space-y-4">
      <div className="rounded-xl border p-4">
        <p className="text-sm font-semibold">Filters Applied</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {appliedFilters.map((f) => (
  <Badge
    key={f.label}
    variant="outline"
    className={f.active ? "border-secondary bg-secondary/10 text-secondary" : "text-muted-foreground"}
  >
    {f.label}
  </Badge>
))}
        </div>
      </div>

      <div className="space-y-4 rounded-xl border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9" />
        </div>

        <FilterGroup title="Sub Categories">
          <CheckList items={subCategories} prefix="sub" />
        </FilterGroup>
        <FilterGroup title="Location">
          <CheckList items={locations} prefix="loc" />
        </FilterGroup>
        <FilterGroup title="Ratings">
          <RadioList items={ratings} name="rating" />
        </FilterGroup>
        <FilterGroup title="Status">
          <RadioList items={statuses} name="status" />
        </FilterGroup>

        <Button variant="outline" className="w-full">Reset Filter</Button>
      </div>
    </aside>
  );
}