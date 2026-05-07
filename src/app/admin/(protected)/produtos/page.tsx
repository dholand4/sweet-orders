import { AdminLayout } from "@/components/AdminLayout";
import { ProductsView } from "@/view/admin-products";
import { getAdminCatalog } from "@/services/options";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const { products, allFlavors } = await getAdminCatalog();
  return (
    <AdminLayout title="Produtos">
      <ProductsView products={products} allFlavors={allFlavors} />
    </AdminLayout>
  );
}
