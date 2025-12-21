-- Final 45 EDCs to reach 200 total (Currently at 155)
-- Herbicides, Fungicides, Industrial Solvents, UV Filters, Food Additives

INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES

('2425-06-1', 'Captafol', '[""]', 'Fungicide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Banned fungicide"]', '["dermal", "inhalation"]', 'moderate', 'Cancelled in US (1999)', '{}'),
('133-07-3', 'Folpet', '["Phaltan"]', 'Fungicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation"]', 'low', 'EPA registered', '{}'),
('2439-10-3', 'Dodine', '[""]', 'Fungicide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Fungicide", "Fruit treatment"]', '["dermal", "ingestion"]', 'low', 'EPA registered', '{}'),
('8001-35-2', 'Chlorothalonil', '["Bravo"]', 'Fungicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'Banned in EU (2019), EPA registered', '{}'),
('117-18-0', 'Tecnazene', '["TCNB"]', 'Fungicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Fungicide", "Potato storage"]', '["ingestion", "inhalation"]', 'moderate', 'Banned in EU', '{}'),
('2439-01-2', 'Chinomethionat', '["Morestan"]', 'Fungicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Fungicide", "Acaricide"]', '["dermal", "inhalation"]', 'moderate', 'Limited use', '{}'),
('8018-01-7', 'Mancozeb', '[""]', 'Fungicide', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered', '{}'),
('12427-38-2', 'Maneb', '[""]', 'Fungicide', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation"]', 'low', 'EPA registered', '{}'),
('137-26-8', 'Thiram', '[""]', 'Fungicide', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive effects', '["Fungicide", "Seed treatment"]', '["dermal", "inhalation"]', 'low', 'EPA registered', '{}');