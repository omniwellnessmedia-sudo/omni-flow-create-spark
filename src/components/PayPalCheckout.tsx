// Phase 7: PayPal Checkout Component
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PAYPAL_OPTIONS_ZAR } from "@/config/paypal";
import { Loader2 } from "lucide-react";

// The app root loads the PayPal SDK in USD (for the RoamBuddy/eSIM store), but the
// main store bills in ZAR. Loading the SDK in one currency and creating an order in
// another makes PayPal reject the order, so the store checkout gets its own ZAR
// script context (with a distinct data-namespace so the two SDK instances don't
// collide on the same page).
const PayPalCheckoutInner = () => {
  const { items, totalZAR, totalWellCoins, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalZAR.toFixed(2),
            currency_code: "ZAR",
            breakdown: {
              item_total: {
                value: totalZAR.toFixed(2),
                currency_code: "ZAR",
              },
            },
          },
          description: `Omni Wellness - ${items.length} item${items.length > 1 ? 's' : ''}`,
          items: items.map((item) => ({
            name: item.title.substring(0, 127), // PayPal limit
            quantity: item.quantity.toString(),
            unit_amount: {
              value: item.price_zar.toFixed(2),
              currency_code: "ZAR",
            },
            category: "PHYSICAL_GOODS",
          })),
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
        brand_name: "Omni Wellness Media",
        user_action: "PAY_NOW",
      },
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      // Event tickets: reserve seats BEFORE capturing payment, so a buyer is never
      // charged for a session that just sold out. reserve_screening_seats is atomic
      // and refuses while the event is still draft. If any reservation fails we
      // simply don't capture — the PayPal authorization lapses, no charge.
      const seatsBySession = new Map<string, number>();
      for (const item of items) {
        if (item.item_type === "event_ticket" && item.event_session_id) {
          const seats = (item.seats_per_unit ?? 1) * item.quantity;
          seatsBySession.set(
            item.event_session_id,
            (seatsBySession.get(item.event_session_id) ?? 0) + seats
          );
        }
      }
      for (const [sessionId, seats] of seatsBySession) {
        const { data: reserved, error: reserveError } = await (supabase as any).rpc(
          "reserve_screening_seats",
          { p_session_id: sessionId, p_seats: seats }
        );
        if (reserveError || !reserved) {
          toast({
            title: "Session sold out",
            description:
              "Those seats were taken while you were checking out. You have not been charged — please pick another session.",
            variant: "destructive",
          });
          return;
        }
      }

      const order = await actions.order.capture();
      
      console.log("PayPal Order Captured:", order);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Save order to Supabase (using any to bypass type checking for new fields)
      const { data: orderData, error } = await supabase
        .from("orders")
        .insert({
          // orders RLS requires auth.uid() = user_id OR auth.uid() IS NULL.
          // Without this, a logged-in buyer's insert is rejected AFTER PayPal has
          // captured payment — charged, but no order saved. user?.id for members,
          // null for guests (both satisfy the policy).
          user_id: user?.id ?? null,
          customer_email: order.payer.email_address,
          customer_name: `${order.payer.name.given_name} ${order.payer.name.surname}`,
          amount: totalZAR,
          currency: "ZAR",
          status: "paid",
          order_number: `OMW-${Date.now()}`,
          product_id: items[0]?.id || "multi",
          product_name: items.length === 1 ? items[0].title : "Multiple Items",
          product_type: "service",
        } as any)
        .select()
        .single();

      if (error) {
        console.error("Error saving order:", error);
        toast({
          title: "Payment successful, but...",
          description: "There was an issue saving your order. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      // Track affiliate commission if click tracking exists
      const clickId = sessionStorage.getItem('affiliate_click_id');
      if (clickId && orderData?.id) {
        try {
          const { error: commissionError } = await supabase.functions.invoke('record-affiliate-commission', {
            body: {
              orderId: orderData.id,
              clickId: clickId,
              orderAmount: totalZAR,
              currency: 'ZAR'
            }
          });

          if (commissionError) {
            console.error('Failed to record affiliate commission:', commissionError);
          } else {
            console.log('Affiliate commission recorded successfully');
          }
          
          // Clear click tracking after commission recorded
          sessionStorage.removeItem('affiliate_click_id');
          sessionStorage.removeItem('affiliate_program_id');
        } catch (error) {
          console.error('Error recording affiliate commission:', error);
          // Don't block order completion on commission tracking failure
        }
      }

      // Save individual order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_name: item.title,
        quantity: item.quantity,
        price_zar: item.price_zar,
      }));

      await supabase.from("order_items").insert(orderItems);

      // Campaign analytics: ticket purchases are the stunningpigs conversion event
      if (seatsBySession.size > 0) {
        const w = window as any;
        const ticketItems = items.filter((i) => i.item_type === "event_ticket");
        w.gtag?.("event", "purchase_ticket", {
          campaign: "stunningpigs",
          value: ticketItems.reduce((s, i) => s + i.price_zar * i.quantity, 0),
          currency: "ZAR",
          ticket_types: ticketItems.map((i) => i.id).join(","),
        });
        w.tagClarityEvent?.("purchase_ticket", "stunningpigs");
      }

      // Success!
      toast({
        title: "Payment Successful! 🎉",
        description: "Your order has been confirmed. Check your email for details.",
      });

      // Clear cart
      clearCart();

      // Redirect to confirmation
      navigate(`/order-confirmation/${orderData.id}`);
    } catch (err) {
      console.error("Error processing payment:", err);
      toast({
        title: "Payment Error",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onError = (err: any) => {
    console.error("PayPal Error:", err);
    toast({
      title: "Payment Error",
      description: "There was an issue with PayPal. Please try again.",
      variant: "destructive",
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
        }}
        forceReRender={[items, totalZAR]}
      />
    </div>
  );
};

// Public component: provides the ZAR PayPal SDK context around the checkout so the
// SDK currency matches the ZAR orders created above.
export const PayPalCheckout = () => (
  <PayPalScriptProvider options={{ ...PAYPAL_OPTIONS_ZAR, dataNamespace: "paypal_zar" }}>
    <PayPalCheckoutInner />
  </PayPalScriptProvider>
);
