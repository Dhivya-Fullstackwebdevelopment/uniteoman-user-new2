import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'
import { useSelector , useDispatch } from "react-redux";
import {
  setSelectedDate,
  setSelectedTime,
  setSelectedDateObj,
  selectSelectedDate,
  selectSelectedTime,
  selectSelectedDateObj,
} from "../store/slices/searchSlice";

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function BookingDateTimePickerPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Get URL parameters from BookingPage
  const professionalId = searchParams.get('professional_id') || 0
  const serviceId = searchParams.get('service_id') || '1'
  const locationId = searchParams.get('location_id') || '1'
  const serviceTypeId = searchParams.get('service_type_id') || ''
  const urlDate = searchParams.get('date') || ''
  const urlTime = searchParams.get('time') || ''
  const urlServiceName = searchParams.get('service_name') || ''
  const urlServicePrice = searchParams.get('service_price') || '0'
  const urlProName = searchParams.get('pro_name') || ''

  // States
  const [professional, setProfessional] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDateNum, setSelectedDateNum] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [selectedService, setSelectedService] = useState(null)
  const [availableDates, setAvailableDates] = useState([])
  const [availableTimes, setAvailableTimes] = useState([])
  const [serviceName, setServiceName] = useState(urlServiceName || '')
  const [servicePrice, setServicePrice] = useState(urlServicePrice || '0')
  const [availableProfessionals, setAvailableProfessionals] = useState([])
  const dispatch = useDispatch();

  const selectedDate = useSelector(selectSelectedDate);
  const selectedTime = useSelector(selectSelectedTime);
  const selectedDateObj = useSelector(selectSelectedDateObj);

  console.log("selectedDate", selectedDate);
  console.log("selectedTime", selectedTime);
  console.log("selectedDateObj", selectedDateObj);

  const parseDateFromUrl = (dateStr) => {
    if (!dateStr) return null
    // Date format: "Wed, 15 Jul 2026"
    // Extract the day number using regex
    const match = dateStr.match(/\d+/)
    if (match) {
      return match[0] // Returns "15"
    }
    return null
  }

  // Parse time from URL
  const parseTimeFromUrl = (timeStr) => {
    if (!timeStr) return null
    // Time format: "11:00 AM" or "11:00%20AM"
    return decodeURIComponent(timeStr)
  }

  // Generate next 7 days
  const generateDates = () => {
    const dates = []
    const today = new Date()
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        day: dayNames[date.getDay()],
        num: date.getDate().toString(),
        month: monthNames[date.getMonth()],
        year: date.getFullYear().toString(),
        full: date,
        active: i === 0
      })
    }
    return dates
  }

  // Generate available times (9 AM - 8 PM)
  const generateTimes = () => {
    const times = []
    for (let hour = 9; hour <= 20; hour++) {
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour
      times.push(`${displayHour}:00 ${ampm}`)
      if (hour !== 20) {
        times.push(`${displayHour}:30 ${ampm}`)
      }
    }
    return times
  }

  // Fetch professional data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // If professional_id is provided, fetch that specific professional
        if (professionalId) {
          const params = new URLSearchParams()
          params.append('location_id', locationId)
          params.append('service_id', serviceId)
          if (serviceTypeId) {
            params.append('service_type_id', serviceTypeId)
          }

          const response = await axios.get(
            `${API_ENDPOINTS.PROFESSIONAL_DETAIL(professionalId)}?${params.toString()}`
          )

          if (response.data && response.data.status === 'success') {
            const data = response.data.data
            setProfessional(data)

            // If service name/price not from URL, use from API
            if (!urlServiceName && data.services_offered && data.services_offered.length > 0) {
              const service = data.services_offered[0]
              setSelectedService(service)
              setServiceName(service.type_name || 'Service')
              setServicePrice(service.price || '0')
            } else if (urlServiceName) {
              // Find the service from API that matches the URL service name
              if (data.services_offered) {
                const matchedService = data.services_offered.find(
                  s => s.type_name === urlServiceName
                )
                if (matchedService) {
                  setSelectedService(matchedService)
                } else {
                  // If no match, use the first service
                  setSelectedService(data.services_offered[0])
                }
              }
            }
          }
        } else {
          // No professional_id - fetch available professionals for this service
          try {
            const proResponse = await axios.get(
              API_ENDPOINTS.PROFESSIONALS_BY_LOCATION_AND_SERVICE(locationId, serviceId)
            )
            if (proResponse.data && proResponse.data.status === 'success') {
              setAvailableProfessionals(proResponse.data.data || [])
              // Set service name from URL or first professional's service
              if (!urlServiceName && proResponse.data.data?.[0]?.services_offered?.[0]) {
                setServiceName(proResponse.data.data[0].services_offered[0].type_name || 'Service')
                setServicePrice(proResponse.data.data[0].services_offered[0].price || '0')
              }
            }
          } catch (error) {
            console.error("Error fetching professionals:", error)
          }
        }

        // Generate available dates (next 7 days)
        const dates = generateDates()
        setAvailableDates(dates)

        // Set selected date from URL or default to first
        const dateFromUrl = parseDateFromUrl(urlDate)
        console.log('Date from URL:', dateFromUrl, 'Available dates:', dates.map(d => d.num))

        let finalInitialDateObj = dates[0] || { day: '', num: '', month: '', year: '' };
        if (dateFromUrl && dates.some(d => d.num === dateFromUrl)) {
          setSelectedDateNum(dateFromUrl)
          const matchedDate = dates.find(d => d.num === dateFromUrl)
          if (matchedDate) finalInitialDateObj = matchedDate
        } else {
          setSelectedDateNum(dates[0]?.num || '')
        }

        // Automatically dispatch default / initial date settings to Redux store
        dispatch(setSelectedDate(finalInitialDateObj.num));
        dispatch(setSelectedDateObj(finalInitialDateObj));

        // Generate available times
        const times = generateTimes()
        setAvailableTimes(times)

        // Set selected time from URL or default to first
        const timeFromUrl = parseTimeFromUrl(urlTime)
        console.log('Time from URL:', timeFromUrl, 'Available times:', times)

        let finalInitialTime = times[0] || '';
        if (timeFromUrl && times.includes(timeFromUrl)) {
          setSelectedTimeSlot(timeFromUrl)
          finalInitialTime = timeFromUrl
        } else {
          setSelectedTimeSlot(times[0] || '')
        }

        // Automatically dispatch default / initial time settings to Redux store
        dispatch(setSelectedTime(finalInitialTime));
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [professionalId, locationId, serviceId, serviceTypeId, urlDate, urlTime, urlServiceName])

  const activeDateObj = availableDates.find(d => d.num === selectedDateNum) || availableDates[0] || { day: '', num: '', month: '', year: '' }

  const handleNextStepNavigation = () => {
    let finalProName = professional?.name || urlProName || 
      (availableProfessionals.length > 0 ? availableProfessionals[0]?.name : 'Professional');
    
    let finalProfessionalId = professionalId || '';
    
    navigate(`/BookingAddressPage?professional_id=${finalProfessionalId}&service_id=${serviceId}&location_id=${locationId}&service_type_id=${serviceTypeId}&date=${encodeURIComponent(activeDateObj.day)}, ${activeDateObj.num} ${activeDateObj.month} ${activeDateObj.year}&time=${encodeURIComponent(selectedTimeSlot)}&service_name=${encodeURIComponent(serviceName)}&service_price=${encodeURIComponent(servicePrice)}&pro_name=${encodeURIComponent(finalProName)}`)
  }

  // Loading shimmer
  if (loading) {
    return (
      <div style={{ background: '#F8F8FA', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px' }}>
          <div style={{ background: 'white', padding: '28px 56px', borderRadius: '16px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{
                height: '40px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: '8px',
                marginBottom: '12px'
              }} />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    )
  }

  // Get disabled times (e.g., past times)
  const getSlotStatus = (time) => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Parse time
    const [timeStr, ampm] = time.split(' ')
    const [hourStr, minuteStr] = timeStr.split(':')
    let hour = parseInt(hourStr)
    const minute = parseInt(minuteStr)

    if (ampm === 'PM' && hour !== 12) hour += 12
    if (ampm === 'AM' && hour === 12) hour = 0

    // Check if time is in the past (for today only)
    const isToday = activeDateObj?.num === new Date().getDate().toString()
    if (isToday) {
      if (hour < currentHour || (hour === currentHour && minute < currentMinute)) {
        return 'disabled'
      }
    }

    return 'available'
  }

  // If no professional and no available professionals
  if (!professional && availableProfessionals.length === 0 && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9090A0' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
        <div style={{ font: '400 16px/1.5 "DM Sans", sans-serif' }}>No professionals available for this service</div>
        <Link to="/business-list" style={{ color: '#D61CA8', textDecoration: 'none', marginTop: '12px', display: 'inline-block' }}>
          ← Back to services
        </Link>
      </div>
    )
  }

  return (
    <div className="page-root-wrapper" style={{ background: '#F8F8FA', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }}>

      <style>{`
        .outer-layout-box {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 56px;
          width: 100%;
          box-sizing: border-box;
        }
        .inner-content-card {
          background: white;
          padding: 28px 56px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,.04);
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
        }
        .date-strip-container {
          display: flex;
          gap: 9px;
          margin-bottom: 22px;
        }
        .time-slots-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 9px;
          margin-bottom: 18px;
        }

        @media (max-width: 1024px) {
          .outer-layout-box {
            padding: 0 24px;
          }
          .inner-content-card {
            padding: 24px;
            grid-template-columns: 1fr 300px;
            gap: 20px;
          }
          .time-slots-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .page-root-wrapper {
            padding: 16px 0;
          }
          .outer-layout-box {
            padding: 0 12px;
          }
          .inner-content-card {
            padding: 20px 14px;
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .stepper-label-text {
            display: none; 
          }
          .date-strip-container {
            overflow-x: auto;
            padding-bottom: 8px;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .date-strip-container::-webkit-scrollbar {
            display: none;
          }
          .date-strip-card {
            flex: 0 0 64px !important; 
          }
          .time-slots-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .summary-sticky-panel {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>

      <div className="outer-layout-box">
        <div className="inner-content-card">

          {/* LEFT INTERACTIVE DATE-TIME STEPPER SECTION */}
          <div style={{ minWidth: 0 }}>

            {/* Horizontal Checkout Step Timeline Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 11px "DM Sans", sans-serif', color: 'white' }}>1</div>
                  <span className="stepper-label-text" style={{ font: '700 10px/1 "DM Sans", sans-serif', color: '#D61CA8', textTransform: 'uppercase', letterSpacing: '.5px' }}>Date & Time</span>
                </div>
                <div style={{ flex: 1, height: '2px', background: '#E8E8EE', marginBottom: '13px', marginLeft: '8px', marginRight: '8px' }}></div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E8E8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 11px "DM Sans", sans-serif', color: '#9090A0' }}>2</div>
                  <span className="stepper-label-text" style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#C0C0CC', textTransform: 'uppercase', letterSpacing: '.5px' }}>Address</span>
                </div>
                <div style={{ flex: 1, height: '2px', background: '#E8E8EE', marginBottom: '13px', marginLeft: '8px', marginRight: '8px' }}></div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E8E8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 11px "DM Sans", sans-serif', color: '#9090A0' }}>3</div>
                  <span className="stepper-label-text" style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#C0C0CC', textTransform: 'uppercase', letterSpacing: '.5px' }}>Payment</span>
                </div>
              </div>
            </div>

            <div style={{ font: '700 16px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '14px' }}>Choose Date</div>

            {/* Horizontal Scroll Date Strip */}
            <div className="date-strip-container">
              {availableDates.map((date) => {
                const isSelected = selectedDateNum === date.num
                return (
                  <div
                    key={date.num}
                    className="date-strip-card"
                    onClick={() => {
                      setSelectedDateNum(date.num);
                      dispatch(setSelectedDate(date.num));
                      dispatch(setSelectedDateObj(date));
                    }}
                    style={{
                      flex: 1, padding: '12px 6px', borderRadius: '13px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease',
                      background: isSelected ? BRAND_GRADIENT : '#F8F8FA',
                      border: isSelected ? '1.5px solid transparent' : '1.5px solid #EBEBEF'
                    }}
                  >
                    <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: isSelected ? 'rgba(255,255,255,.7)' : '#9090A0', marginBottom: '5px' }}>{date.day}</div>
                    <div style={{ font: '800 16px/1 "DM Sans", sans-serif', color: isSelected ? 'white' : '#0A0A0F' }}>{date.num}</div>
                    <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: isSelected ? 'rgba(255,255,255,.6)' : '#9090A0', marginTop: '2px' }}>{date.month}</div>
                  </div>
                )
              })}
            </div>

            <div style={{ font: '700 16px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>Available Time Slots</div>

            {/* Fluid Time Grid */}
            <div className="time-slots-grid">
              {availableTimes.map((time) => {
                const status = getSlotStatus(time)
                const isDisabled = status === 'disabled'
                const isSelected = selectedTimeSlot === time && !isDisabled

                return (
                  <div
                    key={time}
                    onClick={() => {
                      if (isDisabled) return;
                      setSelectedTimeSlot(time);
                      dispatch(setSelectedTime(time));
                    }}
                    style={{
                      padding: '11px 4px', borderRadius: '11px', textAlign: 'center', transition: 'all 0.15s ease',
                      background: isDisabled ? '#F0F0F0' : isSelected ? BRAND_GRADIENT : '#F8F8FA',
                      border: isSelected ? '1.5px solid transparent' : '1.5px solid #EBEBEF',
                      font: isSelected ? '700 11px/1 "DM Sans", sans-serif' : '500 11px/1 "DM Sans", sans-serif',
                      color: isDisabled ? '#C0C0CC' : isSelected ? 'white' : '#0A0A0F',
                      cursor: isDisabled ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {time} {isDisabled && '•'}
                  </div>
                )
              })}
            </div>

            {/* AI Warning Context Strip */}
            <div style={{ background: 'rgba(75,110,245,.05)', border: '1px solid rgba(75,110,245,.2)', borderRadius: '11px', padding: '11px 14px', display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', lineHeight: 1 }}>ℹ️</span>
              <div style={{ font: '400 12px/1.5 "DM Sans", sans-serif', color: '#4B6EF5' }}>
                {serviceName || 'Service'} takes ~45 mins. {professional?.name?.split(' ')[0] || urlProName || (availableProfessionals.length > 0 ? availableProfessionals[0]?.name?.split(' ')[0] : 'Pro')} will arrive at <strong style={{ color: '#D61CA8' }}>{selectedTimeSlot}</strong> on <strong style={{ color: '#D61CA8' }}>{activeDateObj.day} {activeDateObj.num} {activeDateObj.month}</strong>.
              </div>
            </div>
          </div>

          {/* RIGHT FIXED SUMMARY PANEL SECTION */}
          <div style={{ minWidth: 0 }}>
            <div className="summary-sticky-panel" style={{ background: '#0A0A0F', borderRadius: '18px', padding: '20px', position: 'sticky', top: '20px' }}>
              <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: 'white', marginBottom: '3px' }}>Booking Summary</div>
              <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>
                {professional ? (professional?.name || urlProName || 'Professional') : 
                 (availableProfessionals.length > 0 ? `${availableProfessionals.filter(p => p.is_available_today).length || availableProfessionals.length} pros available` : 'Professional')}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Service</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {serviceName || 'Service'}
                </span>
              </div>

              {/* Show professional info only if specific pro is selected */}
              {professional && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                  <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Pro</span>
                  <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {professional?.name || urlProName || 'Professional'} ★{professional?.rating || '4.9'}
                  </span>
                </div>
              )}

              {/* Show availability count if no specific pro selected */}
              {!professional && availableProfessionals.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                  <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Available Pros</span>
                  <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#10B981', textAlign: 'right' }}>
                    {availableProfessionals.filter(p => p.is_available_today).length || availableProfessionals.length} available
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Date</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>
                  {activeDateObj.day}, {activeDateObj.num} {activeDateObj.month} {activeDateObj.year}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Time</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>{selectedTimeSlot}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Duration</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>~45 min</span>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,.08)', margin: '14px 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)' }}>Estimated Total</span>
                <span style={{ font: '800 18px/1 "DM Sans", sans-serif', color: '#D61CA8' }}>
                  OMR {servicePrice || '0'}.000
                </span>
              </div>

              <button
                onClick={handleNextStepNavigation}
                style={{ width: '100%', border: 'none', outline: 'none', padding: '13px', background: BRAND_GRADIENT, borderRadius: '12px', textAlign: 'center', font: '700 14px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', boxShadow: '0 4px 14px rgba(214,28,168,.35)' }}
              >
                Continue to Address →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}