import { ProductsView } from "@/view/admin-products";
import { getAdminCatalog } from "@/services/options";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const { products, allFlavors, allDecoStyles } = await getAdminCatalog();
  return <ProductsView products={products} allFlavors={allFlavors} allDecoStyles={allDecoStyles} />;
}
