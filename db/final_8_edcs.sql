-- Final 8 EDCs to reach exactly 200
-- Very specific, uncommon chemicals

INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES

-- Rare industrial chemicals and additives
('77-09-8', 'Phenolphthalein', '[""]', 'Indicator dye', 'suspected', '["reproductive"]', 'Potential reproductive effects, carcinogenic', '["Laboratory reagent", "Laxative (discontinued)"]', '["ingestion", "dermal"]', 'low', 'Discontinued as laxative', '{}'),
('140-66-9', '4-tert-Octylphenol', '[""]', 'Alkylphenol', 'confirmed', '["reproductive"]', 'Estrogenic effects', '["Industrial surfactant", "Detergent"]', '["dermal", "ingestion"]', 'high', 'Under review', '{}'),
('27193-86-8', 'Dodecylphenol', '[""]', 'Alkylphenol', 'suspected', '["reproductive"]', 'Potential estrogenic effects', '["Industrial chemical", "Surfactant"]', '["dermal"]', 'high', 'Industrial use', '{}'),
('25154-52-3', 'Nonylphenol', '["NP"]', 'Alkylphenol', 'confirmed', '["reproductive"]', 'Estrogenic effects', '["Industrial surfactant", "Detergent", "Pesticide adjuvant"]', '["dermal", "ingestion"]', 'very high', 'Restricted in EU', '{}'),
('84852-15-3', 'Nonylphenol ethoxylate', '["NPE"]', 'Surfactant', 'confirmed', '["reproductive"]', 'Degrades to nonylphenol, estrogenic', '["Detergent", "Industrial cleaner"]', '["dermal", "ingestion"]', 'high', 'Restricted in some regions', '{}'),
('25013-15-4', 'Vinyl toluene', '["Methylstyrene"]', 'Industrial monomer', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Polymer production", "Industrial chemical"]', '["inhalation", "dermal"]', 'low', 'Industrial chemical', '{}'),
('123-91-1', '1,4-Dioxane', '[""]', 'Industrial solvent', 'suspected', '["reproductive"]', 'Potential reproductive effects, carcinogenic', '["Solvent", "Manufacturing byproduct", "Cosmetics contaminant"]', '["inhalation", "dermal", "ingestion"]', 'low', 'EPA contaminant, carcinogen', '{}'),
('75-21-8', 'Ethylene oxide', '[""]', 'Industrial chemical', 'suspected', '["reproductive"]', 'Reproductive toxicity, carcinogenic', '["Sterilant", "Industrial fumigant"]', '["inhalation"]', 'very low', 'EPA regulated, carcinogen', '{}');
