import { useState } from "react";
import { Leaf, Sparkles } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ApiStatus } from "@/components/ApiStatus";
import { predictDisease, PredictionResult } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const handleImageSelect = async (file: File) => {
    setIsLoading(true);
    setResult(null);

    try {
      const prediction = await predictDisease(file);
      setResult(prediction);
      toast({
        title: "Analysis Complete",
        description: `Detected: ${prediction.prediction}`,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not connect to the analysis server. Please ensure the API is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-display font-semibold text-foreground">
                  TeaGuard
                </h1>
                <p className="text-xs text-muted-foreground">
                   Disease Classification
                </p>
              </div>
            </div>
            <ApiStatus />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-2xl">
          {/* Hero Section */}
          <div className="mb-8 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Ensemble Deep Learning
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Tea Leaf Disease Classifier
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upload an image of your tea leaf and our AI will analyze it for
              potential diseases using advanced Grad-CAM visualization.
            </p>
          </div>

          {/* Upload / Results */}
          {!result ? (
            <ImageUploader
              onImageSelect={handleImageSelect}
              isLoading={isLoading}
            />
          ) : (
            <div className="space-y-6">
              <ResultsDisplay result={result} />
              <button
                onClick={handleNewAnalysis}
                className="w-full rounded-lg border border-border bg-card px-6 py-3 font-medium text-foreground transition-colors hover:bg-muted"
              >
                Analyze Another Leaf
              </button>
            </div>
          )}

          {/* Info Cards */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "5 Models",
                desc: "Ensemble of YOLO, ResNet, EfficientNet, RegNet & MobileNet",
              },
              {
                title: "Grad-CAM",
                desc: "Visual explanations showing AI focus areas",
              },
              {
                title: "Fast Analysis",
                desc: "Get results in seconds with high accuracy",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-4 text-center"
              >
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Tea Leaf Disease Classification System</p>
          <p className="mt-1">Powered by Deep Learning Ensemble Models</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
