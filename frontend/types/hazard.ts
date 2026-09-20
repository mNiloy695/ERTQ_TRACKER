export interface HazardModel {
  id: string;
  name: string;
  organization: string;
  version: string;
  description?: string;
  config_hash?: string;
  is_active: boolean;
}

export interface HazardCurve {
  id: string;
  intensity_measure_type: string;
  latitude: number;
  longitude: number;
  vs30_m_s: number;
  pga_values: number[];
  annual_exceedance_rates: number[];
  hazard_model: HazardModel;
}
