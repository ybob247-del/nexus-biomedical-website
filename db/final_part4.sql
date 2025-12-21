-- Final 45 EDCs to reach 200 total (Currently at 155)
-- Herbicides, Fungicides, Industrial Solvents, UV Filters, Food Additives

INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES

('6197-30-4', 'Octocrylene', '[""]', 'UV filter', 'suspected', '["reproductive"]', 'Potential estrogenic effects', '["Sunscreen", "Cosmetics"]', '["dermal"]', 'moderate', 'Approved in US/EU', '{}'),
('6303-21-5', 'Homosalate', '[""]', 'UV filter', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Sunscreen", "Cosmetics"]', '["dermal"]', 'moderate', 'FDA approved', '{}'),
('118-60-5', 'Ethylhexyl salicylate', '["Octisalate"]', 'UV filter', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Sunscreen", "Cosmetics"]', '["dermal"]', 'low', 'FDA approved', '{}'),
('5989-27-5', '4-Methylbenzylidene camphor', '["4-MBC"]', 'UV filter', 'confirmed', '["reproductive", "thyroid"]', 'Estrogenic effects, thyroid disruption', '["Sunscreen", "Cosmetics"]', '["dermal"]', 'high', 'Banned in US, approved in EU', '{}'),
('36861-47-9', 'Benzophenone-4', '["Sulisobenzone"]', 'UV filter', 'suspected', '["reproductive"]', 'Potential estrogenic effects', '["Sunscreen", "Cosmetics"]', '["dermal"]', 'low', 'FDA approved', '{}'),
('131-57-7', 'Benzophenone-3', '["Oxybenzone"]', 'UV filter', 'confirmed', '["reproductive"]', 'Estrogenic effects', '["Sunscreen", "Cosmetics", "Personal care products"]', '["dermal"]', 'moderate', 'Banned in Hawaii, FDA approved', '{}'),
('4065-45-6', 'Benzophenone-8', '["Dioxybenzone"]', 'UV filter', 'suspected', '["reproductive"]', 'Potential estrogenic effects', '["Sunscreen"]', '["dermal"]', 'moderate', 'FDA approved', '{}'),
('70356-09-1', 'Isoamyl p-methoxycinnamate', '["Amiloxate"]', 'UV filter', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Sunscreen"]', '["dermal"]', 'moderate', 'Approved in EU', '{}'),
('1641-17-4', 'Padimate O', '["Octyl dimethyl PABA"]', 'UV filter', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Sunscreen"]', '["dermal"]', 'low', 'FDA approved', '{}');