import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedLocation: { id: '', name: '' },
  selectedService: { id: '', name: '' },
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
    clearSelectedLocation: (state) => {
      state.selectedLocation = initialState.selectedLocation
    },
    clearSelectedService: (state) => {
      state.selectedService = initialState.selectedService
    },
    resetSearch: () => initialState,
  },
})

export const {
  setSelectedLocation,
  setSelectedService,
  clearSelectedLocation,
  clearSelectedService,
  resetSearch,
} = searchSlice.actions

export const selectSelectedLocation = (state) => state.search.selectedLocation
export const selectSelectedService = (state) => state.search.selectedService

export default searchSlice.reducer