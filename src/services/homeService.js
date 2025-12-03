// src/services/homeService.js

const USE_API = import.meta.env.VITE_USE_API === "true";
const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token") || "";

// Fallback mock data (keeps Home.jsx working today)
const mockFeaturedBusinesses = [];
const mockFeaturedServices = [];

/**
 * Get featured businesses
 */
export async function getFeaturedBusinesses() {
  if (!USE_API) {
    return mockFeaturedBusinesses;
  }

  try {
    const res = await fetch(`${API_URL}/home/featured-businesses`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    console.error("[homeService] getFeaturedBusinesses error:", err);
    return mockFeaturedBusinesses;
  }
}

/**
 * Get featured services
 */
export async function getFeaturedServices() {
  if (!USE_API) {
    return mockFeaturedServices;
  }

  try {
    const res = await fetch(`${API_URL}/home/featured-services`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    console.error("[homeService] getFeaturedServices error:", err);
    return mockFeaturedServices;
  }
}
