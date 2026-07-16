import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedLocation: { id: '', name: '' },
  selectedService: { id: '', name: '' },
  selectedServiceType: { id: '', name: '', price: '', duration: '' },
  selectedProfessional: { id: '', name: '', rating: '' },
  selectedServicePrice: '',
  selectedDate: '',
  selectedTime: '',
  selectedDateObj: null, // Should hold serialized objects/strings only
  orderSummary: {
    serviceFee: 0,
    platformFee: 0,
    vat: 0,
    total: 0
  }
}

const calculateOrderSummary = (serviceFee) => {
  const platformFeeRate = 0.10
  const vatRate = 0.09
  
  const platformFee = serviceFee * platformFeeRate
  const vat = serviceFee * vatRate
  const total = serviceFee + platformFee + vat
  
  return {
    serviceFee: parseFloat(serviceFee.toFixed(3)),
    platformFee: parseFloat(platformFee.toFixed(3)),
    vat: parseFloat(vat.toFixed(3)),
    total: parseFloat(total.toFixed(3))
  }
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSelectedLocation: (state, action) => { state.selectedLocation = action.payload },
    setSelectedService: (state, action) => { state.selectedService = action.payload },
    setSelectedServiceType: (state, action) => {
      state.selectedServiceType = action.payload
      if (action.payload && action.payload.price) {
        const price = parseFloat(action.payload.price)
        state.selectedServicePrice = price
        state.orderSummary = calculateOrderSummary(price)
      }
    },
    setSelectedProfessional: (state, action) => { state.selectedProfessional = action.payload },
    setSelectedServicePrice: (state, action) => {
      state.selectedServicePrice = action.payload
      if (action.payload) {
        const price = parseFloat(action.payload)
        state.orderSummary = calculateOrderSummary(price)
      }
    },
    setSelectedDate: (state, action) => { state.selectedDate = action.payload },
    setSelectedTime: (state, action) => { state.selectedTime = action.payload },
    
    // FIX: Intercept payload and serialize if it's a native Date instance
    setSelectedDateObj: (state, action) => {
      if (action.payload && typeof action.payload === 'object') {
        if (action.payload instanceof Date) {
          state.selectedDateObj = { full: action.payload.toISOString() }
        } else if (action.payload.full instanceof Date) {
          state.selectedDateObj = { ...action.payload, full: action.payload.full.toISOString() }
        } else {
          state.selectedDateObj = action.payload
        }
      } else {
        state.selectedDateObj = action.payload
      }
    },
    
    updateOrderSummary: (state, action) => { state.orderSummary = action.payload },
    clearSelectedLocation: (state) => { state.selectedLocation = initialState.selectedLocation },
    clearSelectedService: (state) => { state.selectedService = initialState.selectedService },
    clearSelectedServiceType: (state) => {
      state.selectedServiceType = initialState.selectedServiceType
      state.orderSummary = initialState.orderSummary
    },
    clearSelectedProfessional: (state) => { state.selectedProfessional = initialState.selectedProfessional },
    clearSelectedServicePrice: (state) => {
      state.selectedServicePrice = ''
      state.orderSummary = initialState.orderSummary
    },
    clearSelectedDate: (state) => { state.selectedDate = '' },
    clearSelectedTime: (state) => { state.clearSelectedTime = '' },
    clearSelectedDateObj: (state) => { state.selectedDateObj = null },
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
  updateOrderSummary,
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
export const selectSelectedServicePrice = (state) => state.search.selectedServicePrice
export const selectSelectedDate = (state) => state.search.selectedDate
export const selectSelectedTime = (state) => state.search.selectedTime
export const selectSelectedDateObj = (state) => state.search.selectedDateObj
export const selectOrderSummary = (state) => state.search.orderSummary
export const selectServiceTypeId = (state) => state.search.selectedServiceType.id

export default searchSlice.reducer