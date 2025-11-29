import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Check } from "lucide-react";
import { useRoamBuddyAPI } from "@/hooks/useRoamBuddyAPI";
import { toast } from "sonner";

export const SIMActivation = () => {
  const [iccid, setIccid] = useState("");
  const { activateEsim, loading } = useRoamBuddyAPI();

  const handleActivation = async () => {
    if (!iccid || iccid.length < 15) {
      toast.error("Please enter a valid ICCID number");
      return;
    }

    const result = await activateEsim(iccid);
    if (result?.success) {
      toast.success("eSIM activated successfully!");
      setIccid("");
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Already Have an eSIM?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Activate your RoamBuddy eSIM by entering your ICCID number below
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Visual Guide */}
            <Card className="bg-muted/30 border-border">
              <CardContent className="p-8">
                <h3 className="font-bold text-lg mb-4 text-center">
                  To Log in to Wi-Fi use these details
                </h3>
                <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl p-8 mb-4 text-center">
                  <div className="bg-white rounded-lg p-4 inline-block">
                    <div className="text-sm font-mono text-foreground">
                      SSID: WiFi_2.4G_XXX
                    </div>
                    <div className="text-sm font-mono text-foreground">
                      KEY: 23456789
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>WiFi Connection Info</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-border">
              <CardContent className="p-8">
                <h3 className="font-bold text-lg mb-4 text-center">
                  To register the device, type the ICCID number
                </h3>
                <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl p-8 mb-4 text-center relative">
                  <div className="bg-white rounded-lg p-4 inline-block">
                    <div className="text-xs text-muted-foreground mb-1">
                      Bluetooth MAC: E8:88:3D:20:4E:15
                    </div>
                    <div className="text-sm font-mono text-foreground bg-red-100 px-2 py-1 rounded border-2 border-red-500">
                      ICCID: 894310816100099999
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>ICCID Location on Device</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activation Form */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">SIM Activation</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Activation Code
                  </label>
                  <Input
                    type="text"
                    placeholder="ICCID    3253 4563 567 234 674"
                    value={iccid}
                    onChange={(e) => setIccid(e.target.value)}
                    className="text-lg py-6"
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter the 19-20 digit ICCID number found on your eSIM card or device settings
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={handleActivation}
                  disabled={loading || !iccid}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg"
                >
                  {loading ? "Activating..." : "Next"}
                </Button>
              </div>

              {/* Steps */}
              <div className="mt-8 space-y-3">
                <h4 className="font-semibold text-sm text-center mb-4">Activation Steps</h4>
                {[
                  "Enter your ICCID number above",
                  "Follow the on-screen instructions",
                  "Wait for activation confirmation (usually instant)",
                  "Restart your device and enjoy connectivity"
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sm text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
