const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const API_ENDPOINTS = {
  LOCATIONS: `${API_BASE_URL}/locations/`,
  SERVICES: `${API_BASE_URL}/services/`,
  SEARCH_SERVICES: (query) => `${API_BASE_URL}/services/?search=${query}`,
};

export default API_BASE_URL;