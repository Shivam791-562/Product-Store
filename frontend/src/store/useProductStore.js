import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useProductStore = create((set, get) => ({
  // products state
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  // search, sort, and pagination state
  searchQuery: "",
  sortOption: "newest",
  currentPage: 1,
  pagination: {
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  },

  // form state
  formData: {
    name: "",
    price: "",
    image: "",
  },

  // setters for UI interactions
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }), // Reset to page 1 on new search
  setSortOption: (option) => set({ sortOption: option, currentPage: 1 }), // Reset to page 1 on new sort
  setPage: (page) => set({ currentPage: page }),
  
  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts(); // Refresh the list
      get().resetForm();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.log("Error in addProduct function", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { searchQuery, sortOption, currentPage } = get();
      
      const queryParams = new URLSearchParams({
        search: searchQuery,
        sort: sortOption,
        page: currentPage,
        limit: 6 // 6 products per page
      }).toString();

      const response = await axios.get(`${BASE_URL}/api/products?${queryParams}`);
      
      set({ 
        products: response.data.data, 
        pagination: response.data.pagination,
        error: null 
      });
    } catch (err) {
      if (err.status == 429) set({ error: "Rate limit exceeded", products: [] });
      else set({ error: "Something went wrong", products: [] });
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    console.log("deleteProduct function called", id);
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      await get().fetchProducts(); 
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log("Error in deleteProduct function", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data, 
        error: null,
      });
    } catch (error) {
      console.log("Error in fetchProduct function", error);
      set({ error: "Something went wrong", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },
  
  updateProduct: async (id) => {
    try {
      const { formData, products } = get();
      
      const updatedProducts = products.map((p) => 
        p.id === parseInt(id) ? { ...p, ...formData } : p
      );
      set({ products: updatedProducts });

      const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
      
      set({ currentProduct: response.data.data });
      toast.success("Product updated successfully");
      
    } catch (error) {
      toast.error("Something went wrong");
      await get().fetchProducts(); 
      console.log("Error in updateProduct function", error);
    }
  },
}));