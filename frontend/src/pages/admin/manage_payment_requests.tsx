// ManageEventPayments.tsx

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Dashboard from "../Dashboard";

interface PaymentRequest {
  id: number;
  user_id: number;
  event_id: number;
  transaction_id: string;
  status: "pending" | "approved" | "rejected";
  event_title: string;
  payment_image_path: string;
  submission_type:string;
}

const ManageEventPayments = () => {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/payments/payment-requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch payment requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId: number, action: "approve" | "reject") => {
    try {
      const res = await fetch(`http://localhost:5000/payments/payment-requests/${requestId}/${action}`, {
        method: "POST",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchRequests(); // Refresh list
        setSelectedImage(null);
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-900 text-white overflow-auto">
        <Dashboard />
      </div>

      <main className="flex-1 overflow-auto p-8 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold mb-6">Admin - Manage Event Payments</h1>

        <div className="overflow-auto border border-white/10 rounded">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2">User ID</th>
                    <th className="px-4 py-2">User Type</th>
                <th className="px-4 py-2">Event</th>
                <th className="px-4 py-2">Event ID</th>
                <th className="px-4 py-2">Image</th>

                <th className="px-4 py-2">Transaction ID</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t border-white/10">
                  <td className="px-4 py-2">{req.user_id}</td>
                                    <td className="px-4 py-2">{req.submission_type}</td>

                  <td className="px-4 py-2">{req.event_title}</td>
                  <td className="px-4 py-2">{req.event_id}</td>
                

                  <td className="px-4 py-2">
                    {req.payment_image_path && (
                      <Button
                        variant="outline"
                        className="text-xs px-2 py-1"
                        onClick={() => setSelectedImage(`http://localhost:5000/uploads/${req.payment_image_path}`)}
                      >
                        👁️ View
                      </Button>
                    )}
                  </td>

  <td className="px-4 py-2">{req.transaction_id}</td>


                  <td className="px-4 py-2 capitalize">{req.status}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      {req.status === "pending" ? (
                        <>
                          <Button
                            className="bg-green-600 text-xs px-3 py-1"
                            onClick={() => handleAction(req.id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            className="bg-red-600 text-xs px-3 py-1"
                            onClick={() => handleAction(req.id, "reject")}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span className="text-gray-400 italic">Handled</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    No payment requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>




        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="relative bg-white p-4 rounded-lg max-w-md w-full">
              <button
                className="absolute top-2 right-2 text-black text-lg font-bold"
                onClick={() => setSelectedImage(null)}
              >
                ✖
              </button>
              <img src={selectedImage} alt="Payment Proof" className="w-full rounded" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageEventPayments;