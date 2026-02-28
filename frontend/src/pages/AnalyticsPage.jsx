import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSignIcon, PackageIcon, ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

function AnalyticsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ALL products from the new dedicated analytics route
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/analytics/all`);
        setAllProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const chartData = useMemo(() => {
    const ranges = {
      "$0 - $50": 0,
      "$51 - $100": 0,
      "$101 - $200": 0,
      "$201 - $500": 0,
      "$500+": 0,
    };

    allProducts.forEach((product) => {
      const price = parseFloat(product.price);
      if (price <= 50) ranges["$0 - $50"]++;
      else if (price <= 100) ranges["$51 - $100"]++;
      else if (price <= 200) ranges["$101 - $200"]++;
      else if (price <= 500) ranges["$201 - $500"]++;
      else ranges["$500+"]++;
    });

    return Object.keys(ranges).map((key) => ({
      name: key,
      count: ranges[key],
    }));
  }, [allProducts]);

  const totalValue = allProducts.reduce((sum, p) => sum + parseFloat(p.price), 0);
  const averagePrice = allProducts.length > 0 ? totalValue / allProducts.length : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button added here */}
      <Link to="/" className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Store
      </Link>

      <h2 className="text-3xl font-bold mb-8">Store Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body flex-row items-center gap-4">
            <div className="bg-primary/20 p-4 rounded-full text-primary">
              <PackageIcon className="size-8" />
            </div>
            <div>
              <p className="text-base-content/60 text-sm">Total Products</p>
              <h3 className="text-2xl font-bold">{allProducts.length}</h3>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body flex-row items-center gap-4">
            <div className="bg-success/20 p-4 rounded-full text-success">
              <DollarSignIcon className="size-8" />
            </div>
            <div>
              <p className="text-base-content/60 text-sm">Average Price</p>
              <h3 className="text-2xl font-bold">${averagePrice.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body flex-row items-center gap-4">
            <div className="bg-info/20 p-4 rounded-full text-info">
              <DollarSignIcon className="size-8" />
            </div>
            <div>
              <p className="text-base-content/60 text-sm">Total Inventory Value</p>
              <h3 className="text-2xl font-bold">${totalValue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl p-6">
        <h3 className="text-xl font-bold mb-6">Price Distribution (All Products)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="currentColor" opacity={0.6} />
              <YAxis allowDecimals={false} stroke="currentColor" opacity={0.6} />
              <Tooltip 
                cursor={{ fill: 'currentColor', opacity: 0.1 }}
                contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))', borderColor: 'var(--fallback-bc,oklch(var(--bc)))', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="currentColor" className="text-primary" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default AnalyticsPage;