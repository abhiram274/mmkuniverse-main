import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyPage() {
  const { id: eventIdFromUrl } = useParams(); // fallback for event ID from route
  const [transactionId, setTransactionId] = useState("");
  const [userId, setUserId] = useState("");
  const [eventId, setEventId] = useState("");
  const [eventName, setEventName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("MMK_U_user_id");
    const storedEventId = localStorage.getItem("MMK_E_event_id") || eventIdFromUrl || "";
    const storedEventName = localStorage.getItem("MMK_E_event_name") || "";

    if (storedUserId) setUserId(storedUserId);
    if (storedEventId) setEventId(storedEventId);
    if (storedEventName) setEventName(storedEventName);
  }, [eventIdFromUrl]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValidTxn = /^[A-Z0-9]{12}$/.test(transactionId);

    if (!eventId || !userId || !isValidTxn) {
      toast.error("Invalid or missing data.");
      return;
    }

    try {
      const res = await fetch(`https://mmkuniverse-main.onrender.com/payments/${eventId}/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, transactionId }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Verification successful!");
        localStorage.removeItem("MMK_E_event_id");
        localStorage.removeItem("MMK_E_event_name");
        navigate("/my_profile");
      } else {
        toast.error(data.error || "Verification failed.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Verify Payment for: {eventName}</h1>
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
          placeholder="Transaction ID (12 characters)"
          className="w-full border p-2 rounded"
          maxLength={12}
        />
        <button type="submit" className="bg-mmk-purple text-white px-4 py-2 rounded w-full">
          verify payment approval
        </button>
      </form>
    </div>
  );
}
