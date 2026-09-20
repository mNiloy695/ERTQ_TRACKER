import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../../../lib/api/client";
import { Earthquake } from "../../../types/earthquake";
import { useFilterStore } from "../../../stores/useFilterStore";

export function useEarthquakesBbox() {
  const { minMagnitude, maxMagnitude, depthRange, bbox } = useFilterStore();

  return useQuery<Earthquake[]>({
    queryKey: ["earthquakes", bbox, minMagnitude, maxMagnitude, depthRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (bbox) params.append("bbox", bbox.join(","));
      if (minMagnitude > 0) params.append("min_magnitude", minMagnitude.toString());
      if (maxMagnitude < 10) params.append("max_magnitude", maxMagnitude.toString());
      if (depthRange[0] > 0) params.append("min_depth", depthRange[0].toString());
      if (depthRange[1] < 700) params.append("max_depth", depthRange[1].toString());
      params.append("limit", "250");

      const response = await fetchApi<Earthquake[]>(`/api/v1/earthquakes/?${params.toString()}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });
}
