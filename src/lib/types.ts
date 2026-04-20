export type BrandKey =
  | 'mapei'
  | 'weber'
  | 'laticrete'
  | 'kerakoll'
  | 'pidilite'
  | 'xchem'
  | 'xcalibur'
  | 'vetonit'
  | 'colmef';

export type CategoryKey =
  | 'tile-adhesives'
  | 'tile-grouts'
  | 'concrete-repair'
  | 'waterproofing'
  | 'flooring-systems'
  | 'primers-bonding'
  | 'sealants-joints'
  | 'specialty-adhesives';

export interface Coverage {
  value: string;
  unit: string;
  notes?: string;
}

export interface Strength {
  bond?: string;
  compressive?: string;
  flexural?: string;
  tensile?: string;
  slant_shear?: string;
  deformability?: string;
  crack_bridging?: string;
  elongation?: string;
}

export interface Product {
  id: string;
  brand: BrandKey;
  name: string;
  category: CategoryKey;
  description: string;
  classification?: string;
  coverage?: Coverage;
  strength?: Strength;
  pack_size?: string[];
  pot_life?: string;
  open_time?: string;
  cure_time?: string;
  colors?: string[];
  application_areas?: string[];
  application_temp?: string;
  certifications?: string[];
  shelf_life?: string;
  mix_ratio?: string;
  recoat_wait?: string;
  tile_wait?: string;
  flood_test_wait?: string;
  full_immersion_wait?: string;
  thickness_range?: string;
  thickness_max?: string;
  yield?: string;
  light_traffic?: string;
  final_set?: string;
  setting_time?: string;
  reinforcement?: string;
  joint_width?: string;
  movement_capability?: string;
  elongation_at_break?: string;
  certified_bars?: string;
  chemical_resistance?: string;
  aggregate_size?: string;
  specific_gravity?: string;
  key_features?: string[];
  hardening?: string;
  installation?: string;
  // Dates / references for flooring
  ready_for_ceramic?: string;
  ready_for_stone?: string;
  ready_for_wood?: string;
  subsequent_bonding_wait?: string;
  shelf_life_a?: string;
  shelf_life_b?: string;
  min_thickness?: string;
  // TDS / links
  tds_url: string;
  tds_direct?: string;
  sds_url?: string;
  gcc_site: string;
  [key: string]: any; // allow future fields
}

export interface BrandMeta {
  key: BrandKey;
  name: string;
  label: string;
  description: string;
  origin: string;
  gcc_url: string;
  color: string; // accent swatch
}

export interface CategoryMeta {
  key: CategoryKey;
  name: string;
  shortName: string;
  description: string;
  icon: string; // SVG path
  standards: string[];
}
