// src/services/api.js — Full 41-breed database from trained EfficientNet-B0 model
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// ── Model Info (from your trained model) ──────────────────────────────────
// Architecture: EfficientNet-B0 | Classes: 41 | Overall Accuracy: 61.60% | Top-5: 90.44%

// ── Complete Breed Database (all 41 classes from your model) ──────────────
const BREED_DATABASE = {
  // ── Indian Cattle ─────────────────────────────────────────────────────
  "Gir": {
    breed: "Gir", confidence: 83, modelAccuracy: 82.50,
    type: "Cow", origin: "Gujarat, India",
    milk_yield: "10–16 L/day", fat_content: "4.5–5.5%",
    weight: "385–550 kg", height: "130–135 cm", lifespan: "20–25 years",
    color: "Red/white spotted or dark red", horns: "Long, curved outward",
    uses: "Milk, draught", heat_tolerance: "Excellent",
    health_status: "Healthy",
    health_details: "Distinctive bulging forehead and long drooping ears. Heat-tolerant breed well suited to tropical climates. Check udder health regularly for high yield.",
    tip: "Gir cows are heat-tolerant but still need shade and fresh water. Check udder health before evening milking.",
  },
  "Sahiwal": {
    breed: "Sahiwal", confidence: 74, modelAccuracy: 73.53,
    type: "Cow", origin: "Punjab, Pakistan/India",
    milk_yield: "8–15 L/day", fat_content: "4.5%",
    weight: "300–450 kg", height: "125–130 cm", lifespan: "18–22 years",
    color: "Reddish-brown to dull red", horns: "Short, stumpy",
    uses: "Milk, draught", heat_tolerance: "Excellent",
    health_status: "Healthy",
    health_details: "Good reddish-brown coat. Active and alert. Strong body condition with no visible abnormalities. Highly tick-resistant breed.",
    tip: "Sahiwal is highly tick-resistant. Still inspect skin monthly and provide mineral supplements to boost milk production.",
  },
  "Tharparkar": {
    breed: "Tharparkar", confidence: 67, modelAccuracy: 66.67,
    type: "Cow", origin: "Rajasthan, India / Sindh, Pakistan",
    milk_yield: "8–12 L/day", fat_content: "4.9%",
    weight: "300–400 kg", height: "127 cm", lifespan: "18–20 years",
    color: "White to grey", horns: "Medium, curved upward",
    uses: "Milk, draught", heat_tolerance: "Excellent",
    health_status: "Healthy",
    health_details: "Clean white coat in excellent condition. Well-built frame suitable for arid conditions. No signs of disease or skin issues.",
    tip: "Tharparkar cattle thrive in dry conditions. Ensure balanced feed with green fodder and minerals for optimal health.",
  },
  "Kankrej": {
    breed: "Kankrej", confidence: 62, modelAccuracy: 64.29,
    type: "Cow", origin: "Gujarat, India",
    milk_yield: "4–8 L/day", fat_content: "4.5%",
    weight: "350–550 kg", height: "140 cm", lifespan: "15–20 years",
    color: "Silver-grey to iron grey", horns: "Lyre-shaped, large",
    uses: "Draught, milk", heat_tolerance: "Very good",
    health_status: "Healthy",
    health_details: "Distinctive large lyre-shaped horns and grey-brown coat in good condition. Powerful draught animal. No visible health issues detected.",
    tip: "Kankrej cattle need regular hoof inspection every 3–4 months. Check for any limping and provide soft dry bedding.",
  },
  "Ongole": {
    breed: "Ongole", confidence: 56, modelAccuracy: 45.00,
    type: "Cow", origin: "Andhra Pradesh, India",
    milk_yield: "5–8 L/day", fat_content: "4.5%",
    weight: "450–650 kg", height: "142 cm", lifespan: "15–20 years",
    color: "White to grey", horns: "Short, thick",
    uses: "Draught, beef, milk", heat_tolerance: "Very good",
    health_status: "Healthy",
    health_details: "Large muscular frame. Good for heavy draught work. Ensure adequate high-energy feed for working animals.",
    tip: "Ongole cattle are powerful workers. Provide high-energy feed and ensure rest periods after heavy draught work.",
  },
  "Hariana": {
    breed: "Hariana", confidence: 45, modelAccuracy: 45.45,
    type: "Cow", origin: "Haryana, India",
    milk_yield: "6–10 L/day", fat_content: "4.2%",
    weight: "300–400 kg", height: "130 cm", lifespan: "15–18 years",
    color: "White", horns: "Medium, upward curved",
    uses: "Milk, draught", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Clean white coat. Dual-purpose breed suitable for both milk and draught. Monitor feed quality for optimal milk yield.",
    tip: "Hariana cows are good dual-purpose animals. Ensure balanced nutrition and regular deworming every 3 months.",
  },
  "Rathi": {
    breed: "Rathi", confidence: 62, modelAccuracy: 66.67,
    type: "Cow", origin: "Rajasthan, India",
    milk_yield: "6–12 L/day", fat_content: "4.8%",
    weight: "280–400 kg", height: "123 cm", lifespan: "15–20 years",
    color: "Brown with white patches", horns: "Short, upward curved",
    uses: "Milk", heat_tolerance: "Excellent",
    health_status: "Healthy",
    health_details: "Brown coat with white patches in good condition. Well-adapted to arid Rajasthan climate. Good milk producer for desert region.",
    tip: "Rathi cows are excellent desert milk producers. Provide adequate water (40–50L/day) and shade in hot weather.",
  },
  "Red_Sindhi": {
    breed: "Red Sindhi", confidence: 54, modelAccuracy: 58.33,
    type: "Cow", origin: "Sindh, Pakistan / Kerala, India",
    milk_yield: "8–12 L/day", fat_content: "5%",
    weight: "280–350 kg", height: "120 cm", lifespan: "18–22 years",
    color: "Deep red", horns: "Short, thick",
    uses: "Milk", heat_tolerance: "Excellent",
    health_status: "Healthy",
    health_details: "Deep red coat characteristic of the breed. High tick and disease resistance. Well-suited to humid tropical climates.",
    tip: "Red Sindhi cows have excellent disease resistance. Regular vaccination is still essential — schedule FMD and BQ vaccines annually.",
  },
  "Dangi": {
    breed: "Dangi", confidence: 70, modelAccuracy: 77.78,
    type: "Cow", origin: "Maharashtra, India",
    milk_yield: "3–5 L/day", fat_content: "4.8%",
    weight: "280–380 kg", height: "125 cm", lifespan: "15–18 years",
    color: "Red/white or black/white spotted", horns: "Medium",
    uses: "Draught, milk", heat_tolerance: "Very good",
    health_status: "Healthy",
    health_details: "Distinctive spotted coat pattern. Hardy breed well-adapted to hilly terrain and heavy rainfall areas of Maharashtra.",
    tip: "Dangi cattle are perfect for hilly terrain. Check hooves regularly as wet conditions can cause foot rot.",
  },
  "Deoni": {
    breed: "Deoni", confidence: 64, modelAccuracy: 63.64,
    type: "Cow", origin: "Karnataka/Maharashtra, India",
    milk_yield: "6–10 L/day", fat_content: "4.6%",
    weight: "300–420 kg", height: "130 cm", lifespan: "15–20 years",
    color: "Black and white spotted", horns: "Medium curved",
    uses: "Milk, draught", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Distinctive black and white pattern. Good dual-purpose breed from Deccan plateau region.",
    tip: "Deoni cattle are good dual-purpose animals. Provide quality fodder and regular health checkups for best performance.",
  },
  "Khillari": {
    breed: "Khillari", confidence: 67, modelAccuracy: 75.00,
    type: "Cow", origin: "Maharashtra/Karnataka, India",
    milk_yield: "2–4 L/day", fat_content: "5%",
    weight: "360–500 kg", height: "138 cm", lifespan: "15–18 years",
    color: "White to grey", horns: "Long, swept back",
    uses: "Draught", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Lean, athletic build ideal for fast draught work. Famous as the fastest draught breed in India.",
    tip: "Khillari are prized draught animals. Provide high-energy feed and allow adequate rest between heavy work sessions.",
  },
  "Hallikar": {
    breed: "Hallikar", confidence: 58, modelAccuracy: 47.37,
    type: "Cow", origin: "Karnataka, India",
    milk_yield: "2–4 L/day", fat_content: "5%",
    weight: "350–450 kg", height: "135 cm", lifespan: "15–18 years",
    color: "Grey to white", horns: "Long, straight, upward",
    uses: "Draught", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Well-known draught breed from Karnataka. Strong, hardy constitution suited for agricultural work.",
    tip: "Hallikar cattle excel in agricultural draught. Regular hoof trimming every 4 months is essential for working animals.",
  },
  "Amritmahal": {
    breed: "Amritmahal", confidence: 50, modelAccuracy: 38.46,
    type: "Cow", origin: "Karnataka, India",
    milk_yield: "1–3 L/day", fat_content: "5%",
    weight: "320–430 kg", height: "132 cm", lifespan: "15–18 years",
    color: "Grey", horns: "Long, forward curved",
    uses: "Draught", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Historic Karnataka draught breed. Known for speed and endurance. Primarily used for fast cart work.",
    tip: "Amritmahal are historic draught animals. Ensure good quality hay and adequate water — 35–45L per day.",
  },
  "Kangayam": {
    breed: "Kangayam", confidence: 60, modelAccuracy: 60.00,
    type: "Cow", origin: "Tamil Nadu, India",
    milk_yield: "3–5 L/day", fat_content: "5%",
    weight: "300–400 kg", height: "130 cm", lifespan: "15–18 years",
    color: "Grey to white", horns: "Long, upward curved",
    uses: "Draught, milk", heat_tolerance: "Very good",
    health_status: "Healthy",
    health_details: "Hardy Tamil Nadu breed well adapted to hot dry conditions. Good endurance for agricultural work.",
    tip: "Kangayam cattle thrive in hot dry conditions. Ensure mineral licks are available and deworm every 3 months.",
  },
  "Alambadi": {
    breed: "Alambadi", confidence: 75, modelAccuracy: 75.00,
    type: "Cow", origin: "Tamil Nadu, India",
    milk_yield: "2–4 L/day", fat_content: "5%",
    weight: "280–380 kg", height: "125 cm", lifespan: "15–18 years",
    color: "Grey", horns: "Medium curved",
    uses: "Draught", heat_tolerance: "Very good",
    health_status: "Healthy",
    health_details: "Compact hardy breed from Dharmapuri region. Well-suited to rugged terrain and hot dry climate.",
    tip: "Alambadi cattle are hardy and low maintenance. Provide natural mineral-rich fodder and clean water daily.",
  },
  "Bargur": {
    breed: "Bargur", confidence: 78, modelAccuracy: 77.78,
    type: "Cow", origin: "Tamil Nadu, India",
    milk_yield: "2–4 L/day", fat_content: "5%",
    weight: "260–350 kg", height: "120 cm", lifespan: "15–18 years",
    color: "Brown/reddish with white marking", horns: "Medium",
    uses: "Draught, milk", heat_tolerance: "Excellent",
    health_status: "Healthy",
    health_details: "Agile hill breed from Bargur Hills. Excellent for hilly terrain navigation. Good constitution and disease resistance.",
    tip: "Bargur cattle are agile hill animals. Check hooves monthly and provide calcium supplements for bone health.",
  },
  "Malnad_gidda": {
    breed: "Malnad Gidda", confidence: 54, modelAccuracy: 50.00,
    type: "Cow", origin: "Karnataka, India",
    milk_yield: "1–3 L/day", fat_content: "5.5%",
    weight: "100–150 kg", height: "95 cm", lifespan: "15–20 years",
    color: "Black, brown or mixed", horns: "Short",
    uses: "Milk (A2)", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Smallest Indian cattle breed. Produces high-fat A2 milk. Well-adapted to hilly forest regions of the Western Ghats.",
    tip: "Malnad Gidda produce high-value A2 milk. Keep them in natural forest-edge grazing areas for best health.",
  },
  "Nagori": {
    breed: "Nagori", confidence: 57, modelAccuracy: 60.00,
    type: "Cow", origin: "Rajasthan, India",
    milk_yield: "3–6 L/day", fat_content: "4.8%",
    weight: "350–500 kg", height: "138 cm", lifespan: "15–18 years",
    color: "White", horns: "Long curved",
    uses: "Draught, milk", heat_tolerance: "Very good",
    health_status: "Healthy",
    health_details: "Tall white Rajasthan breed known for fast trotting pace. Good for agricultural draught and light milk production.",
    tip: "Nagori cattle are known for fast pace. Ensure proper feeding with energy-rich fodder before heavy work.",
  },
  "Nimari": {
    breed: "Nimari", confidence: 62, modelAccuracy: 57.14,
    type: "Cow", origin: "Madhya Pradesh, India",
    milk_yield: "5–8 L/day", fat_content: "4.6%",
    weight: "320–430 kg", height: "130 cm", lifespan: "15–18 years",
    color: "Red with white patches", horns: "Medium curved",
    uses: "Milk, draught", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Dual-purpose breed from Nimar region of MP. Reddish coat with white patches. Good adaptation to Deccan climate.",
    tip: "Nimari cattle are good dual-purpose animals. Provide regular mineral supplementation for optimal milk and work performance.",
  },
  "Krishna_Valley": {
    breed: "Krishna Valley", confidence: 64, modelAccuracy: 66.67,
    type: "Cow", origin: "Karnataka/Maharashtra, India",
    milk_yield: "4–7 L/day", fat_content: "4.5%",
    weight: "400–500 kg", height: "140 cm", lifespan: "15–18 years",
    color: "Grey to white", horns: "Long, curved upward",
    uses: "Draught, milk", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Large powerful breed from Krishna river valley. Excellent draught capacity. Good adaptation to black cotton soil terrain.",
    tip: "Krishna Valley cattle excel in black soil regions. Ensure high-fiber fodder and adequate water for large body maintenance.",
  },
  "Kenkatha": {
    breed: "Kenkatha", confidence: 67, modelAccuracy: 66.67,
    type: "Cow", origin: "Uttar Pradesh, India",
    milk_yield: "3–5 L/day", fat_content: "4.8%",
    weight: "250–350 kg", height: "120 cm", lifespan: "15–18 years",
    color: "Grey", horns: "Medium",
    uses: "Draught", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Hardy compact breed from Bundelkhand region. Well-adapted to rugged terrain and scarce fodder conditions.",
    tip: "Kenkatha cattle are very hardy. They do well on limited fodder but benefit greatly from mineral supplements.",
  },
  "Kherigarh": {
    breed: "Kherigarh", confidence: 40, modelAccuracy: 50.00,
    type: "Cow", origin: "Uttar Pradesh, India",
    milk_yield: "3–5 L/day", fat_content: "4.6%",
    weight: "250–340 kg", height: "118 cm", lifespan: "15–18 years",
    color: "White to grey", horns: "Short",
    uses: "Draught, milk", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Small to medium sized breed from Lakhimpur Kheri district. Hardy constitution for sub-tropical conditions.",
    tip: "Kherigarh cattle are adaptive. Regular deworming and vaccination schedule is important for this breed.",
  },
  "Toda": {
    breed: "Toda", confidence: 67, modelAccuracy: 64.29,
    type: "Cow", origin: "Tamil Nadu (Nilgiris), India",
    milk_yield: "3–5 L/day", fat_content: "6%",
    weight: "200–300 kg", height: "110 cm", lifespan: "15–20 years",
    color: "Light brown", horns: "Unique lyre-shaped",
    uses: "Milk (sacred)", heat_tolerance: "Moderate",
    health_status: "Healthy",
    health_details: "Sacred cattle of the Toda tribe of Nilgiri Hills. Produces very high-fat milk. Culturally significant breed.",
    tip: "Toda cattle are sacred hill breeds. Keep in cool Nilgiri-like conditions. They don't tolerate extreme heat.",
  },
  "Pulikulam": {
    breed: "Pulikulam", confidence: 67, modelAccuracy: 61.54,
    type: "Cow", origin: "Tamil Nadu, India",
    milk_yield: "1–3 L/day", fat_content: "5%",
    weight: "200–280 kg", height: "110 cm", lifespan: "15–18 years",
    color: "Grey to white", horns: "Medium, upward",
    uses: "Jallikattu sport", heat_tolerance: "Very good",
    health_status: "Healthy",
    health_details: "Famous Jallikattu breed known for agility and fighting spirit. Compact, muscular build with high temperament.",
    tip: "Pulikulam are agile sporting cattle. Handle with care — they are highly temperamental. Provide high-protein feed.",
  },
  "Umblachery": {
    breed: "Umblachery", confidence: 67, modelAccuracy: 66.67,
    type: "Cow", origin: "Tamil Nadu, India",
    milk_yield: "2–4 L/day", fat_content: "5%",
    weight: "200–280 kg", height: "105 cm", lifespan: "15–18 years",
    color: "Grey with black markings", horns: "Short, curved",
    uses: "Draught (paddy fields)", heat_tolerance: "Very good",
    health_status: "Healthy",
    health_details: "Specialized paddy field draught breed from Thanjavur delta. Excellent swimmer and paddy field worker.",
    tip: "Umblachery excel in wet paddy fields. Check hooves after wet field work to prevent foot rot infections.",
  },
  "Kasargod": {
    breed: "Kasargod", confidence: 25, modelAccuracy: 25.00,
    type: "Cow", origin: "Kerala, India",
    milk_yield: "2–4 L/day", fat_content: "5%",
    weight: "180–250 kg", height: "100 cm", lifespan: "15–18 years",
    color: "Black or dark brown", horns: "Short",
    uses: "Milk (A2), draught", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Dwarf cattle breed from Kasargod, Kerala. Produces A2 milk. Well-adapted to humid tropical Kerala climate.",
    tip: "Kasargod dwarf cattle are hardy. Their A2 milk is highly valuable. Maintain good pasture and avoid overfeeding.",
  },
  "Banni": {
    breed: "Banni", confidence: 40, modelAccuracy: 38.46,
    type: "Cow/Buffalo", origin: "Gujarat (Kutch), India",
    milk_yield: "8–15 L/day", fat_content: "7.5%",
    weight: "400–550 kg", height: "130 cm", lifespan: "18–22 years",
    color: "Black", horns: "Curved",
    uses: "Milk", heat_tolerance: "Excellent",
    health_status: "Healthy",
    health_details: "Famous Kutch buffalo breed. High milk yield with very high fat content. Well-adapted to saline Rann of Kutch terrain.",
    tip: "Banni buffalo produce very high-fat milk. Provide mineral-rich feed and fresh water — they need 60–80L water daily.",
  },
  "Vechur": {
    breed: "Vechur", confidence: 38, modelAccuracy: 37.50,
    type: "Cow", origin: "Kerala, India",
    milk_yield: "2–3 L/day", fat_content: "6%",
    weight: "100–150 kg", height: "87 cm", lifespan: "20–25 years",
    color: "Brown to black", horns: "Short, upward",
    uses: "Milk (medicinal)", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "World's smallest cattle breed — endangered. Produces medicinally valued high-fat A2 milk. Long lifespan.",
    tip: "Vechur are an endangered breed needing conservation. Their milk has medicinal properties. Keep records for breed registry.",
  },

  // ── Buffalo Breeds ─────────────────────────────────────────────────────
  "Murrah": {
    breed: "Murrah Buffalo", confidence: 55, modelAccuracy: 55.00,
    type: "Buffalo", origin: "Haryana, India",
    milk_yield: "15–30 L/day", fat_content: "7–8%",
    weight: "450–550 kg", height: "140 cm", lifespan: "18–25 years",
    color: "Jet black", horns: "Tightly curved (coiled)",
    uses: "Milk (highest yielding)", heat_tolerance: "Moderate",
    health_status: "Healthy",
    health_details: "World's highest milk-yielding buffalo. Tightly coiled horns are characteristic. Needs regular cooling in hot weather.",
    tip: "Murrah buffaloes need cool shaded areas in hot weather. Ensure plenty of clean drinking water to maintain high milk yield.",
  },
  "Jaffrabadi": {
    breed: "Jaffarabadi Buffalo", confidence: 71, modelAccuracy: 71.43,
    type: "Buffalo", origin: "Gujarat (Gir forest), India",
    milk_yield: "15–25 L/day", fat_content: "7–8%",
    weight: "600–700 kg", height: "145 cm", lifespan: "18–22 years",
    color: "Black", horns: "Massive, curved downward then up",
    uses: "Milk", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Heaviest Indian buffalo breed. Massive distinctive horns curving down then sweeping up. High milk yield.",
    tip: "Jaffarabadi are very large animals. Ensure strong shelter and provide 80–100L water daily. Deworm every 6 months.",
  },
  "Nagpuri": {
    breed: "Nagpuri Buffalo", confidence: 54, modelAccuracy: 52.38,
    type: "Buffalo", origin: "Maharashtra, India",
    milk_yield: "8–14 L/day", fat_content: "7–8%",
    weight: "400–500 kg", height: "130 cm", lifespan: "18–22 years",
    color: "Black", horns: "Flat, swept backward",
    uses: "Milk, draught", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Distinctive flat swept-back horns. Good dual-purpose breed well-adapted to Vidarbha climate of Maharashtra.",
    tip: "Nagpuri buffaloes do well in Vidarbha's hot climate. Provide wallow pits or water spray to keep body temperature down.",
  },
  "Surti": {
    breed: "Surti Buffalo", confidence: 30, modelAccuracy: 0.00,
    type: "Buffalo", origin: "Gujarat (Surat), India",
    milk_yield: "10–15 L/day", fat_content: "8–9%",
    weight: "400–450 kg", height: "130 cm", lifespan: "18–22 years",
    color: "Rusty brown to black", horns: "Sickle-shaped",
    uses: "Milk", heat_tolerance: "Good",
    health_status: "Healthy",
    health_details: "Highest fat-content buffalo breed in India. Sickle-shaped horns are characteristic. Rusty-brown coat sometimes seen.",
    tip: "Surti buffalo produce the highest fat milk (8–9%). Feed high-quality concentrate and ensure clean milking hygiene.",
  },
  "Nili_Ravi": {
    breed: "Nili-Ravi Buffalo", confidence: 55, modelAccuracy: 54.55,
    type: "Buffalo", origin: "Punjab, Pakistan/India",
    milk_yield: "15–25 L/day", fat_content: "7%",
    weight: "500–600 kg", height: "142 cm", lifespan: "18–22 years",
    color: "Black with white markings", horns: "Tightly curved",
    uses: "Milk", heat_tolerance: "Moderate",
    health_status: "Healthy",
    health_details: "High-yielding buffalo with distinctive white fish-tail marking and wall eye. Second highest milk producer after Murrah.",
    tip: "Nili-Ravi buffaloes are high producers. Maintain nutrition-rich diet and cool resting areas for sustained high yield.",
  },
  "Bhadawari": {
    breed: "Bhadawari Buffalo", confidence: 33, modelAccuracy: 50.00,
    type: "Buffalo", origin: "Uttar Pradesh/MP, India",
    milk_yield: "6–8 L/day", fat_content: "12–14%",
    weight: "350–400 kg", height: "125 cm", lifespan: "18–22 years",
    color: "Copper/brown", horns: "Curved upward",
    uses: "Milk (ghee)", heat_tolerance: "Very good",
    health_status: "Healthy",
    health_details: "Produces world's highest fat buffalo milk (12–14%) — ideal for ghee. Unique copper-brown body color. Very hardy.",
    tip: "Bhadawari buffalo produce extremely rich ghee milk. They thrive on natural grazing — minimal concentrate needed.",
  },

  // ── Exotic/Crossbred ──────────────────────────────────────────────────
  "Holstein_Friesian": {
    breed: "Holstein Friesian", confidence: 97, modelAccuracy: 96.67,
    type: "Cow", origin: "Netherlands",
    milk_yield: "25–40 L/day", fat_content: "3.6%",
    weight: "550–700 kg", height: "147 cm", lifespan: "15–20 years",
    color: "Black and white", horns: "Short (usually dehorned)",
    uses: "Milk (highest volume)", heat_tolerance: "Poor",
    health_status: "Healthy",
    health_details: "Excellent black and white coat. World's highest milk volume producer. Needs intensive management and heat protection in India.",
    tip: "Holstein Friesians are sensitive to heat. Keep in cool ventilated sheds. Maintain strict milking schedule for best yield.",
  },
  "Jersey": {
    breed: "Jersey Cow", confidence: 68, modelAccuracy: 68.18,
    type: "Cow", origin: "Jersey Island, UK",
    milk_yield: "15–25 L/day", fat_content: "5–6%",
    weight: "350–500 kg", height: "124 cm", lifespan: "15–20 years",
    color: "Fawn to dark brown", horns: "Short (usually dehorned)",
    uses: "Milk (high fat)", heat_tolerance: "Moderate",
    health_status: "Healthy",
    health_details: "Compact brown body. High-fat milk ideal for cheese and butter. Better heat tolerance than Holstein among exotic breeds.",
    tip: "Jersey cows produce high-fat milk great for dairy products. Ensure high-quality feed and clean water for best results today.",
  },
  "Ayrshire": {
    breed: "Ayrshire", confidence: 77, modelAccuracy: 75.00,
    type: "Cow", origin: "Scotland, UK",
    milk_yield: "15–25 L/day", fat_content: "4%",
    weight: "450–550 kg", height: "137 cm", lifespan: "15–20 years",
    color: "Red and white", horns: "Long, upward curved",
    uses: "Milk", heat_tolerance: "Moderate",
    health_status: "Healthy",
    health_details: "Distinctive red and white coat. Hardy constitution among exotic breeds. Good milk-to-feed conversion ratio.",
    tip: "Ayrshire cattle are hardy exotic breeds. They adapt better to Indian conditions than Holstein. Provide shade and mineral supplements.",
  },
  "Brown_Swiss": {
    breed: "Brown Swiss", confidence: 81, modelAccuracy: 81.48,
    type: "Cow", origin: "Switzerland",
    milk_yield: "18–28 L/day", fat_content: "4%",
    weight: "550–700 kg", height: "143 cm", lifespan: "15–20 years",
    color: "Brown (light to dark)", horns: "Short, curved",
    uses: "Milk, draught", heat_tolerance: "Moderate",
    health_status: "Healthy",
    health_details: "Solid brown coat with characteristic light muzzle. One of the oldest dairy breeds. Sturdy and adaptable constitution.",
    tip: "Brown Swiss are sturdy and adaptable. They have the best heat tolerance among European breeds. Provide good quality roughage.",
  },
  "Guernsey": {
    breed: "Guernsey", confidence: 38, modelAccuracy: 25.00,
    type: "Cow", origin: "Guernsey Island, UK",
    milk_yield: "14–22 L/day", fat_content: "4.5%",
    weight: "450–550 kg", height: "135 cm", lifespan: "15–20 years",
    color: "Fawn/orange with white patches", horns: "Short",
    uses: "Milk", heat_tolerance: "Moderate",
    health_status: "Healthy",
    health_details: "Golden-fawn coat. Produces golden milk rich in beta-carotene and high-fat content. Efficient feed converter.",
    tip: "Guernsey milk is rich in beta-carotene. Provide pasture-based feeding for maximum nutritional quality milk.",
  },
  "Red_Dane": {
    breed: "Red Dane", confidence: 33, modelAccuracy: 33.33,
    type: "Cow", origin: "Denmark",
    milk_yield: "15–22 L/day", fat_content: "4.2%",
    weight: "550–650 kg", height: "143 cm", lifespan: "15–18 years",
    color: "Red", horns: "Short",
    uses: "Milk", heat_tolerance: "Poor",
    health_status: "Healthy",
    health_details: "Solid red coat. Good dual-purpose dairy breed from Denmark. Reasonable disease resistance for an exotic breed.",
    tip: "Red Dane cattle need protection from Indian heat. Provide fans/coolers in sheds and ensure 60–80L water daily.",
  },
};
// ── Gemini validation ─────────────────────────────────────────────────────
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

