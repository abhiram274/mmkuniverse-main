
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



// Inside your Login component
const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
  if (!credentialResponse.credential) {
    toast.error("Google login failed");
    return;
  }

  try {
    const decoded: any = jwtDecode(credentialResponse.credential);
    const email = decoded.email;

    const res = await fetch("https://mmkuniverse-main.onrender.com/api/auth/google-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("MMK_U_token", data.token);
      localStorage.setItem("MMK_U_user_id", data.user_id);
      localStorage.setItem("MMK_U_name", data.name);
      localStorage.setItem("MMK_U_email", data.email);
      toast.success("Logged in with Google");
      navigate("/home");
    } else {
      toast.error(data.error || "Login failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};



  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      rememberMe: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("https://mmkuniverse-main.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("MMK_U_token", data.token);
        localStorage.setItem("MMK_U_user_id", data.user_id);
        localStorage.setItem("MMK_U_name", data.name);
        localStorage.setItem("MMK_U_email", data.email);

        toast.success("Logged in successfully");
        navigate("/home");
      } else {
        toast.error(data.error || data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    }
    finally {
      setIsLoading(false);
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
            <h2 className="mt-6 text-3xl font-bold">Welcome back</h2>
            <p className="mt-2 text-gray-400">Login to continue your journey</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={handleCheckboxChange}
                    className="border-white/30 data-[state=checked]:bg-mmk-purple data-[state=checked]:border-mmk-purple"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-400">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="text-mmk-purple hover:text-mmk-purple/80">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-mmk-purple hover:bg-mmk-purple/90 text-white py-6"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>


            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <span className="absolute left-0 w-full h-px bg-white/10" />
              <span className="bg-mmk-dark px-3 text-gray-400 relative z-10 text-sm">or</span>
            </div>



            {/* Sign in with Google button */}
            <div className="my-2 w-full flex justify-center">
  <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google login failed")} />
</div>







            <div className="text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-mmk-purple hover:text-mmk-purple/80">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image and branding */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-mmk-amber/80 to-mmk-deep-purple">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="max-w-md text-center">
            <h3 className="text-3xl font-bold text-white mb-6">Continue Your Growth Journey</h3>
            <p className="text-xl text-white/80 mb-8">
              Access your courses, connect with the community, and explore new opportunities for learning and growth.
            </p>
            <div className="glass-card p-6 rounded-xl border border-white/20">
              <h4 className="font-bold text-white text-xl mb-4">What's New in MMK Universe?</h4>
              <ul className="space-y-3 text-left">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mmk-amber mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">New courses on AI and Machine Learning</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mmk-amber mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">Improved community features and forums</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mmk-amber mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">Exciting freelance opportunities with top companies</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
