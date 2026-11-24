import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { OwnBusinessStrip } from "@/components/general/OwnBusinessStrip";
import { categories } from "@/lib/data/categories";
import { businesses } from "@/lib/data/businesses";
import { FilterSidebar } from "@/components/general/FilterSidebar";
import { Button } from "@/components/ui/button";
import { BusinessListingCard } from "@/components/general/BusinessListingCard";


export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const items = businesses.filter((b) => b.categorySlug === slug);
  const related = categories
  .filter((c) => !c.hidden && c.slug !== slug)
  .slice(0, 9);

  return (
    <section className="py-8">
      <Container>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="size-3" />
          <Link href="/businesses" className="hover:text-foreground">Categories</Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{category.name}</span>
        </nav>

        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{category.name} in Kenya</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {items.length} businesses listed · {category.count} across all counties
          </p>
        </div>

        
          
          <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
  <FilterSidebar />

          <div>
            <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{items.length}</span> of {category.count} results
            </p>

            <div className="my-4">
              <OwnBusinessStrip />
            </div>
</div>
            {items.length === 0 ? (
              <p className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
                No businesses listed in this category yet.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((biz) => (
                  <BusinessListingCard key={biz.id} business={biz} href={`/businesses/${slug}/${biz.slug}`} />
                ))}
              </div>
            )}
            {items.length > 0 && (
  <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
    <Button variant="outline" size="sm" disabled>Prev</Button>
    {[1, 2, 3, 4, 5].map((n) => (
      <Button key={n} size="sm" variant={n === 1 ? "default" : "outline"}>{n}</Button>
    ))}
    <Button variant="outline" size="sm">Next</Button>
  </nav>
)}

<div className="mt-10">
  <h2 className="text-sm font-semibold">Related Categories</h2>
  <div className="mt-3 flex flex-wrap gap-2">
    {related.map((c) => (
      <Link
        key={c.slug}
        href={`/businesses/${c.slug}`}
        className="rounded-full border px-3 py-1 text-xs hover:border-secondary hover:text-secondary"
      >
        {c.name}
      </Link>
    ))}
  </div>
</div>
          </div>
              </div>                                                                                                                                                     
      </Container>
    </section>
  );
}