-- Final 45 EDCs to reach 200 total (Currently at 155)
-- Herbicides, Fungicides, Industrial Solvents, UV Filters, Food Additives

INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES

('1610-18-0', 'Prometon', '[""]', 'Herbicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Herbicide", "Water contamination"]', '["ingestion"]', 'low', 'EPA registered', '{}'),
('122-34-9', 'Simazine', '[""]', 'Triazine herbicide', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption', '["Herbicide", "Agricultural use", "Water contamination"]', '["ingestion", "dermal"]', 'moderate', 'EPA registered, restricted in EU', '{}'),
('21725-46-2', 'Cyanazine', '["Bladex"]', 'Triazine herbicide', 'confirmed', '["reproductive"]', 'Reproductive toxicity', '["Banned herbicide"]', '["ingestion", "dermal"]', 'low', 'Cancelled in US (2002)', '{}'),
('51218-45-2', 'Metolachlor', '["Dual"]', 'Chloroacetanilide herbicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Herbicide", "Agricultural use"]', '["dermal", "ingestion"]', 'low', 'EPA registered', '{}'),
('15972-60-8', 'Alachlor', '["Lasso"]', 'Chloroacetanilide herbicide', 'suspected', '["thyroid", "reproductive"]', 'Potential endocrine effects', '["Herbicide", "Agricultural use"]', '["dermal", "ingestion", "inhalation"]', 'low', 'EPA registered, restricted use', '{}'),
('34123-59-6', 'Isoproturon', '[""]', 'Phenylurea herbicide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Herbicide", "Agricultural use"]', '["dermal", "ingestion"]', 'low', 'Banned in EU (2016)', '{}'),
('101-42-8', 'Fenuron', '[""]', 'Phenylurea herbicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Herbicide"]', '["ingestion"]', 'low', 'Limited use', '{}'),
('1929-77-7', 'Vernolate', '[""]', 'Thiocarbamate herbicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Herbicide", "Agricultural use"]', '["dermal", "inhalation"]', 'low', 'EPA registered', '{}'),
('2164-17-2', 'Fluometuron', '[""]', 'Phenylurea herbicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Herbicide", "Cotton farming"]', '["dermal", "ingestion"]', 'low', 'EPA registered', '{}');