// Backend address. Override with VITE_API_BASE (e.g. in client/.env.local) when the API runs elsewhere.
export const API_ORIGIN = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
export const API_BASE = `${API_ORIGIN}/api`;
