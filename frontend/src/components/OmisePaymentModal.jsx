import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom"


const OmisePaymentModal = ({ show, onClose, amount, appointmentId, jwtToken, backendUrl, onPaymentSuccess }) => {
  useEffect(() => {
    if (show) {
      setupOmiseCard();
    }
  }, [show]);

  const setupOmiseCard = () => {
    if (!window.OmiseCard) return toast.error("Omise SDK not loaded!");

    const OmiseCard = window.OmiseCard;
    OmiseCard.configure({
      publicKey: "pkey_test_65oeytphzbg3udzzws1",
      frameLabel: "HKCare Payment",
      submitLabel: "Pay now",
      currency: "thb",
      location: "no"
    });
  };

  const navigate = useNavigate()
  const openOmise = async () => {
    const OmiseCard = window.OmiseCard;
    OmiseCard.open({
      amount: amount * 100, // convert Baht → Satang
      onCreateTokenSuccess: async (token) => {
        try {
        
        //create the charge on backend
          const { data: chargeData } = await axios.post(`${backendUrl}/api/user/payment-omise`, { appointmentId, token }, { headers: { token: jwtToken } } );

            if (!chargeData.success) {     
                toast.error("Payment Failed: " + chargeData.message)
                return;
            }

            const chargeId = chargeData.chargeId
            
            if (!chargeId) {
                toast.error("Charge creation failed, no chargeId returned!");
                return;
            }

            //verify payment using chargeId
            const { data: verifyData } = await axios.post(backendUrl + '/api/user/verify-payment', { chargeId }, { headers: { token: jwtToken } })
            
            if (verifyData.success) {
                toast.success("Payment successful! Appointment confirmed.");

                //call a callback from parent component to refresh appointments
                if (typeof onPaymentSuccess === "function") {
                    onPaymentSuccess(); // refresh MyAppointment list
                }

                navigate('/my-appointment')

                onClose(); // close modal
            } else {
                toast.error("Payment verification failed: " + verifyData.message);
            }

        } catch (err) {
            console.error(err);
            toast.error("Error: " + err.message);
        }
      },
      onFormClosed: () => {
        console.log("Payment form closed");
      }
    });
  };

  if (!show) return null;

   return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-cyan-400/30 via-white/60 to-cyan-100/50 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 15 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] sm:w-[400px] text-center relative"
        >
          {/* Decorative icon */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white p-3 rounded-full shadow-md">
            <HeartPulse className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-semibold text-cyan-600 mt-4">
            Confirm Payment
          </h2>

          <p className="text-gray-600 mt-3 mb-6">
            Please confirm your payment of{" "}
            <span className="text-cyan-600 font-bold">{amount} THB</span>
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={openOmise}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-xl shadow-md transition-all"
            >
              Pay with Card
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-xl shadow-md transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OmisePaymentModal;
