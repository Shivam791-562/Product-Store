import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { PackageIcon, PlusCircleIcon, RefreshCwIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";
import { useDebounce } from "../hooks/useDebounce";
import SkeletonCard from "../components/SkeletonCard";


function HomePage() {
  const { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    searchQuery, 
    setSearchQuery,
    sortOption,
    setSortOption,
    currentPage,
    setPage,
    pagination 
  } = useProductStore();

  // Local state for the search input to allow fast typing
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 500); // 500ms delay

  // Whenever the debounced value changes, update the global store
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      setSearchQuery(debouncedSearch);
    }
  }, [debouncedSearch, searchQuery, setSearchQuery]);

  // Fetch products whenever search, sort, or page changes in the global store
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, searchQuery, sortOption, currentPage]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="btn btn-primary"
          onClick={() => document.getElementById("add_product_modal").showModal()}
        >
          <PlusCircleIcon className="size-5 mr-2" />
          Add Product
        </button>
        <button className="btn btn-ghost btn-circle" onClick={fetchProducts}>
          <RefreshCwIcon className="size-5" />
        </button>
      </div>

      {/* Filter & Search Bar Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="size-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input input-bordered w-full pl-10"
            placeholder="Search products by name..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <select 
          className="select select-bordered w-full md:w-48"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="newest">Newest Added</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <AddProductModal />

      {error && <div className="alert alert-error mb-8">{error}</div>}

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <PackageIcon className="size-12" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">No products found</h3>
            <p className="text-gray-500 max-w-sm">
              {searchQuery ? "Try changing your search filters." : "Get started by adding your first product to the inventory."}
            </p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Create an array of 6 empty items to show 6 skeletons */}
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {products.length > 0 && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button 
                className="btn btn-outline btn-sm"
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeftIcon className="size-4 mr-1" /> Prev
              </button>
              
              <span className="text-sm font-medium">
                Page {currentPage} of {pagination.totalPages}
              </span>
              
              <button 
                className="btn btn-outline btn-sm"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage(currentPage + 1)}
              >
                Next <ChevronRightIcon className="size-4 ml-1" />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default HomePage;