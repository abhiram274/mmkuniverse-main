
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Sample />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/freelance" element={<FreelanceGigsHub />} />
          <Route path="/events" element={<Events />} />
          <Route path="/forum" element={<ForumBlogs />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/admin_events" element={<AdminEvents />} />
          <Route path="/admin_programs" element={<AdminPrograms />} />
          <Route path="/admin_login" element={<AdminLogin />} />

          <Route path="/manage_events" element={<ManageEvents />} />

          <Route path="/my_profile" element={<MyProfile />} />

          <Route path="/manage_programs" element={<ManagePrograms />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />


        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
