import { usePayPalCardFields } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface SubmitButtonProps {
  onSubmitting?: (isSubmitting: boolean) => void;
  disabled?: boolean;
  amount: string;
}

export const PayPalCardFieldsSubmitButton = ({ onSubmitting, disabled, amount }: SubmitButtonProps) => {
  const { cardFieldsForm } = usePayPalCardFields();
  const [isPaying, setIsPaying] = useState(false);

  const handleClick = async () => {
    if (!cardFieldsForm) {
      console.error("CardFields not initialized");
      return;
    }

    setIsPaying(true);
    onSubmitting?.(true);

    try {
      // This submits the card form and triggers createOrder/onApprove
      await cardFieldsForm.submit();
    } catch (error) {
      console.error("Card submission error:", error);
    } finally {
      setIsPaying(false);
      onSubmitting?.(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isPaying || !cardFieldsForm}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      size="lg"
    >
      {isPaying ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : (
        `Pay $${amount} Now`
      )}
    </Button>
  );
};