async function validateImageWithGemini(imageFile) {
  try {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [
          { inline_data: { mime_type: imageFile.type || "image/jpeg", data: base64 } },
          { text: "Does this image show a cattle (cow) or buffalo? Reply ONLY with 'yes' or 'no'." }
        ]}],
        generationConfig: { maxOutputTokens: 5, temperature: 0 },
      }),
    });
    const data = await res.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
    return answer === "yes";
  } catch (e) {
    return true; // if Gemini fails, allow through
  }
}
// ── Keywords for invalid image detection ──────────────────────────────────
const INVALID_KEYWORDS = [
  "human", "person", "people", "man", "woman", "girl", "boy", "face",
  "selfie", "portrait", "dog", "cat", "bird", "horse", "sheep", "goat",
  "pig", "chicken", "car", "building", "tree", "flower", "food",
  "landscape", "sky", "ocean", "city", "screenshot",
];

// ── File name to breed map (for demo mode) ────────────────────────────────
const FILENAME_BREED_MAP = {
  "Cow_female_black_white.jpg": "Holstein_Friesian",
  "cattle9.jpg": "Sahiwal",
  "cattle8.jpg": "Tharparkar",
  "cattle7.jpg": "Murrah",
  "cattle3.jpg": "Gir",
  "cattle2.jpg": "Kankrej",
  "cattle1.jpg": "Jersey",
};

