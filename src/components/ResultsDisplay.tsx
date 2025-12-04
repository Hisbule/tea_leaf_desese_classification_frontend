import { PredictionResult, getGradcamImageUrl } from "@/lib/api";
import { AlertTriangle, CheckCircle, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ResultsDisplayProps {
  result: PredictionResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const isHealthy = result.prediction.toLowerCase().includes("healthy");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(getGradcamImageUrl(result.gradcam_image), {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        const blob = await response.blob();
        setImageUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Failed to load GradCAM image:", error);
      }
    };

    fetchImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [result.gradcam_image]);

  return (
    <div className="w-full animate-fade-in space-y-6">
      {/* Prediction Card */}
      <div
        className={cn(
          "rounded-xl border p-6 transition-all",
          isHealthy
            ? "border-success/30 bg-success/5"
            : "border-accent/30 bg-accent/5"
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "rounded-full p-3",
              isHealthy ? "bg-success/10" : "bg-accent/10"
            )}
          >
            {isHealthy ? (
              <CheckCircle className="h-6 w-6 text-success" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-accent" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              Diagnosis Result
            </p>
            <h3 className="mt-1 text-2xl font-display font-semibold text-foreground">
              {result.prediction}
            </h3>
          </div>
        </div>
      </div>

      {/* GradCAM Visualization */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="font-medium text-foreground">
            AI Attention Map (Grad-CAM)
          </span>
        </div>
        <div className="p-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Grad-CAM visualization"
              className="w-full rounded-lg"
            />
          ) : (
            <div className="w-full h-64 bg-muted rounded-lg animate-pulse flex items-center justify-center">
              <span className="text-muted-foreground">Loading GradCAM...</span>
            </div>
          )}
          <p className="mt-3 text-sm text-muted-foreground text-center">
            Highlighted regions show where the AI focused to make its prediction
          </p>
        </div>
      </div>

      {/* File Info */}
      <div className="text-center text-sm text-muted-foreground">
        Analyzed file: <span className="font-medium">{result.filename}</span>
      </div>
    </div>
  );
}