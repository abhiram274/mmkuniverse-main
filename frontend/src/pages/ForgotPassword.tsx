import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState<"send" | "verify">("send");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);






    const sendOtp = async () => {
        setStatus("loading");
        setErrorMessage("");
        try {
            const res = await fetch("http://localhost:5000/api/auth/forgot-password/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setStep("verify");
                setStatus("idle");
                toast.success("OTP sent successfully");
            } else {
                setStatus("error");
                setErrorMessage(data.error || "Failed to send OTP");
                toast.error("Failed to send OTP");
            }
        } catch (err) {
            setStatus("error");
            setErrorMessage("Network error");
            toast.error("Error");
        }
    };

    const resetPassword = async () => {
        setStatus("loading");
        setErrorMessage("");
        try {
            const res = await fetch("http://localhost:5000/api/auth/forgot-password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus("success");
                toast("Password reset successfully");
            } else {
                setStatus("error");
                setErrorMessage(data.error || "Failed to reset password");
                toast("Failed to reset password");
            }
        } catch (err) {
            setStatus("error");
            setErrorMessage("Network error");
            toast("Network error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full space-y-6 bg-mmk-dark/60 p-8 rounded-xl shadow-lg border border-white/10">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
                    <p className="text-gray-400 mt-2">
                        {step === "send"
                            ? "Enter your email to receive an OTP"
                            : "Enter the OTP and new password"}
                    </p>
                </div>

                {status === "error" && (
                    <p className="text-sm text-red-500">{errorMessage}</p>
                )}

                {status === "success" && (
                    <p className="text-sm text-green-500">Password reset successful!</p>
                )}

                {step === "send" ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendOtp();
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={status === "loading"} className="w-full">
                            {status === "loading" ? "Sending..." : "Send OTP"}
                        </Button>
                    </form>
                ) : (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            resetPassword();
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <Label htmlFor="otp">OTP</Label>
                            <Input
                                id="otp"
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <div
                                className="absolute right-3 top-9 cursor-pointer text-white"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>

                        </div>


                        <Button type="submit" disabled={status === "loading"} className="w-full">
                            {status === "loading" ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                )}

                <div className="text-center text-sm text-gray-400">
                    <Link to="/login" className="text-mmk-purple hover:text-mmk-purple/80">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