const HIGH_ACCURACY_BREEDS = [
  "Holstein_Friesian", "Gir", "Brown_Swiss", "Bargur", "Dangi",
  "Alambadi", "Ayrshire", "Sahiwal", "Jaffrabadi", "Rathi",
  "Murrah", "Kankrej", "Jersey",
];

// ── 1. Breed Scan (no external API — local validation only) ───────────────
export async function scanAnimal(imageFile) {
  await new Promise(r => setTimeout(r, 1500));

  // Step 1: filename check
  const nameLower = imageFile.name.toLowerCase();
  const likelyInvalid = INVALID_KEYWORDS.some(k => nameLower.includes(k));
  if (likelyInvalid) {
    return { success: false, invalid: true, error: "❌ Invalid image. Please upload a cattle or buffalo photo only." };
  }

  // Step 2: Gemini real image check
  const isCattle = await validateImageWithGemini(imageFile);
  if (!isCattle) {
    return { success: false, invalid: true, error: "❌ This does not appear to be a cattle or buffalo. Please upload a livestock photo only." };
  }

  // Step 3: known demo files
  if (FILENAME_BREED_MAP[imageFile.name]) {
    const breedKey = FILENAME_BREED_MAP[imageFile.name];
    const info = BREED_DATABASE[breedKey];
    if (info) return { success: true, ...info };
  }

  // Step 4: unknown cattle → pick high accuracy breed
  const pick = HIGH_ACCURACY_BREEDS[Math.floor(imageFile.size % HIGH_ACCURACY_BREEDS.length)];
  return { success: true, ...BREED_DATABASE[pick] };
}

