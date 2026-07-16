import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedLocation: { id: '', name: '' },
  selectedService: { id: '', name: '' },
  selectedServiceType: { id: '', name: '', price: '', duration: '' },
  selectedProfessional: { id: '', name: '' },
  selectedServicePrice: '',
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload
    },
    setSelectedService: (state, action) => {
      state.selectedService = action.payload
    },
    setSelectedServiceType: (state, action) => {
      state.selectedServiceType = action.payload
    },
    setSelectedProfessional: (state, action) => {
      state.selectedProfessional = action.payload
    },
    setSelectedServicePrice: (state, action) => {
      state.selectedServicePrice = action.payload;
    },

    clearSelectedLocation: (state) => {
      state.selectedLocation = initialState.selectedLocation
    },
    clearSelectedService: (state) => {
      state.selectedService = initialState.selectedService
    },
    clearSelectedServiceType: (state) => {
      state.selectedServiceType = initialState.selectedServiceType
    },
    clearSelectedProfessional: (state) => {
      state.selectedProfessional = initialState.selectedProfessional
    },
    clearSelectedServicePrice: (state) => {
      state.selectedServicePrice = '';
    },

    resetSearch: () => initialState,
  },
})

export const {
  setSelectedLocation,
  setSelectedService,
  setSelectedServiceType,
  setSelectedProfessional,
  setSelectedServicePrice,
  clearSelectedLocation,
  clearSelectedService,
  clearSelectedServiceType,
  clearSelectedProfessional,
  clearSelectedServicePrice,
  resetSearch,
} = searchSlice.actions

export const selectSelectedLocation = (state) => state.search.selectedLocation
export const selectSelectedService = (state) => state.search.selectedService
export const selectSelectedServiceType = (state) => state.search.selectedServiceType
export const selectSelectedProfessional = (state) => state.search.selectedProfessional
export const selectSelectedServicePrice = (state) => state.search.selectedServicePrice;

export default searchSlice.reducer