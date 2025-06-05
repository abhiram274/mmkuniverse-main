// src/pages/JoinEventPaymentForm.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Label } from "@radix-ui/react-label";
import { dataTagSymbol } from "@tanstack/react-query";

// Replace with your QR image
// Replace with your QR image

const JoinEventPaymentForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    eventId: "",
    eventName: "",
    transactionId: "",
    eventPrice: "",
  });
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const storedUserId = localStorage.getItem("MMK_U_user_id") || "";
    const storedName = localStorage.getItem("MMK_U_name") || "";
    const storedEmail = localStorage.getItem("MMK_U_email") || "";
    const storedEventId = localStorage.getItem("MMK_E_event_id") || "";
    const storedEventName = localStorage.getItem("MMK_E_event_name") || "";

    setFormData((prev) => ({
      ...prev,
      userId: storedUserId,
      name: storedName,
      email: storedEmail,
      eventId: storedEventId,
      eventName: storedEventName,
    }));
    

    if (storedEventId) {
      const id = storedEventId;
      fetch(`https://mmkuniverse-main.onrender.com/events/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if (data.qrcode) {
            setQrImageUrl(`https://mmkuniverse-main.onrender.com/uploads/${data.qrcode}`);
          }
          setFormData((prev) => ({
            ...prev,
            eventPrice: data.price || "", // fallback in case it's null
          }));

        })
        .catch((err) => {
          console.error("Failed to fetch event QR code:", err);
          toast.error("Unable to load event QR code");
        });
    }

  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };






  const handleSubmit = async () => {
    if (!formData.transactionId) {
      toast.error("Transaction ID is required.");
      return;
    }

    if (!paymentImage) {
      toast.error("Please upload a payment screenshot.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("userId", formData.userId);
       submissionData.append("name", formData.name);
          submissionData.append("email", formData.email);
    submissionData.append("transactionId", formData.transactionId);
    submissionData.append("paymentImage", paymentImage); // image file




    try {
      const res = await fetch(`https://mmkuniverse-main.onrender.com/payments/${formData.eventId}/verify-payment`, {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        // body: JSON.stringify({
        //   userId: formData.userId,
        //   transactionId: formData.transactionId,
        // }),

        body: submissionData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        navigate("/my_profile");
      } else {
        toast.error(data.error || "Failed to submit request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Duplicate entry");
    }
  };




  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white pt-20">
      <Navbar />

      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md bg-[#1b1b2f] rounded-2xl p-8 shadow-2xl border border-white/10">
          <h1 className="text-3xl font-bold text-center mb-6 text-white">
            Join Event Payment
          </h1>

          <div className="space-y-4">
            <div>
              <Label htmlFor="userId" className="text-white">User ID</Label>
              <Input
                id="userId"
                disabled
                value={formData.userId}
                name="userId"
                className="bg-[#2e2e48] text-white placeholder-white border border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                disabled
                value={formData.name}
                name="name"
                className="bg-[#2e2e48] text-white placeholder-white border border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                disabled
                value={formData.email}
                name="email"
                className="bg-[#2e2e48] text-white placeholder-white border border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="eventId" className="text-white">Event ID</Label>
              <Input
                id="eventId"
                disabled
                value={formData.eventId}
                name="eventId"
                className="bg-[#2e2e48] text-white placeholder-white border border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="eventName" className="text-white">Event Name</Label>
              <Input
                id="eventName"
                disabled
                value={formData.eventName}
                name="eventName"
                className="bg-[#2e2e48] text-white placeholder-white border border-white/20"
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
                  alt="Event QR Code"
                  className="w-60 h-60 mx-auto rounded-lg border border-white/20 shadow-lg"
                />
              ) : (
                <p className="text-center text-white/80">QR code loading...</p>
              )}

              <p className="text-sm text-white/80 mt-2">Scan the QR code to pay</p>
              <strong className=" text-white/80 mt-2">Price: {formData.eventPrice}</strong>

            </div>





            <div>
              <Label htmlFor="paymentImage" className="text-white">Upload Payment Screenshot</Label>
              <Input
                id="paymentImage"
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentImage(e.target.files?.[0] || null)}
                className="bg-[#2e2e48] text-white border border-white/30 file:bg-mmk-purple file:text-white file:rounded file:border-0"
              />
            </div>




            <div>
              <Label htmlFor="transactionId" className="text-white">Transaction ID</Label>
              <Input
                id="transactionId"
                placeholder="Enter Transaction ID"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                className="bg-[#2e2e48] text-white placeholder-white border border-white/30 focus:ring-2 focus:ring-mmk-purple"
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r   hover:opacity-90 text-white font-semibold py-2 rounded-lg
             w-full bg-mmk-purple hover:bg-mmk-purple/90 text-white py-6"
            >
              Submit Payment Request
            </Button>
          </div>
        </div>
      </div>
      <br />
      {/* className="w-full bg-mmk-purple hover:bg-mmk-purple/90 text-white py-6" */}
      {/* className="w-full bg-mmk-purple hover:bg-mmk-purple/90 text-white py-6" */}
      <Footer />
    </div>
  );
};

export default JoinEventPaymentForm;