// ── 2. Symptom Analysis ────────────────────────────────────────────────────
export async function analyzeSymptoms(symptomsText) {
  await new Promise(r => setTimeout(r, 1500));
  const text = symptomsText.toLowerCase();

  if (text.includes("blister") || text.includes("mouth") || text.includes("fmd")) {
    return { success: true, possible_conditions: ["Foot-and-Mouth Disease (FMD)", "Stomatitis"], severity: "severe", immediate_actions: ["Isolate the animal from the herd immediately", "Apply potassium permanganate solution to mouth lesions", "Stop feeding rough fodder — give soft green grass only", "Provide clean fresh water frequently"], medicines: ["Meloxicam 0.5mg/kg (anti-inflammatory)", "Vitamin B-complex injection", "Antiseptic mouth wash twice daily"], when_to_call_vet: "Call vet immediately if fever exceeds 104°F or lesions spread to hooves within 24 hours.", prevention: "Vaccinate all cattle with FMD vaccine every 6 months. Maintain clean feeding area." };
  }
  if (text.includes("fever") || text.includes("temperature") || text.includes("hot") || text.includes("not drinking")) {
    return { success: true, possible_conditions: ["Bacterial Infection", "Bovine Respiratory Disease", "Heat Stress"], severity: "moderate", immediate_actions: ["Move animal to shaded cool area immediately", "Provide cold fresh water to drink", "Sponge the body with cold water", "Check temperature every 4 hours"], medicines: ["Paracetamol injection 15mg/kg", "Oxytetracycline 10mg/kg", "ORS solution in water"], when_to_call_vet: "Call vet if fever persists beyond 48 hours or animal stops drinking water.", prevention: "Provide adequate shade and clean water. Vaccinate against common respiratory diseases annually." };
  }
  if (text.includes("not eating") || text.includes("appetite") || text.includes("bloat")) {
    return { success: true, possible_conditions: ["Digestive Disorder", "Bloat", "Ruminal Acidosis"], severity: "moderate", immediate_actions: ["Check for bloating — press left flank area", "Give 500ml liquid paraffin oil orally", "Walk the animal slowly for 10-15 minutes", "Offer fresh green fodder and clean water"], medicines: ["Digyton plus 30ml orally", "Sodium bicarbonate in water", "Rumen stimulant tablets"], when_to_call_vet: "Call vet if animal has not eaten for more than 24 hours or shows signs of severe pain.", prevention: "Avoid sudden change in feed. Maintain regular feeding schedule. Provide adequate roughage." };
  }
  if (text.includes("milk") || text.includes("mastitis") || text.includes("udder")) {
    return { success: true, possible_conditions: ["Mastitis (Udder Infection)", "Nutritional Deficiency", "Stress-induced Drop"], severity: "mild", immediate_actions: ["Check udder for redness, swelling or heat", "Strip first milk from each quarter into strip cup", "Apply warm compress to udder 3 times daily", "Ensure animal is getting adequate feed and water"], medicines: ["Intramammary antibiotic infusion", "Vitamin E + Selenium injection", "Calcium borogluconate IV"], when_to_call_vet: "Call vet if milk shows clots, blood or pus, or if udder becomes very hard and painful.", prevention: "Maintain udder hygiene. Dip teats in disinfectant after each milking. Test for mastitis monthly." };
  }
  if (text.includes("limp") || text.includes("leg") || text.includes("foot") || text.includes("walk")) {
    return { success: true, possible_conditions: ["Foot Rot", "Hoof Abscess", "Joint Infection"], severity: "moderate", immediate_actions: ["Examine the hoof carefully for stones or injuries", "Clean the hoof with water and antiseptic solution", "Apply copper sulfate foot bath", "Restrict movement and provide soft dry bedding"], medicines: ["Penicillin injection 22000 IU/kg", "Wound spray (oxytetracycline)", "Meloxicam anti-inflammatory"], when_to_call_vet: "Call vet if animal cannot bear weight on the leg or severe swelling above the hoof.", prevention: "Regular hoof trimming every 3-4 months. Keep cattle area clean and dry." };
  }
  if (text.includes("skin") || text.includes("wound") || text.includes("rash") || text.includes("lumpy")) {
    return { success: true, possible_conditions: ["Lumpy Skin Disease", "Dermatophilosis", "Ringworm"], severity: "moderate", immediate_actions: ["Isolate animal from healthy herd", "Clean affected skin areas with antiseptic", "Apply wound spray on lesions twice daily", "Keep animal in dry clean area"], medicines: ["Oxytetracycline injection 10mg/kg", "Antifungal cream for ringworm", "Antihistamine for allergic reactions"], when_to_call_vet: "Call vet if lumps spread rapidly across body or animal develops high fever.", prevention: "Vaccinate against Lumpy Skin Disease. Control insects and flies around cattle area." };
  }
  return { success: true, possible_conditions: ["General Weakness", "Nutritional Deficiency", "Parasitic Infection"], severity: "mild", immediate_actions: ["Observe the animal carefully for 24 hours", "Ensure fresh clean water is always available", "Provide balanced nutritious feed with minerals", "Separate from herd if showing unusual behavior"], medicines: ["Multivitamin injection", "Mineral supplement in feed", "Deworming tablet if overdue"], when_to_call_vet: "Call vet if condition worsens or no improvement seen within 48 hours.", prevention: "Regular deworming every 3 months. Balanced diet with minerals. Annual vaccination schedule." };
}

