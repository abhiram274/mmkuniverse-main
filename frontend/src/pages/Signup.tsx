
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    otp: ""
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://mmkuniverse-main.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          otp: formData.otp
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("MMK_U_token", data.token);
        localStorage.setItem("MMK_U_user_id", data.user_id);
        localStorage.setItem("MMK_U_name", data.name);
        localStorage.setItem("MMK_U_email", data.email);

        toast.success("successfully signed up.");

        navigate("/home");
      } else {
        toast(data.message || data.error || "Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold text-gradient-primary">MMK Universe</h1>
            </Link>
            <h2 className="mt-6 text-3xl font-bold">Create your account</h2>
            <p className="mt-2 text-gray-400">Join our community of knowledge seekers</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="bg-mmk-dark/60 border-white/10 focus:border-mmk-purple"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>




              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  className="bg-mmk-dark/60 border-white/10 focus:border-mmk-purple"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-mmk-dark/60 border-white/10 focus:border-mmk-purple"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />


              </div>



              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="bg-mmk-dark/60 border-white/10 focus:border-mmk-purple"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />

                <div
                  className="absolute right-3 top-9 cursor-pointer text-white"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>

              </div>




              <div className="relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="bg-mmk-dark/60 eye border-white/10 focus:border-mmk-purple"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <div
                  className="absolute right-3 top-9 cursor-pointer text-white"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
                <Button
                  type="button"
                  className="mt-2 bg-mmk-purple/70"
                  disabled={isSendingOtp}
                  onClick={async () => {
                    setIsSendingOtp(true);
                    try {
                      const res = await fetch("https://mmkuniverse-main.onrender.com/api/auth/send-otp", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: formData.email }),
                      });

                      const data = await res.json();

                      if (res.ok) toast("OTP sent");
                      else toast(data.error);
                    } catch (err) {
                      console.error(err);
                      toast("Failed to send OTP");
                    } finally {
                      setIsSendingOtp(false);
                    }
                  }}
                >
                  {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                </Button>

              </div>













              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="bg-mmk-dark/60 border-white/10 focus:border-mmk-purple"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="123456"
                />
              </div>

            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-mmk-purple hover:bg-mmk-purple/90 text-white py-6"
              >
                Create Account
              </Button>
            </div>

            <div className="text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-mmk-purple hover:text-mmk-purple/80">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image and branding */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-mmk-purple/90 to-mmk-deep-purple">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="max-w-md text-center">
            <h3 className="text-3xl font-bold text-white mb-6">Welcome to MMK Universe</h3>
            <p className="text-xl text-white/80 mb-8">
              Join our community of students and professionals to learn, share knowledge, and grow together.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-bold text-white">Expert-led Programs</h4>
                <p className="text-white/80 text-sm">Learn from industry professionals</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-bold text-white">Community Support</h4>
                <p className="text-white/80 text-sm">Connect with like-minded peers</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-bold text-white">Earn Certifications</h4>
                <p className="text-white/80 text-sm">Validate your skills and knowledge</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-bold text-white">Freelance Opportunities</h4>
                <p className="text-white/80 text-sm">Work on real projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
