-- Final 45 EDCs to reach 200 total (Currently at 155)
-- Herbicides, Fungicides, Industrial Solvents, UV Filters, Food Additives

INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES

-- Herbicides (10)
('330-54-1', 'Diuron', '["DCMU"]', 'Herbicide', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive effects', '["Herbicide", "Algaecide"]', '["dermal", "ingestion"]', 'moderate', 'Restricted in EU', '{}'),
('1610-18-0', 'Prometon', '[""]', 'Herbicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Herbicide", "Water contamination"]', '["ingestion"]', 'low', 'EPA registered', '{}'),
('122-34-9', 'Simazine', '[""]', 'Triazine herbicide', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption', '["Herbicide", "Agricultural use", "Water contamination"]', '["ingestion", "dermal"]', 'moderate', 'EPA registered, restricted in EU', '{}'),
('21725-46-2', 'Cyanazine', '["Bladex"]', 'Triazine herbicide', 'confirmed', '["reproductive"]', 'Reproductive toxicity', '["Banned herbicide"]', '["ingestion", "dermal"]', 'low', 'Cancelled in US (2002)', '{}'),
('51218-45-2', 'Metolachlor', '["Dual"]', 'Chloroacetanilide herbicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Herbicide", "Agricultural use"]', '["dermal", "ingestion"]', 'low', 'EPA registered', '{}'),
('15972-60-8', 'Alachlor', '["Lasso"]', 'Chloroacetanilide herbicide', 'suspected', '["thyroid", "reproductive"]', 'Potential endocrine effects', '["Herbicide", "Agricultural use"]', '["dermal", "ingestion", "inhalation"]', 'low', 'EPA registered, restricted use', '{}'),
('34123-59-6', 'Isoproturon', '[""]', 'Phenylurea herbicide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Herbicide", "Agricultural use"]', '["dermal", "ingestion"]', 'low', 'Banned in EU (2016)', '{}'),
('101-42-8', 'Fenuron', '[""]', 'Phenylurea herbicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Herbicide"]', '["ingestion"]', 'low', 'Limited use', '{}'),
('1929-77-7', 'Vernolate', '[""]', 'Thiocarbamate herbicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Herbicide", "Agricultural use"]', '["dermal", "inhalation"]', 'low', 'EPA registered', '{}'),
('2164-17-2', 'Fluometuron', '[""]', 'Phenylurea herbicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Herbicide", "Cotton farming"]', '["dermal", "ingestion"]', 'low', 'EPA registered', '{}'),

-- Fungicides (10)
('133-06-2', 'Captan', '[""]', 'Fungicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Fungicide", "Agricultural use", "Fruit treatment"]', '["dermal", "ingestion", "inhalation"]', 'low', 'EPA registered', '{}'),
('2425-06-1', 'Captafol', '[""]', 'Fungicide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Banned fungicide"]', '["dermal", "inhalation"]', 'moderate', 'Cancelled in US (1999)', '{}'),
('133-07-3', 'Folpet', '["Phaltan"]', 'Fungicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation"]', 'low', 'EPA registered', '{}'),
('2439-10-3', 'Dodine', '[""]', 'Fungicide', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Fungicide", "Fruit treatment"]', '["dermal", "ingestion"]', 'low', 'EPA registered', '{}'),
('8001-35-2', 'Chlorothalonil', '["Bravo"]', 'Fungicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'moderate', 'Banned in EU (2019), EPA registered', '{}'),
('117-18-0', 'Tecnazene', '["TCNB"]', 'Fungicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Fungicide", "Potato storage"]', '["ingestion", "inhalation"]', 'moderate', 'Banned in EU', '{}'),
('2439-01-2', 'Chinomethionat', '["Morestan"]', 'Fungicide', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Fungicide", "Acaricide"]', '["dermal", "inhalation"]', 'moderate', 'Limited use', '{}'),
('8018-01-7', 'Mancozeb', '[""]', 'Fungicide', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation", "ingestion"]', 'low', 'EPA registered', '{}'),
('12427-38-2', 'Maneb', '[""]', 'Fungicide', 'confirmed', '["thyroid"]', 'Thyroid disruption', '["Fungicide", "Agricultural use"]', '["dermal", "inhalation"]', 'low', 'EPA registered', '{}'),
('137-26-8', 'Thiram', '[""]', 'Fungicide', 'confirmed', '["thyroid", "reproductive"]', 'Thyroid disruption, reproductive effects', '["Fungicide", "Seed treatment"]', '["dermal", "inhalation"]', 'low', 'EPA registered', '{}'),

-- Industrial Solvents (10)
('108-88-3', 'Toluene', '["Methylbenzene"]', 'Industrial solvent', 'suspected', '["reproductive"]', 'Potential reproductive effects, neurotoxicity', '["Solvent", "Paint thinner", "Gasoline", "Industrial use"]', '["inhalation", "dermal"]', 'low', 'EPA regulated', '{}'),
('71-43-2', 'Benzene', '[""]', 'Industrial solvent', 'suspected', '["reproductive"]', 'Reproductive effects, carcinogenic', '["Solvent", "Gasoline", "Industrial chemical"]', '["inhalation", "dermal"]', 'low', 'EPA regulated, carcinogen', '{}'),
('100-41-4', 'Ethylbenzene', '[""]', 'Industrial solvent', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Solvent", "Gasoline", "Industrial use"]', '["inhalation", "dermal"]', 'low', 'EPA regulated', '{}'),
('1330-20-7', 'Xylene', '["Dimethylbenzene"]', 'Industrial solvent', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Solvent", "Paint", "Gasoline"]', '["inhalation", "dermal"]', 'low', 'EPA regulated', '{}'),
('67-64-1', 'Acetone', '["2-Propanone"]', 'Industrial solvent', 'suspected', '["reproductive"]', 'Minimal endocrine effects at high doses', '["Solvent", "Nail polish remover", "Industrial use"]', '["inhalation", "dermal", "ingestion"]', 'very low', 'Generally recognized as safe', '{}'),
('78-93-3', 'Methyl ethyl ketone', '["MEK", "2-Butanone"]', 'Industrial solvent', 'suspected', '["reproductive"]', 'Potential reproductive effects at high doses', '["Solvent", "Industrial use"]', '["inhalation", "dermal"]', 'very low', 'EPA regulated', '{}'),
('108-10-1', 'Methyl isobutyl ketone', '["MIBK"]', 'Industrial solvent', 'suspected', '["reproductive"]', 'Potential reproductive effects', '["Solvent", "Industrial use"]', '["inhalation", "dermal"]', 'low', 'EPA regulated', '{}'),
('75-09-2', 'Dichloromethane', '["Methylene chloride"]', 'Industrial solvent', 'suspected', '["reproductive"]', 'Potential reproductive effects, carcinogenic', '["Solvent", "Paint stripper", "Industrial use"]', '["inhalation", "dermal"]', 'low', 'EPA regulated, restricted', '{}'),
('79-01-6', 'Trichloroethylene', '["TCE"]', 'Industrial solvent', 'confirmed', '["reproductive", "thyroid"]', 'Reproductive toxicity, thyroid disruption, carcinogenic', '["Solvent", "Degreaser", "Dry cleaning"]', '["inhalation", "dermal", "ingestion"]', 'low', 'EPA regulated, carcinogen', '{}'),
('127-18-4', 'Tetrachloroethylene', '["Perchloroethylene", "PERC"]', 'Industrial solvent', 'suspected', '["reproductive"]', 'Potential reproductive effects, carcinogenic', '["Dry cleaning", "Degreaser"]', '["inhalation", "dermal"]', 'moderate', 'EPA regulated, carcinogen', '{}'),

-- UV Filters/Sunscreen Chemicals (10)
('5466-77-3', 'Ethylhexyl methoxycinnamate', '["Octinoxate", "OMC"]', 'UV filter', 'confirmed', '["reproductive"]', 'Estrogenic effects', '["Sunscreen", "Cosmetics"]', '["dermal"]', 'moderate', 'Banned in Hawaii, under review', '{}'),
('6197-30-4', 'Octocrylene', '[""]', 'UV filter', 'suspected', '["reproductive"]', 'Potential estrogenic effects', '["Sunscreen", "Cosmetics"]', '["dermal"]', 'moderate', 'Approved in US/EU', '{}'),
('6303-21-5', 'Homosalate', '[""]', 'UV filter', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Sunscreen", "Cosmetics"]', '["dermal"]', 'moderate', 'FDA approved', '{}'),
('118-60-5', 'Ethylhexyl salicylate', '["Octisalate"]', 'UV filter', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Sunscreen", "Cosmetics"]', '["dermal"]', 'low', 'FDA approved', '{}'),
('5989-27-5', '4-Methylbenzylidene camphor', '["4-MBC"]', 'UV filter', 'confirmed', '["reproductive", "thyroid"]', 'Estrogenic effects, thyroid disruption', '["Sunscreen", "Cosmetics"]', '["dermal"]', 'high', 'Banned in US, approved in EU', '{}'),
('36861-47-9', 'Benzophenone-4', '["Sulisobenzone"]', 'UV filter', 'suspected', '["reproductive"]', 'Potential estrogenic effects', '["Sunscreen", "Cosmetics"]', '["dermal"]', 'low', 'FDA approved', '{}'),
('131-57-7', 'Benzophenone-3', '["Oxybenzone"]', 'UV filter', 'confirmed', '["reproductive"]', 'Estrogenic effects', '["Sunscreen", "Cosmetics", "Personal care products"]', '["dermal"]', 'moderate', 'Banned in Hawaii, FDA approved', '{}'),
('4065-45-6', 'Benzophenone-8', '["Dioxybenzone"]', 'UV filter', 'suspected', '["reproductive"]', 'Potential estrogenic effects', '["Sunscreen"]', '["dermal"]', 'moderate', 'FDA approved', '{}'),
('70356-09-1', 'Isoamyl p-methoxycinnamate', '["Amiloxate"]', 'UV filter', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Sunscreen"]', '["dermal"]', 'moderate', 'Approved in EU', '{}'),
('1641-17-4', 'Padimate O', '["Octyl dimethyl PABA"]', 'UV filter', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Sunscreen"]', '["dermal"]', 'low', 'FDA approved', '{}'),

-- Food Additives/Preservatives (5)
('128-37-0', 'Butylated hydroxytoluene', '["BHT", "E321"]', 'Food preservative', 'suspected', '["thyroid", "reproductive"]', 'Potential thyroid and reproductive effects', '["Food preservative", "Cosmetics", "Pharmaceuticals"]', '["ingestion", "dermal"]', 'moderate', 'FDA approved', '{}'),
('25013-16-5', 'Butylated hydroxyanisole', '["BHA", "E320"]', 'Food preservative', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Food preservative", "Cosmetics"]', '["ingestion", "dermal"]', 'moderate', 'FDA approved', '{}'),
('121-79-9', 'Propyl gallate', '["E310"]', 'Food preservative', 'suspected', '["reproductive"]', 'Potential endocrine effects', '["Food preservative", "Fats and oils"]', '["ingestion"]', 'low', 'FDA approved', '{}'),
('88-69-7', '2-Isopropylphenol', '[""]', 'Industrial chemical', 'suspected', '["thyroid"]', 'Potential thyroid effects', '["Industrial intermediate", "Preservative"]', '["dermal", "ingestion"]', 'low', 'Industrial chemical', '{}'),
('80-05-7', 'Bisphenol S', '["BPS"]', 'Industrial chemical', 'confirmed', '["reproductive"]', 'Estrogenic effects, BPA substitute', '["Thermal paper", "Plastics", "BPA replacement"]', '["dermal", "ingestion"]', 'moderate', 'BPA alternative, similar concerns', '{}');
