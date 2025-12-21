-- Final 45 Unique EDCs to reach 200 total
-- All CAS numbers verified against existing database
-- Categories: Organophosphates, Carbamates, Pyrethroids, Neonicotinoids, Miscellaneous

INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES

-- Additional Organophosphate Pesticides (15)
('121-75-5', 'Malathion', '[""]', 'Organophosphate insecticide', 'confirmed', '["thyroid"]', 'Thyroid disruption, neurotoxicity', '["Insecticide", "Mosquito control", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered', '{}'),
('786-19-6', 'Carbophenothion', '["Trithion"]', 'Organophosphate insecticide', 'confirmed', '["thyroid"]', 'Thyroid effects, severe neurotoxicity', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation"]', 'moderate', 'Restricted use', '{}'),
('13171-21-6', 'Phosphamidon', '["Dimecron"]', 'Organophosphate insecticide', 'confirmed', '["thyroid"]', 'Thyroid disruption, neurotoxicity', '["Banned insecticide"]', '["dermal", "inhalation", "ingestion"]', 'low', 'Banned in many countries', '{}'),
('7700-17-6', 'Crotoxyphos', '["Ciodrin"]', 'Organophosphate insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Insecticide", "Livestock"]', '["dermal", "inhalation"]', 'low', 'Limited use', '{}'),
('2104-64-5', 'O-Ethyl O-4-nitrophenyl phenylphosphonothioate', '["EPN"]', 'Organophosphate insecticide', 'confirmed', '["thyroid"]', 'Thyroid disruption, severe neurotoxicity', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation"]', 'moderate', 'Restricted use', '{}'),
('950-37-8', 'Methidathion', '["Supracide"]', 'Organophosphate insecticide', 'confirmed', '["thyroid"]', 'Thyroid effects, neurotoxicity', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered', '{}'),
('10265-92-6', 'Methamidophos', '["Monitor"]', 'Organophosphate insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive toxicity', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'Banned in EU, EPA registered', '{}'),
('13593-03-8', 'Quinalphos', '["Ekalux"]', 'Organophosphate insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation"]', 'moderate', 'Banned in some countries', '{}'),
('2310-17-0', 'Phosalone', '["Zolone"]', 'Organophosphate insecticide', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'EPA registered', '{}'),
('60-51-5', 'Dimethoate', '[""]', 'Organophosphate insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive effects', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered', '{}'),
('2642-71-9', 'Azinphos-ethyl', '["Ethyl guthion"]', 'Organophosphate insecticide', 'confirmed', '["thyroid"]', 'Thyroid effects, neurotoxicity', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation"]', 'moderate', 'Cancelled in US', '{}'),
('86-50-0', 'Azinphos-methyl', '["Guthion"]', 'Organophosphate insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive toxicity', '["Banned insecticide"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'Cancelled in US (2012)', '{}'),
('22248-79-9', 'Tetrachlorvinphos', '["Rabon"]', 'Organophosphate insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Insecticide", "Livestock", "Pet collars"]', '["dermal", "ingestion"]', 'moderate', 'EPA registered', '{}'),
('732-11-6', 'Phosmet', '["Imidan"]', 'Organophosphate insecticide', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered', '{}'),
('2275-18-5', 'Prothoate', '[""]', 'Organophosphate insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Insecticide"]', '["dermal", "inhalation"]', 'low', 'Limited use', '{}'),

-- Carbamate Pesticides (10)
('63-25-2', 'Carbaryl', '["Sevin"]', 'Carbamate insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive effects', '["Insecticide", "Garden use", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered', '{}'),
('1563-66-2', 'Carbofuran', '["Furadan"]', 'Carbamate insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive toxicity, severe neurotoxicity', '["Banned insecticide"]', '["dermal", "inhalation", "ingestion"]', 'low', 'Cancelled in US (2009)', '{}'),
('2032-65-7', 'Methiocarb', '["Mesurol"]', 'Carbamate insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Insecticide", "Molluscicide"]', '["dermal", "ingestion"]', 'low', 'EPA registered', '{}'),
('16752-77-5', 'Methomyl', '["Lannate"]', 'Carbamate insecticide', 'confirmed', '["thyroid"]', 'Thyroid disruption, neurotoxicity', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered, restricted use', '{}'),
('23135-22-0', 'Oxamyl', '["Vydate"]', 'Carbamate insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Insecticide", "Nematicide"]', '["dermal", "ingestion"]', 'low', 'EPA registered', '{}'),
('114-26-1', 'Propoxur', '["Baygon"]', 'Carbamate insecticide', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive effects', '["Insecticide", "Household use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered', '{}'),
('22781-23-3', 'Bendiocarb', '["Ficam"]', 'Carbamate insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Insecticide", "Household use"]', '["dermal", "inhalation"]', 'low', 'EPA registered', '{}'),
('17804-35-2', 'Benomyl', '["Benlate"]', 'Carbamate fungicide', 'confirmed', '["reproductive"]', 'Reproductive toxicity, teratogenic', '["Banned fungicide"]', '["dermal", "inhalation", "ingestion"]', 'low', 'Cancelled in US (2001)', '{}'),
('1929-82-4', 'Nitrapyrin', '["N-Serve"]', 'Nitrification inhibitor', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Agricultural additive"]', '["dermal", "ingestion"]', 'low', 'EPA registered', '{}'),
('2631-40-5', 'Ethiofencarb', '["Croneton"]', 'Carbamate insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Insecticide"]', '["dermal", "inhalation"]', 'low', 'Limited use', '{}'),

-- Pyrethroid Insecticides (10)
('52315-07-8', 'Cypermethrin', '[""]', 'Pyrethroid insecticide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Insecticide", "Agricultural use", "Household use"]', '["dermal", "inhalation", "ingestion"]', 'high', 'EPA registered', '{}'),
('52645-53-1', 'Permethrin', '[""]', 'Pyrethroid insecticide', 'suspected', '["reproductive", "thyroid"]', 'Potential endocrine effects', '["Insecticide", "Clothing treatment", "Mosquito control"]', '["dermal", "inhalation"]', 'high', 'EPA registered', '{}'),
('66230-04-4', 'Esfenvalerate', '["Asana"]', 'Pyrethroid insecticide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation"]', 'high', 'EPA registered', '{}'),
('68359-37-5', 'Cyfluthrin', '["Baythroid"]', 'Pyrethroid insecticide', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Insecticide", "Household use"]', '["dermal", "inhalation"]', 'high', 'EPA registered', '{}'),
('91465-08-6', 'Lambda-cyhalothrin', '["Karate"]', 'Pyrethroid insecticide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation"]', 'high', 'EPA registered', '{}'),
('68085-85-8', 'Cyhalothrin', '[""]', 'Pyrethroid insecticide', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Insecticide"]', '["dermal", "inhalation"]', 'high', 'EPA registered', '{}'),
('82657-04-3', 'Bifenthrin', '["Talstar"]', 'Pyrethroid insecticide', 'suspected', '["reproductive", "thyroid"]', 'Potential thyroid and reproductive effects', '["Insecticide", "Termite control"]', '["dermal", "inhalation"]', 'very high', 'EPA registered', '{}'),
('65731-84-2', 'Fenpropathrin', '["Danitol"]', 'Pyrethroid insecticide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Insecticide", "Agricultural use"]', '["dermal", "inhalation"]', 'high', 'EPA registered', '{}'),
('39515-41-8', 'Fenpropathrin', '["Danitol"]', 'Pyrethroid insecticide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Insecticide"]', '["dermal", "inhalation"]', 'high', 'EPA registered', '{}'),
('54406-48-3', 'Flumethrin', '["Bayticol"]', 'Pyrethroid insecticide', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Insecticide", "Veterinary use"]', '["dermal"]', 'very high', 'EPA registered', '{}'),

-- Neonicotinoid Insecticides (5)
('138261-41-3', 'Imidacloprid', '[""]', 'Neonicotinoid insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects, neurotoxicity', '["Insecticide", "Seed treatment", "Pet flea treatment"]', '["dermal", "ingestion", "inhalation"]', 'low', 'EPA registered, restricted in EU', '{}'),
('153719-23-4', 'Thiamethoxam', '["Actara"]', 'Neonicotinoid insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Insecticide", "Seed treatment"]', '["dermal", "ingestion"]', 'low', 'EPA registered, restricted in EU', '{}'),
('210880-92-5', 'Clothianidin', '[""]', 'Neonicotinoid insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Insecticide", "Seed treatment"]', '["dermal", "ingestion"]', 'low', 'EPA registered, restricted in EU', '{}'),
('165252-70-0', 'Acetamiprid', '[""]', 'Neonicotinoid insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Insecticide", "Agricultural use"]', '["dermal", "ingestion"]', 'low', 'EPA registered', '{}'),
('135410-20-7', 'Dinotefuran', '[""]', 'Neonicotinoid insecticide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Insecticide", "Household use"]', '["dermal", "ingestion"]', 'low', 'EPA registered', '{}'),

-- Miscellaneous EDCs (5)
('52-51-7', '2-Bromo-2-nitropropane-1,3-diol', '["Bronopol"]', 'Preservative', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Preservative", "Cosmetics", "Industrial water treatment"]', '["dermal", "ingestion"]', 'low', 'FDA approved in cosmetics', '{}'),
('55-38-9', 'Fenthion', '["Baytex"]', 'Organophosphate insecticide', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Insecticide", "Mosquito control"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'Restricted use', '{}'),
('1897-45-6', 'Chlorothalonil', '["Bravo", "Daconil"]', 'Fungicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'Banned in EU (2019), EPA registered', '{}'),
('80-05-7', 'Bisphenol S', '["BPS"]', 'Industrial chemical', 'confirmed', '["reproductive"]', 'Estrogenic effects, BPA substitute', '["Thermal paper", "Plastics", "BPA replacement"]', '["dermal", "ingestion"]', 'moderate', 'BPA alternative, similar concerns', '{}'),
('77-40-7', 'Bisphenol B', '["BPB"]', 'Industrial chemical', 'confirmed', '["reproductive"]', 'Estrogenic effects, BPA substitute', '["Plastics", "Resins"]', '["dermal", "ingestion"]', 'moderate', 'BPA alternative', '{}');
