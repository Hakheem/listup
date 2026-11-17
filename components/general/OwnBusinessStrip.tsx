import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OwnBusinessStrip() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100">
          <Sparkles className="size-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-semibold">Own a business in this category?</p>
          <p className="text-xs text-muted-foreground">
            Get listed and reach customers searching for your services.
          </p>
        </div>
      </div>
      <Link href="/signup">
        <Button size="sm">List Your Business</Button>
      </Link>
    </div>
  );
}
