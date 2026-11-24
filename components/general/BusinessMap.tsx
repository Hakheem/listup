import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";


export function BusinessMap({ name, address }: { name: string; address: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl bg-emerald-50 p-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-emerald-700 text-white">
        <MapPin className="size-5" />
      </div>
      <p className="mt-3 text-sm font-semibold text-primary">{name}</p>
      <p className="text-xs text-muted-foreground">{address}</p>
      <a
        href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3"
      >
        <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
          Open in Google Maps
        </Button>
      </a>
    </div>
  );
}