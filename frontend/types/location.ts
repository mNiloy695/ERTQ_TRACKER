export interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  administrative_area?: string;
  latitude: number;
  longitude: number;
  elevation_m?: number;
  vs30_m_s: number;
  country?: Country;
}

export interface LocationProfile extends Location {
  seismic_zone?: string;
  pga_475yr?: number;
  pga_2475yr?: number;
}

export interface MagnitudeDistributionBin {
  magnitude_bin: string;
  count: number;
}

export interface SeismicityStats {
  total_earthquakes: number;
  max_magnitude?: number;
  avg_depth_km?: number;
  magnitude_distribution: MagnitudeDistributionBin[];
  nearest_event_km?: number;
}
