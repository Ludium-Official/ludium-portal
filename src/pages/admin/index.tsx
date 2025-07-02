import { useCarouselItemsQuery } from "@/apollo/queries/carousel-items.generated";
import { DataTable } from "@/components/data-table";
import { carouselItemsColumns } from "@/pages/admin/lib/carousel-items-columns";
import type { CarouselItem } from "@/pages/admin/lib/carousel-items-columns";

function AdminPage() {
  const { data } = useCarouselItemsQuery();
  return (
    <div className="p-10">
      <h2 className="text-3xl font-semibold mb-10">Carousel Items | Main Page</h2>
      <DataTable columns={carouselItemsColumns} data={(data?.carouselItems ?? []) as CarouselItem[]} />
    </div>);
}

export default AdminPage;
