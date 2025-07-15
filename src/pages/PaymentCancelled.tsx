import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, XCircle, RotateCcw, HelpCircle } from "lucide-react";

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="p-4 lg:p-6">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-lg text-gray-600">Your order was not completed</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What happened?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              You cancelled the payment process before it was completed. Don't worry - no charges were made to your account.
            </p>
            
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Order ID (for reference)</p>
                <p className="font-mono text-sm">{orderId}</p>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <h3 className="font-medium">What you can do:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Go back and try the purchase again
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Browse other eSIM plans that might better suit your needs
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Contact our support team if you experienced any issues
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild size="lg" className="flex-1">
            <Link to="/data-products">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="flex-1">
            <Link to="/roambuddy-store">
              Browse All Plans
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link to="/contact">
              <HelpCircle className="w-4 h-4 mr-2" />
              Get Help
            </Link>
          </Button>
        </div>

        <div className="text-center mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Need assistance?</h3>
          <p className="text-blue-700 text-sm mb-4">
            Our wellness travel experts are available 24/7 to help you find the perfect connectivity solution for your journey.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;