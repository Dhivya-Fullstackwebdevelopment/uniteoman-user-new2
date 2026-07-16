import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedLocation: { id: '', name: '' },
  selectedService: { id: '', name: '' },
  selectedServiceType: { id: '', name: '', price: '', duration: '' },
  selectedProfessional: { id: '', name: '' },
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
    resetSearch: () => initialState,
  },
})

export const {
  setSelectedLocation,
  setSelectedService,
  setSelectedServiceType,
  setSelectedProfessional,
  clearSelectedLocation,
  clearSelectedService,
  clearSelectedServiceType,
  clearSelectedProfessional,
  resetSearch,
} = searchSlice.actions

export const selectSelectedLocation = (state) => state.search.selectedLocation
export const selectSelectedService = (state) => state.search.selectedService
export const selectSelectedServiceType = (state) => state.search.selectedServiceType
export const selectSelectedProfessional = (state) => state.search.selectedProfessional

export default searchSlice.reducer