import { apiClient } from "@/app/lib/apiClient";
import { MLPrediction, MLPredictionResponse } from "@/app/types/explore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Send an image to the backend ML prediction endpoint and receive
 * a list of species predictions with confidence scores and taxon IDs.
 *
 * Returns an empty array if the ML service is unavailable (graceful degradation).
 */
export async function predictSpecies(imageFile: File): Promise<MLPrediction[]> {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await apiClient.postForm<MLPredictionResponse>(
      `${API_BASE}/api/v1/ml/predict`,
      formData,
    );

    return response.predictions ?? [];
  } catch (error) {
    console.warn("ML prediction failed (service may be unavailable):", error);
    return [];
  }
}