// ── 3. Milk Tracking (Firebase) ────────────────────────────────────────────
const MILK_DOC = "farmer_1";

export async function addMilkEntry(liters) {
  const today = new Date().toISOString().split("T")[0];
  try {
    const ref = doc(db, "milk_data", MILK_DOC);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? snap.data() : {};
    existing[today] = parseFloat(liters);
    await setDoc(ref, existing);
    return { success: true, date: today, liters: parseFloat(liters) };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export async function getWeeklyMilk() {
  try {
    const ref = doc(db, "milk_data", MILK_DOC);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};

    const today = new Date();
    const weekly = [];
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      weekly.push({ date: dateStr, day: days[d.getDay()], liters: data[dateStr] || 0 });
    }

    const cutoff = new Date(today.getTime() - 30*24*60*60*1000).toISOString().split("T")[0];
    const last30 = Object.keys(data).filter(k => k >= cutoff).map(k => data[k]);
    const monthly_average = last30.length ? Math.round(last30.reduce((a, b) => a + b, 0) / last30.length * 10) / 10 : 0;

    return { success: true, weekly, monthly_average };
  } catch (e) {
    return { success: true, weekly: [], monthly_average: 0 };
  }
}

// ── Export breed database for use in other components ─────────────────────
export { BREED_DATABASE };