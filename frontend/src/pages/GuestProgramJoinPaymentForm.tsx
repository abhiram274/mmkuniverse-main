// src/pages/GuestJoinPaymentForm.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Label } from "@radix-ui/react-label";

const GuestProgramJoinPaymentForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    guest_name: "",
    guest_email: "",
    programId: "",
    programName: "",
    transactionId: "",
    programPrice: "",
  });

  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const programId = urlParams.get("program_id") || "";
    const programName = urlParams.get("program_name") || "";

    setFormData((prev) => ({
      ...prev,
      programId,
      programName,
    }));

    if (programId) {
      const id = programId;
      fetch(`http://localhost:5000/programs/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if (data.qrcode) {
            setQrImageUrl(`http://localhost:5000/uploads/${data.qrcode}`);
          }

          setFormData((prev) => ({
            ...prev,
            programPrice: data.price || "", // fallback if null/undefined
          }));
        })
        .catch((err) => {
          console.error("Failed to fetch program QR code:", err);
          toast.error("Unable to load program QR code");
        });
    }



  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.guest_name || !formData.guest_email || !formData.transactionId) {
      toast.error("Please fill all fields.");
      return;
    }

    if (!paymentImage) {
      toast.error("Please upload a payment screenshot.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("guest_name", formData.guest_name);
    submissionData.append("guest_email", formData.guest_email);
    submissionData.append("program_id", formData.programId);
    submissionData.append("transaction_id", formData.transactionId);
    submissionData.append("paymentImage", paymentImage);

    try {
      const res = await fetch(
        `http://localhost:5000/program-payments/${formData.programId}/guest-verify-payment`,
        {
          method: "POST",
          body: submissionData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.error || "Failed to submit request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white pt-20">
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md bg-[#1b1b2f] rounded-2xl p-8 shadow-2xl border border-white/10">
          <h1 className="text-3xl font-bold text-center mb-6">Guest Payment</h1>

          <div className="space-y-4">
            <div>
              <Label htmlFor="guest_name" className="text-white">Name</Label>
              <Input
                id="guest_name"
                name="guest_name"
                placeholder="Your full name"
                value={formData.guest_name}
                onChange={handleChange}
                className="bg-[#2e2e48] text-white"
              />
            </div>

            <div>
              <Label htmlFor="guest_email" className="text-white">Email</Label>
              <Input
                id="guest_email"
                name="guest_email"
                placeholder="example@gmail.com"
                value={formData.guest_email}
                onChange={handleChange}
                className="bg-[#2e2e48] text-white"
              />
            </div>

            <div>
              <Label htmlFor="programId" className="text-white">Program ID</Label>
              <Input
                id="programId"
                disabled
                value={formData.programId}
                className="bg-[#2e2e48] text-white"
              />
            </div>

            <div>
              <Label htmlFor="programName" className="text-white">Program Name</Label>
              <Input
                id="programName"
                disabled
                value={formData.programName}
                className="bg-[#2e2e48] text-white"
              />
            </div>

            {/* <div className="text-center mt-4">
              <img
                src="/src/pages/QR-AbhiramKosuru.jpg"
                alt="QR Code"
                className="w-60 h-60 mx-auto rounded-lg border border-white/20 shadow-lg"
              />
              <p className="text-sm text-white/80 mt-2">Scan the QR code to pay</p>
            </div> */}


            <div className="text-center mt-4">
              {qrImageUrl ? (

                <img
                  src={qrImageUrl}
                  alt="Program QR Code"
                  className="w-60 h-60 mx-auto rounded-lg border border-white/20 shadow-lg"
                />
              ) : (
                <p className="text-center text-white/80">QR code loading...</p>
              )}

              <p className="text-sm text-white/80 mt-2">Scan the QR code to pay</p>
              <strong className="text-sm text-white/80 mt-2">Price: ₹{formData.programPrice}</strong>

            </div>



            <div>
              <Label htmlFor="paymentImage" className="text-white">Upload Payment Screenshot</Label>
              <Input
                id="paymentImage"
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentImage(e.target.files?.[0] || null)}
                className="bg-[#2e2e48] text-white border border-white/30 file:bg-mmk-purple file:text-white"
              />
            </div>

            <div>
              <Label htmlFor="transactionId" className="text-white">Transaction ID</Label>
              <Input
                id="transactionId"
                name="transactionId"
                placeholder="Enter Transaction ID"
                value={formData.transactionId}
                onChange={handleChange}
                className="bg-[#2e2e48] text-white"
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-mmk-purple hover:bg-mmk-purple/90 text-white py-6"
            >
              Submit Guest Payment
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GuestProgramJoinPaymentForm;
