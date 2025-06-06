
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sample from "./pages/Sample";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Programs from "./pages/Programs";
import FreelanceGigsHub from "./pages/FreelanceGigsHub";
import Events from "./pages/Events";
import ForumBlogs from "./pages/ForumBlogs";
import Community from "./pages/Community";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import AdminEvents from "./pages/admin/admin_events";
import AdminPrograms from "./pages/admin/admin_programs";
import AdminLogin from "./pages/admin/admin_login";
import ManageEvents from "./pages/admin/manage_events";
import ManagePrograms from "./pages/admin/manage_programs";

import MyProfile from "./pages/Myprofile";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyPage from "./pages/verify";
import ManageEventPayments from "./pages/admin/manage_payment_requests";
import JoinEventPaymentForm from "./pages/JoinEventPaymentForm";

import ProtectedRoute from "./components/ProtectedRoute"; // Make sure path is correct
import UserProtectedRoute from "./components/UserProtectedRoute"; // 👈 Add this import
import JoinProgramPaymentForm from "./pages/JoinProgramPaymentForm";
import ManageProgramPayments from "./pages/admin/manage-program-payments";
import GuestJoinPaymentForm from "./pages/GuestJoinPaymentForm";
import GuestProgramJoinPaymentForm from "./pages/GuestProgramJoinPaymentForm";
import { AuthProvider } from "./context/AuthContext";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <AuthProvider> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Sample />} />



          {/* User protected routes */}
          <Route path="/home" element={
            <UserProtectedRoute>
              <Home />
            </UserProtectedRoute>
          } />



          <Route path="/admin_login" element={<AdminLogin />} />

          <Route path="/login" element={<Login />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/signup" element={<Signup />} />

          {/* Admin protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />


          <Route path="/programs" element={
            <UserProtectedRoute>
              <Programs />
            </UserProtectedRoute>
          } />
          <Route path="/freelance" element={
            <UserProtectedRoute>
              <FreelanceGigsHub />
            </UserProtectedRoute>
          } />
          <Route path="/events" element={
            <UserProtectedRoute>
              <Events />
            </UserProtectedRoute>
          } />
          <Route path="/community" element={
            <UserProtectedRoute>
              <Community />
            </UserProtectedRoute>
          } />
          <Route path="/my_profile" element={
            <UserProtectedRoute>
              <MyProfile />
            </UserProtectedRoute>
          } />



          <Route path="/forum" element={<ForumBlogs />} />

           
          <Route path="/guest-join-payment" element={<GuestJoinPaymentForm />} />

          <Route path="/guest-program-join-payment" element={<GuestProgramJoinPaymentForm />} />

          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />



          <Route path="/admin_events" element={
            <ProtectedRoute>
              <AdminEvents />
            </ProtectedRoute>
          } />
          <Route path="/manage_events" element={
            <ProtectedRoute>
              <ManageEvents />
            </ProtectedRoute>
          } />
          <Route path="/admin_programs" element={
            <ProtectedRoute>
              <AdminPrograms />
            </ProtectedRoute>
          } />
          <Route path="/manage_programs" element={
            <ProtectedRoute>
              <ManagePrograms />
            </ProtectedRoute>
          } />






          {/* <Route path="/payments/:id/verify" element={<VerifyPage />} /> */}

          <Route path="/manage_payment_events" element={
            <ProtectedRoute>
              <ManageEventPayments />
            </ProtectedRoute>

          } />


          <Route path="/join-event-payment" element={<JoinEventPaymentForm />} />

                    <Route path="/join-program-payment" element={<JoinProgramPaymentForm />} />

 <Route path="/manage_payment_programs" element={
            <ProtectedRoute>
              <ManageProgramPayments />
            </ProtectedRoute>

          } />




        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
