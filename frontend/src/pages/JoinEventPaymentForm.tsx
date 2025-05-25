// src/pages/JoinEventPaymentForm.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
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
  });

  useEffect(() => {
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
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.transactionId) {
      toast.error("Transaction ID is required.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/payments/${formData.eventId}/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: formData.userId,
          transactionId: formData.transactionId,
        }),
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
      toast.error("Server error");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg mt-10">
      <h1 className="text-xl font-bold mb-4">Join Event Payment Form</h1>

      <div className="space-y-4">
        <Input disabled value={formData.userId} name="userId" />
        <Input disabled value={formData.name} name="name" />
        <Input disabled value={formData.email} name="email" />
        <Input disabled value={formData.eventId} name="eventId" />
        <Input disabled value={formData.eventName} name="eventName" />

        <div className="text-center">
          <img src="QR-AbhiramKosuru.jpg" alt="QR Code" className="w-40 h-40 mx-auto" />
        </div>

        <Input
          placeholder="Enter Transaction ID"
          name="transactionId"
          value={formData.transactionId}
          onChange={handleChange}
        />

        <Button className="w-full bg-green-600 text-white" onClick={handleSubmit}>
          Submit Payment Request
        </Button>
      </div>
    </div>
  );
};

export default JoinEventPaymentForm;
