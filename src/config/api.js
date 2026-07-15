const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const API_ENDPOINTS = {
  LOCATIONS: `${API_BASE_URL}/locations/`,
  SERVICES: `${API_BASE_URL}/services/`,
  PROFESSIONALS: `${API_BASE_URL}/professionals/`,
  SEARCH_SERVICES: (query) => `${API_BASE_URL}/services/?search=${query}`,
  SERVICES_BY_LOCATION: (locationId) => `${API_BASE_URL}/services/?location_id=${locationId}`,
  PROFESSIONALS_BY_LOCATION_AND_SERVICE: (locationId, serviceId) => 
    `${API_BASE_URL}/professionals/?location_id=${locationId}&service_id=${serviceId}`,
  SERVICE_BY_ID: (serviceId) => `${API_BASE_URL}/services/?service_id=${serviceId}`,
  PROFESSIONAL_DETAIL: (professionalId) => `${API_BASE_URL}/professionals/${professionalId}/`,
  SERVICE_BY_ID: (serviceId) => `${API_BASE_URL}/services/?service_id=${serviceId}`,
};

export default API_BASE_URL;