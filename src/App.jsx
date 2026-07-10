import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/layout/Navbar'
import AdminNavbar from '@/components/layout/AdminNavbar'
import VendorNavbar from '@/components/layout/VendorNavbar'
import Footer from '@/components/layout/Footer'
import HomePage from '@/pages/HomePage'
import BusinessListPage from '@/pages/BusinessListPage'
import BusinessProfilePage from '@/pages/BusinessProfilePage'
import BookingPage from '@/pages/BookingPage'
import CategoriesPage from '@/pages/CategoriesPage'
import GovernoratesPage from '@/pages/GovernoratesPage'
import AdminPage from '@/pages/AdminPage'
import VendorAuthPage from '@/pages/VendorAuthPage'
import ListBusinessPage from '@/pages/ListBusinessPage'
import VendorDashboardPage from '@/pages/VendorDashboardPage'
import EditShopPage from '@/pages/EditShopPage'
import PricingPage from '@/pages/PricingPage'
import ContactPage from '@/pages/ContactPage'
import CustomerLoginPage from '@/pages/CustomerLoginPage'
import ProtectedCustomerRoute from '@/components/ProtectedCustomerRoute'
import ProfilePage from '@/pages/ProfilePage'
import AdvertisingPricing from '@/pages/AdvertisingPricing'
import PartnerProgram from '@/pages/PartnerProgram'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import TermsOfUse from '@/pages/TermsOfUse'
import SearchPage from '@/pages/SearchPage';
import AboutUs from '@/pages/AboutUs';
import BusinessSelection from '@/pages/BusinessSelection';
import BookingDateTimePickerPage from '@/pages/BookingDateTimePickerPage';
import BookingAddressPage from '@/pages/BookingAddressPage';
import BookingPaymentPage from '@/pages/BookingPaymentPage';
import BookingConfirmationPage from '@/pages/BookingConfirmationPage';
import MyBookingsPage from '@/pages/MyBookings';
import BookingLiveTrackingPage from '@/pages/BookingLiveTrackingPage';
import BookingReceiptPage from '@/pages/BookingReceiptPage';
import RateProviderPage from '@/pages/RateProviderPage';
import NotificationsPage from '@/pages/Notifications';
import AccountOverviewPage from './pages/AccountOverviewPage'
import Help from './pages/Help'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 2, retry: 1 }
  }
})

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function AdminLayout({ children }) {
  return (
    <>
      {/* <AdminNavbar /> */}
      <main className="">{children}</main>
    </>
  )
}

function VendorLayout({ children }) {
  return (
    <>
      <VendorNavbar />
      <main className="pt-16">{children}</main>
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster position="top-right" toastOptions={{
            style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' }
          }} />
          <Routes>
            {/* Public */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/businesses" element={<PublicLayout><BusinessListPage /></PublicLayout>} />
            <Route path="/business/:slug" element={<PublicLayout><BusinessProfilePage /></PublicLayout>} />
            <Route path="/BookingPage"
              element={
                //<ProtectedCustomerRoute>
                  <PublicLayout><BookingPage /></PublicLayout>
                //</ProtectedCustomerRoute>
              }
            /><Route path="/BookingDateTimePickerPage"
              element={
                // <ProtectedCustomerRoute>
                  <PublicLayout><BookingDateTimePickerPage /></PublicLayout>
                // </ProtectedCustomerRoute> 
              }
            />
            <Route path="/BusinessSelection"
              element={
                // <ProtectedCustomerRoute>
                  <PublicLayout><BusinessSelection /></PublicLayout>
                // </ProtectedCustomerRoute>
              }
            />
            <Route path="/BookingAddressPage"
              element={
                // <ProtectedCustomerRoute>
                  <PublicLayout><BookingAddressPage /></PublicLayout>
                // </ProtectedCustomerRoute>
              }
            />
            <Route path="/BookingPaymentPage"
              element={
                // <ProtectedCustomerRoute>
                  <PublicLayout><BookingPaymentPage /></PublicLayout>
                // </ProtectedCustomerRoute> 
              }
            />
            <Route path="/BookingConfirmationPage"
              element={
                // <ProtectedCustomerRoute>
                  <PublicLayout><BookingConfirmationPage /></PublicLayout>
                // </ProtectedCustomerRoute> 
              }
            />
            <Route path="/MyBookings"
              element={
                // <ProtectedCustomerRoute>
                  <PublicLayout><MyBookingsPage /></PublicLayout>
              //</ProtectedCustomerRoute> 
              }
            />
            <Route path="/Booking/LiveTracking"
              element={
                // <ProtectedCustomerRoute>
                  <PublicLayout><BookingLiveTrackingPage /></PublicLayout>
                // </ProtectedCustomerRoute>
              }
            />
            <Route path="/Booking/Receipt"
              element={
                // <ProtectedCustomerRoute>
                  <PublicLayout><BookingReceiptPage /></PublicLayout>
                // </ProtectedCustomerRoute>
              }
            />
            <Route path="/Booking/Rating"
              element={
                // <ProtectedCustomerRoute>
                  <PublicLayout><RateProviderPage /></PublicLayout>
                // </ProtectedCustomerRoute>
              }
            />
            <Route path="/Notifications" element={<PublicLayout><NotificationsPage /></PublicLayout>} />
            <Route path="/Settings" element={<PublicLayout><AccountOverviewPage /></PublicLayout>} /> F
            <Route path="/categories" element={<PublicLayout><CategoriesPage /></PublicLayout>} />
            <Route path="/governorates" element={<PublicLayout><GovernoratesPage /></PublicLayout>} />
            <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
            <Route path="/AdvertisingPricing" element={<PublicLayout><AdvertisingPricing /></PublicLayout>} />
            <Route path="/partner" element={<PublicLayout><PartnerProgram /></PublicLayout>} />
            <Route path="/privacypolicy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
            <Route path="/TermsOfUse" element={<PublicLayout><TermsOfUse /></PublicLayout>} />
            <Route path="/search" element={<PublicLayout><SearchPage /></PublicLayout>} />
            <Route path="/AboutUs" element={<PublicLayout><AboutUs /></PublicLayout>} />
            <Route path="/contact"
              element={
                // <ProtectedCustomerRoute>
                  <PublicLayout><ContactPage /></PublicLayout>
                //</ProtectedCustomerRoute>
              }
            />
             <Route path="/help"
              element={
                // <ProtectedCustomerRoute>
                  <PublicLayout><Help /></PublicLayout>
                //</ProtectedCustomerRoute>
              }
            />
            <Route path="/customer/login" element={<PublicLayout><CustomerLoginPage /></PublicLayout>} />
            <Route path="/customer/profile" element={<PublicLayout><ProfilePage /></PublicLayout>} />
            {/* Vendor — vendor navbar */}
            <Route path="/vendor/login" element={<PublicLayout><VendorAuthPage /></PublicLayout>} />
            <Route path="/vendor/dashboard/*" element={<VendorLayout><VendorDashboardPage /></VendorLayout>} />
            <Route path="/vendor/edit-shop/:id" element={<VendorLayout><EditShopPage /></VendorLayout>} />
            <Route path="/list-business" element={<PublicLayout><ListBusinessPage /></PublicLayout>} />

            {/* Admin — admin navbar */}
            <Route path="/admin/*" element={<AdminLayout><AdminPage /></AdminLayout>} />
            <Route path="/admin/login" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
