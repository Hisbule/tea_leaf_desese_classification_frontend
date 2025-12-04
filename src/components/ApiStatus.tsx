import { useEffect, useState } from "react";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkApiHealth } from "@/lib/api";

export function ApiStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking");

  const checkConnection = async () => {
    setStatus("checking");
    const isConnected = await checkApiHealth();
    setStatus(isConnected ? "connected" : "disconnected");
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={checkConnection}
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
        status === "connected" && "bg-success/10 text-success",
        status === "disconnected" && "bg-destructive/10 text-destructive",
        status === "checking" && "bg-muted text-muted-foreground"
      )}
    >
      {status === "checking" && <Loader2 className="h-3 w-3 animate-spin" />}
      {status === "connected" && <Wifi className="h-3 w-3" />}
      {status === "disconnected" && <WifiOff className="h-3 w-3" />}
      <span>
        {status === "checking" && "Checking..."}
        {status === "connected" && "API Connected"}
        {status === "disconnected" && "API Offline"}
      </span>
    </button>
  );
}
