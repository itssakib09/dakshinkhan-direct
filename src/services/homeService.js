// homeService.js
import { USE_API, API_URL } from '../config'

const token = localStorage.getItem("token") || "";

const mockFeaturedBusinesses = [];
const mockFeaturedServices = [];

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