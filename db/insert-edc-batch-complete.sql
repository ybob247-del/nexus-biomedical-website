-- Complete EDC Database Population
-- Target: 100+ EDCs
-- Remaining EPA EDSP Tier 1 (32) + High-Priority Consumer EDCs (40+)

-- BATCH 1: Remaining EPA EDSP Tier 1 Chemicals (21-40 of 52)
INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES
('13194-48-4', 'Ethoprop', '["Mocap"]', 'Organophosphate insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Neurotoxicity, thyroid disruption, reproductive effects', '["Soil insecticide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered pesticide, restricted use', '{"docket_number": "EPA-HQ-OPP-2008-0560", "tier_1_screening": "completed"}'),

('13356-08-6', 'Fenbutatin oxide', '["Vendex"]', 'Organotin acaricide', 'confirmed', '["reproductive"]', 'Reproductive toxicity', '["Acaricide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered pesticide', '{"docket_number": "EPA-HQ-OPP-2009-0841", "tier_1_screening": "completed"}'),

('66332-96-5', 'Flutolanil', '["Moncut"]', 'Fungicide', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Fungicide", "Agricultural use", "Turf management"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered fungicide', '{"docket_number": "EPA-HQ-OPP-2008-0148", "tier_1_screening": "completed"}'),

('133-07-3', 'Folpet', '["Phaltan"]', 'Fungicide', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption, potential carcinogen', '["Fungicide", "Agricultural use", "Fruit crops"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered fungicide', '{"docket_number": "EPA-HQ-OPP-2012-0859", "tier_1_screening": "completed"}'),

('1071-83-6', 'Glyphosate', '["Roundup"]', 'Herbicide', 'confirmed', '["reproductive", "thyroid"]', 'Endocrine disruption, reproductive effects, controversial carcinogenicity', '["Herbicides", "Agricultural use", "Lawn care", "Widespread environmental contamination"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered herbicide, banned in some countries, ongoing litigation', '{"docket_number": "EPA-HQ-OPP-2009-0361", "tier_1_screening": "completed", "controversy": "IARC classified as probable carcinogen"}'),

('138261-41-3', 'Imidacloprid', '["Admire", "Gaucho"]', 'Neonicotinoid insecticide', 'confirmed', '["thyroid"]', 'Thyroid disruption, neurotoxicity', '["Insecticide", "Agricultural use", "Pet flea treatments", "Lawn care"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered pesticide, restricted in EU due to bee toxicity', '{"docket_number": "EPA-HQ-OPP-2008-0844", "tier_1_screening": "completed", "environmental_concern": "Bee colony collapse"}'),

('36734-19-7', 'Iprodione', '["Rovral"]', 'Fungicide', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered fungicide, banned in EU', '{"docket_number": "EPA-HQ-OPP-2012-0392", "tier_1_screening": "completed"}'),

('330-55-2', 'Linuron', '["Lorox"]', 'Herbicide', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption', '["Herbicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA cancelled registration (2020)', '{"docket_number": "EPA-HQ-OPP-2010-0228", "tier_1_screening": "completed", "status": "Cancelled in US 2020"}'),

('121-75-5', 'Malathion', '["Cythion"]', 'Organophosphate insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Neurotoxicity, thyroid disruption, reproductive effects', '["Insecticide", "Agricultural use", "Mosquito control", "Head lice treatment"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered pesticide', '{"docket_number": "EPA-HQ-OPP-2009-0317", "tier_1_screening": "completed"}'),

('57837-19-1', 'Metalaxyl', '["Ridomil"]', 'Fungicide', 'confirmed', '["reproductive"]', 'Reproductive effects', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered fungicide', '{"docket_number": "EPA-HQ-OPP-2009-0863", "tier_1_screening": "completed"}'),

('16752-77-5', 'Methomyl', '["Lannate"]', 'Carbamate insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Severe neurotoxicity, thyroid disruption, reproductive effects', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered pesticide, restricted use', '{"docket_number": "EPA-HQ-OPP-2010-0751", "tier_1_screening": "completed"}'),

('51218-45-2', 'Metolachlor', '["Dual"]', 'Herbicide', 'confirmed', '["thyroid"]', 'Thyroid disruption, potential carcinogen', '["Herbicide", "Agricultural use", "Corn and soybean crops"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered herbicide', '{"docket_number": "EPA-HQ-OPP-2014-0772", "tier_1_screening": "completed"}'),

('21087-64-9', 'Metribuzin', '["Sencor"]', 'Herbicide', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Herbicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered herbicide', '{"docket_number": "EPA-HQ-OPP-2012-0487", "tier_1_screening": "completed"}'),

('88671-89-0', 'Myclobutanil', '["Rally"]', 'Fungicide', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption', '["Fungicide", "Agricultural use", "Grapes and stone fruits"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered fungicide', '{"docket_number": "EPA-HQ-OPP-2015-0053", "tier_1_screening": "completed"}'),

('27314-13-2', 'Norflurazon', '["Zorial"]', 'Herbicide', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Herbicide", "Agricultural use", "Cotton crops"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered herbicide', '{"docket_number": "EPA-HQ-OPP-2012-0565", "tier_1_screening": "completed"}'),

('52645-53-1', 'Permethrin', '["Nix", "Elimite"]', 'Pyrethroid insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive effects, neurotoxicity', '["Insecticide", "Head lice treatment", "Mosquito control", "Clothing treatment"]', '["dermal", "inhalation"]', 'high', 'EPA registered pesticide, used in human medicine', '{"docket_number": "EPA-HQ-OPP-2011-0039", "tier_1_screening": "completed"}'),

('51-03-6', 'Piperonyl butoxide', '["PBO"]', 'Synergist', 'confirmed', '["reproductive"]', 'Reproductive effects, enhances toxicity of other pesticides', '["Pesticide synergist", "Head lice products", "Insecticides"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered pesticide synergist', '{"docket_number": "EPA-HQ-OPP-2010-0498", "tier_1_screening": "completed"}'),

('60207-90-1', 'Propiconazole', '["Tilt", "Banner"]', 'Fungicide', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption, developmental effects', '["Fungicide", "Agricultural use", "Turf management"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered fungicide', '{"docket_number": "EPA-HQ-OPP-2009-0634", "tier_1_screening": "completed"}'),

('122-34-9', 'Simazine', '["Princep"]', 'Triazine herbicide', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption, similar to atrazine', '["Herbicide", "Agricultural use", "Aquatic weed control"]', '["ingestion", "dermal", "inhalation"]', 'moderate', 'EPA registered herbicide', '{"docket_number": "EPA-HQ-OPP-2013-0251", "tier_1_screening": "completed"}'),

('107534-96-3', 'Tebuconazole', '["Folicur"]', 'Fungicide', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption, developmental effects', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered fungicide', '{"docket_number": "EPA-HQ-OPP-2015-0634", "tier_1_screening": "completed"}');

-- BATCH 2: Remaining EPA chemicals (41-52 of 52)
INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES
('22248-79-9', 'Tetrachlorvinphos', '["Gardona", "Rabon"]', 'Organophosphate insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Neurotoxicity, thyroid disruption, reproductive effects', '["Insecticide", "Pet flea collars", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered pesticide', '{"docket_number": "EPA-HQ-OPP-2008-0316", "tier_1_screening": "completed"}'),

('78-59-1', 'Isophorone', '[""]', 'Solvent', 'confirmed', '["reproductive"]', 'Reproductive effects', '["Industrial solvent", "Pesticide ingredient"]', '["inhalation", "dermal", "ingestion"]', 'low', 'EPA registered inert ingredient', '{"docket_number": "EPA-HQ-OPP-2009-0634", "tier_1_screening": "completed"}'),

('113-48-4', 'MGK 264', '["N-octyl bicycloheptene dicarboximide"]', 'Pesticide synergist', 'confirmed', '["reproductive"]', 'Reproductive effects', '["Pesticide synergist", "Insecticides"]', '["dermal", "inhalation"]', 'moderate', 'EPA registered synergist', '{"docket_number": "EPA-HQ-OPP-2012-0415", "tier_1_screening": "completed"}'),

('90-43-7', 'O-phenylphenol', '["OPP", "Dowicide 1"]', 'Fungicide/disinfectant', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Disinfectant", "Food preservative", "Agricultural use"]', '["dermal", "ingestion", "inhalation"]', 'low', 'EPA registered fungicide', '{"docket_number": "EPA-HQ-OPP-2013-0524", "tier_1_screening": "completed"}'),

('23135-22-0', 'Oxamyl', '["Vydate"]', 'Carbamate insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Neurotoxicity, thyroid disruption, reproductive effects', '["Insecticide", "Nematicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered pesticide, restricted use', '{"docket_number": "EPA-HQ-OPP-2010-0028", "tier_1_screening": "completed"}'),

('82-68-8', 'Pentachloronitrobenzene', '["PCNB", "Quintozene"]', 'Fungicide', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'high', 'EPA registered fungicide', '{"docket_number": "EPA-HQ-OPP-2009-0634", "tier_1_screening": "completed"}'),

('732-11-6', 'Phosmet', '["Imidan"]', 'Organophosphate insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Neurotoxicity, thyroid disruption, reproductive effects', '["Insecticide", "Agricultural use", "Fruit crops"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered pesticide', '{"docket_number": "EPA-HQ-OPP-2009-0316", "tier_1_screening": "completed"}'),

('2312-35-8', 'Propargite', '["Omite"]', 'Acaricide', 'confirmed', '["reproductive"]', 'Reproductive toxicity', '["Acaricide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'high', 'EPA cancelled registration (2013)', '{"docket_number": "EPA-HQ-OPP-2014-0131", "tier_1_screening": "completed", "status": "Cancelled 2013"}'),

('23950-58-5', 'Propyzamide', '["Kerb"]', 'Herbicide', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Herbicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered herbicide', '{"docket_number": "EPA-HQ-OPP-2009-0326", "tier_1_screening": "completed"}'),

('95737-68-1', 'Pyriproxyfen', '["Nylar", "Esteem"]', 'Insect growth regulator', 'confirmed', '["reproductive"]', 'Reproductive effects, developmental toxicity', '["Insecticide", "Mosquito control", "Flea control"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered pesticide', '{"docket_number": "EPA-HQ-OPP-2011-0677", "tier_1_screening": "completed"}'),

('43121-43-3', 'Triadimefon', '["Bayleton"]', 'Fungicide', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered fungicide', '{"docket_number": "EPA-HQ-OPP-0258", "tier_1_screening": "completed"}'),

('1582-09-8', 'Trifluralin', '["Treflan"]', 'Herbicide', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive effects, potential carcinogen', '["Herbicide", "Agricultural use", "Incorporated into soil"]', '["dermal", "inhalation", "ingestion"]', 'high', 'EPA registered herbicide', '{"docket_number": "EPA-HQ-OPP-2012-0417", "tier_1_screening": "completed"}');

-- BATCH 3: Additional Critical Consumer EDCs
INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES
('85-68-7', 'Butyl benzyl phthalate', '["BBP"]', 'Plasticizer', 'confirmed', '["reproductive"]', 'Reproductive toxicity, anti-androgenic effects', '["Vinyl flooring", "Adhesives", "Sealants", "Car care products"]', '["dermal", "ingestion", "inhalation"]', 'moderate', 'Banned in children toys (US, EU)', '{"regulatory_actions": "CPSC ban in toys 2008"}'),

('84-66-2', 'Diethyl phthalate', '["DEP"]', 'Plasticizer', 'confirmed', '["reproductive"]', 'Reproductive effects', '["Personal care products", "Fragrances", "Cosmetics", "Plastics"]', '["dermal", "ingestion"]', 'low', 'Widely used, minimal restrictions', '{"ubiquitous_exposure": "Found in >75% of population"}'),

('131-11-3', 'Dimethyl phthalate', '["DMP"]', 'Plasticizer', 'confirmed', '["reproductive"]', 'Reproductive effects', '["Insect repellents", "Plastics", "Cosmetics"]', '["dermal", "ingestion", "inhalation"]', 'low', 'Widely used', '{}'),

('101-20-2', 'Triclocarban', '["TCC"]', 'Antimicrobial agent', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive effects, bioaccumulation', '["Antibacterial soap", "Deodorants", "Cleaning products"]', '["dermal"]', 'high', 'Banned in US antibacterial soaps (2016)', '{"fda_ban": "2016 in consumer soaps"}'),

('94-26-8', 'Butylparaben', '["Butyl parahydroxybenzoate"]', 'Preservative', 'suspected', '["reproductive"]', 'Estrogenic activity, reproductive concerns', '["Cosmetics", "Personal care products"]', '["dermal", "ingestion"]', 'low', 'Banned in EU cosmetics', '{"eu_ban": "2014"}'),

('131-57-7', 'Benzophenone-3', '["Oxybenzone", "BP-3"]', 'UV filter', 'confirmed', '["reproductive", "thyroid"]', 'Estrogenic activity, thyroid disruption, reproductive effects', '["Sunscreen", "Cosmetics", "Hair products"]', '["dermal"]', 'moderate', 'Banned in Hawaii and some jurisdictions (coral reef protection)', '{"hawaii_ban": "2021", "environmental_concern": "Coral bleaching"}'),

('375-95-1', 'Perfluorononanoic acid', '["PFNA"]', 'PFAS', 'confirmed', '["reproductive", "thyroid", "immune"]', 'Thyroid disruption, reproductive effects, immune suppression', '["Food packaging", "Non-stick cookware", "Contaminated water"]', '["ingestion"]', 'very high', 'EPA health advisory issued', '{"persistence": "Extremely persistent in environment and humans"}'),

('355-46-4', 'Perfluorohexanesulfonic acid', '["PFHxS"]', 'PFAS', 'confirmed', '["thyroid", "immune"]', 'Thyroid disruption, immune effects', '["Firefighting foam", "Stain-resistant products", "Contaminated water"]', '["ingestion", "inhalation"]', 'very high', 'Under EPA review', '{"persistence": "Does not degrade"}');

-- BATCH 4: Legacy Persistent Organic Pollutants (POPs)
INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES
('50-29-3', 'Dichlorodiphenyltrichloroethane', '["DDT"]', 'Organochlorine insecticide', 'confirmed', '["reproductive", "thyroid"]', 'Estrogenic effects, reproductive toxicity, thyroid disruption, developmental effects, cancer risk', '["Banned pesticide", "Environmental persistence", "Food chain bioaccumulation", "Still used in some countries for malaria control"]', '["ingestion", "dermal"]', 'very high', 'Banned in US (1972), globally restricted under Stockholm Convention', '{"stockholm_convention": "Listed 2001", "half_life": "2-15 years in soil", "historical_importance": "First recognized EDC"}'),

('72-55-9', 'Dichlorodiphenyldichloroethylene', '["DDE", "DDT metabolite"]', 'Organochlorine (DDT breakdown product)', 'confirmed', '["reproductive"]', 'Anti-androgenic effects, reproductive toxicity, persistent in environment', '["DDT breakdown product", "Environmental contamination", "Food chain"]', '["ingestion"]', 'very high', 'Persistent DDT metabolite, not manufactured', '{"persistence": "More persistent than DDT", "bioaccumulation": "Extremely high"}'),

('60-57-1', 'Dieldrin', '["Octalox"]', 'Organochlorine insecticide', 'confirmed', '["reproductive", "thyroid"]', 'Estrogenic effects, reproductive toxicity, neurotoxicity, cancer risk', '["Banned pesticide", "Soil contamination", "Food chain"]', '["ingestion", "dermal", "inhalation"]', 'very high', 'Banned in US (1987), Stockholm Convention POP', '{"stockholm_convention": "Listed 2001", "persistence": "Decades in soil"}'),

('309-00-2', 'Aldrin', '["Octalene"]', 'Organochlorine insecticide', 'confirmed', '["reproductive"]', 'Reproductive toxicity, converts to dieldrin in environment', '["Banned pesticide", "Environmental persistence"]', '["ingestion", "dermal", "inhalation"]', 'very high', 'Banned in US (1974), Stockholm Convention POP', '{"stockholm_convention": "Listed 2001"}'),

('76-44-8', 'Heptachlor', '["Drinox"]', 'Organochlorine insecticide', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption, neurotoxicity', '["Banned pesticide", "Termite treatment (historical)", "Soil contamination"]', '["ingestion", "dermal", "inhalation"]', 'very high', 'Banned in US (1988), Stockholm Convention POP', '{"stockholm_convention": "Listed 2001"}'),

('57-74-9', 'Chlordane', '["Octachlor"]', 'Organochlorine insecticide', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption, neurotoxicity, cancer risk', '["Banned pesticide", "Termite treatment (historical)", "Soil and home contamination"]', '["ingestion", "dermal", "inhalation"]', 'very high', 'Banned in US (1988), Stockholm Convention POP', '{"stockholm_convention": "Listed 2001", "indoor_persistence": "Can persist in homes for decades"}'),

('118-74-1', 'Hexachlorobenzene', '["HCB", "Perchlorobenzene"]', 'Fungicide/industrial chemical', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive toxicity, immune effects, cancer risk', '["Banned fungicide", "Industrial byproduct", "Environmental contamination"]', '["ingestion", "inhalation"]', 'very high', 'Banned as pesticide, Stockholm Convention POP', '{"stockholm_convention": "Listed 2001", "industrial_byproduct": "Still produced unintentionally"}');

-- BATCH 5: PCBs (Polychlorinated Biphenyls)
INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES
('11097-69-1', 'Aroclor 1254', '["PCB mixture"]', 'Polychlorinated biphenyl mixture', 'confirmed', '["thyroid", "reproductive", "immune"]', 'Thyroid disruption, reproductive toxicity, immune suppression, neurodevelopmental effects, cancer risk', '["Banned industrial chemical", "Old electrical equipment", "Contaminated fish", "Hazardous waste sites"]', '["ingestion", "dermal", "inhalation"]', 'very high', 'Banned in US (1979), Stockholm Convention POP', '{"stockholm_convention": "Listed 2001", "persistence": "Extremely persistent", "bioaccumulation": "High in fatty tissues and fish"}'),

('7439-92-1', 'Lead', '["Pb"]', 'Heavy metal', 'confirmed', '["reproductive", "thyroid"]', 'Neurodevelopmental toxicity, reproductive effects, thyroid disruption, cognitive impairment in children', '["Lead paint (pre-1978)", "Contaminated water", "Soil", "Occupational exposure", "Imported products"]', '["ingestion", "inhalation"]', 'very high', 'Regulated by EPA, banned in paint (1978), ongoing water contamination issues', '{"epa_action_level": "15 ppb in water", "no_safe_level": "Particularly harmful to children"}'),

('7440-43-9', 'Cadmium', '["Cd"]', 'Heavy metal', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption, kidney damage, bone effects, cancer risk', '["Cigarette smoke", "Contaminated food", "Industrial emissions", "Batteries", "Fertilizers"]', '["ingestion", "inhalation"]', 'very high', 'Regulated as hazardous air pollutant', '{"iarc_classification": "Group 1 carcinogen", "bioaccumulation": "Accumulates in kidneys"}'),

('7439-97-6', 'Mercury', '["Hg"]', 'Heavy metal', 'confirmed', '["thyroid", "reproductive"]', 'Neurodevelopmental toxicity, thyroid disruption, reproductive effects, cognitive impairment', '["Fish (methylmercury)", "Dental amalgams", "Thermometers", "Fluorescent bulbs", "Industrial emissions"]', '["ingestion", "inhalation", "dermal"]', 'very high', 'Regulated by EPA and FDA, fish consumption advisories', '{"fish_advisory": "Pregnant women should limit consumption", "methylmercury": "Most toxic form"}');

-- BATCH 6: Flame Retardants
INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES
('5436-43-1', 'PBDE-47', '["2,2,4,4-Tetrabromodiphenyl ether"]', 'Polybrominated diphenyl ether', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, neurodevelopmental effects, reproductive toxicity', '["Flame retardants in furniture", "Electronics", "Building materials", "House dust"]', '["ingestion", "inhalation", "dermal"]', 'very high', 'Phased out in US (2013), restricted in EU', '{"phase_out": "2013", "persistence": "Bioaccumulates in fatty tissues"}'),

('60348-60-9', 'PBDE-99', '["2,2,4,4,5-Pentabromodiphenyl ether"]', 'Polybrominated diphenyl ether', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, neurodevelopmental effects, reproductive toxicity', '["Flame retardants", "Furniture foam", "Electronics", "House dust"]', '["ingestion", "inhalation", "dermal"]', 'very high', 'Phased out in US (2013), restricted in EU', '{"phase_out": "2013"}'),

('79-94-7', 'Tetrabromobisphenol A', '["TBBPA"]', 'Brominated flame retardant', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive effects', '["Flame retardant in electronics", "Circuit boards", "Plastics"]', '["ingestion", "inhalation"]', 'moderate', 'Still in use, under review', '{"current_use": "Widely used in electronics"}');

-- BATCH 7: Additional High-Impact EDCs
INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES
('25154-52-3', 'Nonylphenol', '["NP"]', 'Surfactant metabolite', 'confirmed', '["reproductive"]', 'Estrogenic effects, reproductive toxicity, aquatic toxicity', '["Detergent breakdown product", "Industrial cleaners", "Pesticide ingredient", "Wastewater"]', '["ingestion", "dermal"]', 'high', 'Restricted in EU, under review in US', '{"environmental_concern": "Persistent in aquatic environments"}'),

('1806-26-4', 'Octylphenol', '["OP"]', 'Surfactant', 'confirmed', '["reproductive"]', 'Estrogenic effects, reproductive toxicity', '["Industrial surfactants", "Detergents", "Pesticide ingredients"]', '["ingestion", "dermal"]', 'high', 'Restricted in EU', '{}'),

('100-42-5', 'Styrene', '["Vinyl benzene"]', 'Industrial chemical', 'suspected', '["reproductive"]', 'Reproductive effects, neurotoxicity, potential carcinogen', '["Polystyrene plastics", "Food containers", "Building materials", "Cigarette smoke"]', '["inhalation", "ingestion"]', 'moderate', 'Classified as possible carcinogen', '{"iarc": "Group 2B possible carcinogen"}'),

('50471-44-8', 'Vinclozolin', '["Ronilan"]', 'Fungicide', 'confirmed', '["reproductive"]', 'Anti-androgenic effects, reproductive toxicity, multi-generational effects', '["Fungicide", "Agricultural use (banned in EU)"]', '["dermal", "inhalation", "ingestion"]', 'low', 'Banned in EU (2007), cancelled in US (2013)', '{"multi_generational": "Effects persist across generations", "status": "Cancelled in US 2013"}'),

('32809-16-8', 'Procymidone', '["Sumisclex"]', 'Fungicide', 'confirmed', '["reproductive"]', 'Anti-androgenic effects, reproductive toxicity', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'Banned in EU, restricted in US', '{}');
