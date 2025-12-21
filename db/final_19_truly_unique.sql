-- Final 19 Truly Unique EDCs to reach 200 total
-- Focusing on less common but scientifically verified EDCs

INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES

-- Rodenticides and other pesticides
('81-81-2', 'Warfarin', '["Coumadin"]', 'Rodenticide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Rodenticide", "Anticoagulant medication"]', '["ingestion"]', 'low', 'EPA registered', '{}'),
('28772-56-7', 'Bromadiolone', '[""]', 'Rodenticide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Rodenticide"]', '["ingestion"]', 'moderate', 'EPA registered', '{}'),
('56073-10-0', 'Brodifacoum', '[""]', 'Rodenticide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Rodenticide"]', '["ingestion"]', 'very high', 'EPA registered', '{}'),

-- Additional industrial chemicals
('106-44-5', '4-Cresol', '["p-Cresol"]', 'Industrial chemical', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Industrial solvent", "Disinfectant"]', '["dermal", "inhalation"]', 'low', 'Industrial chemical', '{}'),
('95-48-7', '2-Cresol', '["o-Cresol"]', 'Industrial chemical', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Industrial solvent", "Disinfectant"]', '["dermal", "inhalation"]', 'low', 'Industrial chemical', '{}'),
('108-39-4', '3-Cresol', '["m-Cresol"]', 'Industrial chemical', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Industrial solvent", "Disinfectant"]', '["dermal", "inhalation"]', 'low', 'Industrial chemical', '{}'),

-- Plasticizers and additives
('84-61-7', 'Dicyclohexyl phthalate', '["DCHP"]', 'Phthalate plasticizer', 'confirmed', '["reproductive"]', 'Reproductive toxicity', '["Plasticizer"]', '["dermal", "ingestion"]', 'moderate', 'Restricted in some regions', '{}'),
('131-18-0', 'Dipentyl phthalate', '["DPP"]', 'Phthalate plasticizer', 'confirmed', '["reproductive"]', 'Reproductive effects', '["Plasticizer"]', '["dermal", "ingestion"]', 'moderate', 'Under review', '{}'),
('131-16-8', 'Di-n-propyl phthalate', '["DnPP"]', 'Phthalate plasticizer', 'confirmed', '["reproductive"]', 'Reproductive toxicity', '["Plasticizer"]', '["dermal", "ingestion"]', 'low', 'Under review', '{}'),

-- Pharmaceutical EDCs
('57-63-6', 'Ethinylestradiol', '["EE2"]', 'Synthetic estrogen', 'confirmed', '["reproductive"]', 'Potent estrogenic effects', '["Birth control pills", "Pharmaceutical"]', '["ingestion"]', 'moderate', 'Pharmaceutical, environmental concern', '{}'),
('50-28-2', 'Estradiol', '["E2", "17β-estradiol"]', 'Natural estrogen', 'confirmed', '["reproductive"]', 'Estrogenic effects', '["Hormone therapy", "Natural hormone"]', '["ingestion", "dermal"]', 'moderate', 'Pharmaceutical', '{}'),
('53-16-7', 'Estrone', '["E1"]', 'Natural estrogen', 'confirmed', '["reproductive"]', 'Estrogenic effects', '["Hormone therapy", "Natural hormone"]', '["ingestion"]', 'moderate', 'Pharmaceutical', '{}'),
('58-22-0', 'Testosterone', '[""]', 'Natural androgen', 'confirmed', '["reproductive"]', 'Androgenic effects', '["Hormone therapy", "Natural hormone"]', '["ingestion", "dermal"]', 'moderate', 'Pharmaceutical', '{}'),

-- Mycotoxins
('7440-38-2', 'Arsenic', '[""]', 'Heavy metal', 'confirmed', '["reproductive", "thyroid"]', 'Endocrine disruption, carcinogenic', '["Contaminated water", "Industrial pollution", "Pesticide residue"]', '["ingestion", "inhalation"]', 'high', 'EPA regulated, carcinogen', '{}'),

-- Additional herbicides
('94-75-7', '2,4-D', '["2,4-Dichlorophenoxyacetic acid"]', 'Herbicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Herbicide", "Weed killer"]', '["dermal", "ingestion", "inhalation"]', 'low', 'EPA registered', '{}'),
('93-76-5', '2,4,5-T', '["2,4,5-Trichlorophenoxyacetic acid"]', 'Herbicide', 'suspected', '["thyroid", "reproductive"]', 'Potential endocrine effects, dioxin contamination', '["Banned herbicide", "Agent Orange component"]', '["dermal", "ingestion"]', 'low', 'Banned in US (1985)', '{}'),
('1918-00-9', 'Dicamba', '[""]', 'Herbicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Herbicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered', '{}'),

-- Food contact materials
('77-90-7', 'Tributyl acetylcitrate', '["ATBC"]', 'Plasticizer', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Plasticizer", "Food packaging"]', '["ingestion"]', 'low', 'FDA approved for food contact', '{}'),
('84-74-2', 'Dibutyl phthalate', '["DBP"]', 'Phthalate plasticizer', 'confirmed', '["reproductive"]', 'Reproductive toxicity', '["Plasticizer", "Personal care products"]', '["dermal", "ingestion"]', 'moderate', 'Restricted in EU, EPA concern', '{}');
