import { motion } from "framer-motion";
import { ClipboardCheck, CheckCircle, Scissors, Truck, PackageCheck } from "lucide-react";

const steps = [
  { icon: ClipboardCheck, label: "Under Review", desc: "Your payment is being verified" },
  { icon: CheckCircle, label: "Approved", desc: "Payment confirmed, order accepted" },
  { icon: Scissors, label: "Stitching", desc: "Your outfit is being crafted" },
  { icon: Truck, label: "Shipped", desc: "On its way to you" },
  { icon: PackageCheck, label: "Delivered", desc: "Enjoy your new outfit!" },
];

interface OrderTrackingStepsProps {
  currentStep?: number;
  orderDate?: string;
  isDelivered?: boolean;
}

const OrderTrackingSteps = ({ currentStep = 0, orderDate, isDelivered = false }: OrderTrackingStepsProps) => {
  const estimatedDelivery = orderDate
    ? new Date(new Date(orderDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-PK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="w-full pl-6">
      {/* Steps */}
      <div className="relative flex flex-col gap-0">
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;
          const Icon = step.icon;
          // No animation on delivered step when order is delivered
          const shouldAnimate = isActive && !(isDelivered && i === 4);

          return (
            <div key={step.label} className="flex items-start gap-4 relative">
              {/* Vertical line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[23px] top-[48px] w-[2px] h-[calc(100%-8px)]">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 0.6, delay: i * 0.3 + 0.3 }}
                    className={`w-full ${isCompleted ? "bg-primary" : "bg-border"}`}
                  />
                </div>
              )}

              {/* Icon circle */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.25 }}
                className="relative z-10 flex-shrink-0"
              >
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                    isCompleted || (isDelivered && i === 4)
                      ? "bg-primary border-primary"
                      : isActive
                      ? "bg-primary/20 border-primary"
                      : "bg-card border-border"
                  }`}
                  animate={
                    shouldAnimate
                      ? {
                          boxShadow: [
                            "0 0 0px hsl(45 93% 47% / 0)",
                            "0 0 25px hsl(45 93% 47% / 0.5)",
                            "0 0 0px hsl(45 93% 47% / 0)",
                          ],
                        }
                      : {}
                  }
                  transition={shouldAnimate ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                >
                  <Icon
                    size={20}
                    className={
                      isCompleted || (isDelivered && i === 4)
                        ? "text-primary-foreground"
                        : isActive
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  />
                </motion.div>

                {/* Pulse ring for active (not on delivered) */}
                {shouldAnimate && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.25 + 0.15 }}
                className="pb-8 pt-1"
              >
                <p
                  className={`font-heading text-sm font-semibold ${
                    isCompleted || isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{step.desc}</p>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Estimated delivery */}
      {estimatedDelivery && !isDelivered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center"
        >
          <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">
            Estimated Delivery
          </p>
          <p className="font-heading text-lg font-bold text-gold-gradient">{estimatedDelivery}</p>
        </motion.div>
      )}

      {isDelivered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center"
        >
          <p className="font-heading text-lg font-bold text-green-400">✓ Order Delivered</p>
        </motion.div>
      )}
    </div>
  );
};

export default OrderTrackingSteps;
