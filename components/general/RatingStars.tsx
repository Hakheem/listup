import { Star } from "lucide-react";

export function RatingStars({
  rating,
  className = "size-4",
}: {
  rating: number;
  className?: string;
}) {
  const filled = Math.floor(rating);
  return (
    <span className="flex" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${className} ${n <= filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
        />
      ))}
    </span>
  );
}