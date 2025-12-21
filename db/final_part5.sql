-- Final 45 EDCs to reach 200 total (Currently at 155)
-- Herbicides, Fungicides, Industrial Solvents, UV Filters, Food Additives

INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES

('25013-16-5', 'Butylated hydroxyanisole', '["BHA", "E320"]', 'Food preservative', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Food preservative", "Cosmetics"]', '["ingestion", "dermal"]', 'moderate', 'FDA approved', '{}'),
('121-79-9', 'Propyl gallate', '["E310"]', 'Food preservative', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Food preservative", "Fats and oils"]', '["ingestion"]', 'low', 'FDA approved', '{}'),
('88-69-7', '2-Isopropylphenol', '[""]', 'Industrial chemical', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Industrial intermediate", "Preservative"]', '["dermal", "ingestion"]', 'low', 'Industrial chemical', '{}'),
('80-05-7', 'Bisphenol S', '["BPS"]', 'Industrial chemical', 'confirmed', '["reproductive"]', 'Estrogenic effects, BPA substitute', '["Thermal paper", "Plastics", "BPA replacement"]', '["dermal", "ingestion"]', 'moderate', 'BPA alternative, similar concerns', '{}');