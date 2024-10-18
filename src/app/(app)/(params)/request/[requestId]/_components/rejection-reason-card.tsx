import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface RejectionReasonCardProps {
  rejectionReason: string | null;
}

export default function RejectionReasonCard({
  rejectionReason,
}: RejectionReasonCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (rejectionReason) {
      setIsVisible(true);
    }
  }, [rejectionReason]);

  if (!rejectionReason) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-red-200/20 bg-red-50 dark:bg-red-900/20">
        <CardHeader className="p-3 pb-0">
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <h5 className="font-semibold text-red-700 dark:text-red-300">
              Rejection Reason
            </h5>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <p className="text-sm text-red-600 dark:text-red-200">
            {rejectionReason}
          </p>
          <div className="mt-4 flex justify-end">
            <Badge variant="destructive" className="text-xs">
              Request Rejected
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
