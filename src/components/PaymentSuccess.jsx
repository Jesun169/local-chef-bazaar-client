import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const updatePayment = async () => {
      if (!orderId) return;
      try {
        await fetch(`https://local-chef-bazaar-server-black.vercel.app/orders/payment/${orderId}`, {
          method: "PATCH",
        });
        toast.success("Payment successful!");
        navigate("/dashboard/orders");
      } catch (err) {
        console.error(err);
        toast.error("Failed to update payment");
      }
    };

    updatePayment();
  }, [orderId, navigate]);

  return <div className="text-center py-20">Processing payment...</div>;
};

export default PaymentSuccess;
