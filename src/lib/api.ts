const API_BASE_URL = "https://banausic-kacey-easily.ngrok-free.dev";

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/docs`, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

export interface PredictionResult {
  filename: string;
  prediction: string;
  confidence: number;
  gradcam_image: string;
}

export async function predictDisease(imageFile: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Prediction failed: ${response.statusText}`);
  }

  return response.json();
}

export function getGradcamImageUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
