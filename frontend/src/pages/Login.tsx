
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
type GoogleJwtPayload = {
  email: string;
  name: string;
  sub: string;
  picture?: string;
};
 const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
  if (!credentialResponse.credential) {
    toast.error("Google credential missing");
    return;
  }

  const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
  const email = decoded.email;

  try {
    const response = await fetch("https://mmkuniverse-main.onrender.com/api/auth/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("MMK_U_token", data.token);
      localStorage.setItem("MMK_U_user_id", data.user_id);
      localStorage.setItem("MMK_U_name", data.name);
      localStorage.setItem("MMK_U_email", data.email);

      toast.success("Logged in with Google!");
      navigate("/home");
    } else {
      toast.error(data.error || "Google login failed.");
    }
  } catch (err) {
    console.error(err);
    toast.error("Google login error.");
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
            {/* <div className="my-2 w-full relative">
              <Button
                type="button"
                className="
                  w-full flex items-center justify-center gap-2
                  border border-gray-200 shadow-none
                  bg-white text-gray-900 text-lg font-semibold px-4 py-3 rounded-lg
                  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-mmk-amber/40
                  transition duration-150
                "
                disabled
                aria-label="Sign in with Google"
                tabIndex={0}
              >
                {/* Google icon as before */}
                {/* <svg width={24} height={24} viewBox="0 0 48 48" className="mr-2" style={{ display: 'inline' }}>
                  <g>
                    <path fill="#4285F4" d="M24 9.5c3.54 0 6.13 1.53 7.54 2.81l5.51-5.51C34.42 3.81 29.68 1.5 24 1.5 14.82 1.5 6.95 6.92 3.05 14.08l6.73 5.23C11.65 13.84 17.32 9.5 24 9.5z"></path>
                    <path fill="#34A853" d="M46.53 24.57c0-1.94-.17-3.8-.48-5.57H24v7.5h12.74c-.25 1.36-.96 3.16-2.7 4.45l6.69 5.19c3.16-2.81 4.8-6.95 4.8-11.57z"></path>
                    <path fill="#FBBC05" d="M9.78 28.81A14.46 14.46 0 019.5 24c0-1.64.28-3.22.76-4.81l-6.73-5.23A22.45 22.45 0 012.5 24c0 3.64.88 7.08 2.53 10.04l6.75-5.23z"></path>
                    <path fill="#EA4335" d="M24 46.5c6.52 0 12-2.15 16.01-5.86l-6.75-5.23c-2.09 1.53-4.93 2.49-9.26 2.49-7.14 0-13.23-4.58-15.4-10.8l-6.75 5.23C6.95 41.07 14.82 46.5 24 46.5z"></path>
                    <path fill="none" d="M2.5 2.5h43v43h-43z"></path>
                  </g>
                </svg>
                <span>Sign in with Google</span>
              </Button>
           
            </div>  */}


  <div className="flex justify-center w-full">
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => toast.error("Google Sign-In Failed")}
    theme="outline"
    size="large"
    shape="rectangular"
    text="signin_with"
  />
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
