import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedLocation: { id: '', name: '' },
  selectedService: { id: '', name: '' },
  selectedServiceType: { id: '', name: '', price: '', duration: '' },
  selectedProfessional: { id: '', name: '' },
  selectedServicePrice: '',
  selectedDate: '',
  selectedTime: '',
  selectedDateObj: null,
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
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },

    setSelectedTime: (state, action) => {
      state.selectedTime = action.payload;
    },

    setSelectedDateObj: (state, action) => {
      state.selectedDateObj = action.payload;
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
    clearSelectedDate: (state) => {
      state.selectedDate = '';
    },

    clearSelectedTime: (state) => {
      state.selectedTime = '';
    },

    clearSelectedDateObj: (state) => {
      state.selectedDateObj = null;
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
  setSelectedDate,
  setSelectedTime,
  setSelectedDateObj,

  clearSelectedLocation,
  clearSelectedService,
  clearSelectedServiceType,
  clearSelectedProfessional,
  clearSelectedServicePrice,
  clearSelectedDate,
  clearSelectedTime,
  clearSelectedDateObj,

  resetSearch,
} = searchSlice.actions

export const selectSelectedLocation = (state) => state.search.selectedLocation
export const selectSelectedService = (state) => state.search.selectedService
export const selectSelectedServiceType = (state) => state.search.selectedServiceType
export const selectSelectedProfessional = (state) => state.search.selectedProfessional
export const selectSelectedServicePrice = (state) => state.search.selectedServicePrice;
export const selectSelectedDate = (state) => state.search.selectedDate;
export const selectSelectedTime = (state) => state.search.selectedTime;
export const selectSelectedDateObj = (state) => state.search.selectedDateObj;

export default searchSlice.reducer