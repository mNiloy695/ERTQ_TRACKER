export interface SourceRecord {
  id: string;
  provider: string;
  catalog_name?: string;
  external_id: string;
  reported_time: string;
  reported_latitude: number;
  reported_longitude: number;
  reported_depth_km: number;
  reported_magnitude: number;
  reported_magnitude_type: string;
  raw_payload_uri?: string;
}

export interface ScientificBasis {
  source_agency: string;
  external_event_id: string;
  catalog_version: string;
  license: string;
  provenance_url: string;
}

export interface Earthquake {
  id: string;
  external_id: string;
  origin_time: string;
  event_time?: string;
  latitude: number;
  longitude: number;
  depth_km: number;
  magnitude: number;
  magnitude_type: string;
  location_name?: string;
  location_description?: string;
  region?: string;
  tectonic_context?: string;
  config_hash?: string;
  source: string;
  catalog_version?: string;
  source_records?: SourceRecord[];
  source_record?: SourceRecord;
  scientific_basis?: ScientificBasis;
  created_at?: string;
  updated_at?: string;
}
