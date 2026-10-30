import { Language } from './types';

export const DEFAULT_CROPS: string[] = [
  'Tomatoes',
  'Onions',
  'Green Chilli',
  'Guntur Red Chilli',
  'Paddy (BPT-5204)',
  'Turmeric',
  'Groundnut',
  'Cotton',
];

export const CROP_TRANSLATIONS: Record<string, { en: string; te: string }> = {
  Tomatoes: { en: 'Tomatoes', te: 'టమాటాలు (Tomatoes)' },
  Tomato: { en: 'Tomato', te: 'టమాటా (Tomato)' },
  'Guntur Red Chilli': { en: 'Guntur Red Chilli', te: 'గుంటూరు ఎండు మిర్చి (Red Chilli)' },
  'Red Chilli': { en: 'Red Chilli', te: 'ఎండు మిర్చి (Red Chilli)' },
  Onions: { en: 'Onions', te: 'ఉల్లిపాయలు (Onions)' },
  Onion: { en: 'Onion', te: 'ఉల్లిపాయ (Onion)' },
  'Paddy (BPT-5204)': { en: 'Paddy (BPT-5204)', te: 'వరి ధాన్యం (Paddy BPT-5204)' },
  Paddy: { en: 'Paddy', te: 'వరి ధాన్యం (Paddy)' },
  Rice: { en: 'Rice', te: 'బియ్యం / వరి (Rice)' },
  Turmeric: { en: 'Turmeric', te: 'పసుపు (Turmeric)' },
  'Green Chilli': { en: 'Green Chilli', te: 'పచ్చి మిర్చి (Green Chilli)' },
  Chilli: { en: 'Chilli', te: 'మిర్చి (Chilli)' },
  Chillies: { en: 'Chillies', te: 'మిరపకాయలు (Chillies)' },
  Cotton: { en: 'Cotton', te: 'పత్తి (Cotton)' },
  Groundnut: { en: 'Groundnut', te: 'వేరుశెనగ (Groundnut)' },
  Peanut: { en: 'Peanut', te: 'వేరుశెనగ (Peanut)' },
  Potatoes: { en: 'Potatoes', te: 'బంగాళాదుంపలు (Potatoes)' },
  Potato: { en: 'Potato', te: 'బంగాళాదుంప (Potato)' },
  Brinjal: { en: 'Brinjal', te: 'వంకాయలు (Brinjal)' },
  Eggplant: { en: 'Eggplant', te: 'వంకాయలు (Eggplant)' },
  Okra: { en: 'Okra', te: 'బెండకాయలు (Okra)' },
  'Ladies Finger': { en: 'Ladies Finger', te: 'బెండకాయలు (Ladies Finger)' },
  'Lady Finger': { en: 'Lady Finger', te: 'బెండకాయలు (Lady Finger)' },
  Bhendi: { en: 'Bhendi', te: 'బెండకాయలు (Bhendi)' },
  Cabbage: { en: 'Cabbage', te: 'క్యాబేజీ (Cabbage)' },
  Cauliflower: { en: 'Cauliflower', te: 'కాలీఫ్లవర్ (Cauliflower)' },
  Carrot: { en: 'Carrot', te: 'క్యారెట్ (Carrot)' },
  Carrots: { en: 'Carrots', te: 'క్యారెట్లు (Carrots)' },
  Beetroot: { en: 'Beetroot', te: 'బీట్‌రూట్ (Beetroot)' },
  Radish: { en: 'Radish', te: 'ముల్లంగి (Radish)' },
  Cucumber: { en: 'Cucumber', te: 'దోసకాయ (Cucumber)' },
  Capsicum: { en: 'Capsicum', te: 'క్యాప్సికమ్ / బెంగళూరు మిర్చి (Capsicum)' },
  'Bell Pepper': { en: 'Bell Pepper', te: 'క్యాప్సికమ్ (Bell Pepper)' },
  Drumstick: { en: 'Drumstick', te: 'మునగకాయ (Drumstick)' },
  Drumsticks: { en: 'Drumsticks', te: 'మునగకాయలు (Drumsticks)' },
  'Bitter Gourd': { en: 'Bitter Gourd', te: 'కాకరకాయ (Bitter Gourd)' },
  'Bottle Gourd': { en: 'Bottle Gourd', te: 'సొరకాయ (Bottle Gourd)' },
  'Ridge Gourd': { en: 'Ridge Gourd', te: 'బీరకాయ (Ridge Gourd)' },
  'Snake Gourd': { en: 'Snake Gourd', te: 'పొట్లకాయ (Snake Gourd)' },
  'Ivy Gourd': { en: 'Ivy Gourd', te: 'దొండకాయ (Ivy Gourd)' },
  Tindora: { en: 'Tindora', te: 'దొండకాయ (Tindora)' },
  'Ash Gourd': { en: 'Ash Gourd', te: 'బూడిద గుమ్మడికాయ (Ash Gourd)' },
  Pumpkin: { en: 'Pumpkin', te: 'గుమ్మడికాయ (Pumpkin)' },
  Beans: { en: 'Beans', te: 'బీన్స్ / చిక్కుడుకాయలు (Beans)' },
  'French Beans': { en: 'French Beans', te: 'ఫ్రెంచ్ బీన్స్ (French Beans)' },
  'Cluster Beans': { en: 'Cluster Beans', te: 'గోరుచిక్కుడు (Cluster Beans)' },
  'Broad Beans': { en: 'Broad Beans', te: 'చిక్కుడుకాయలు (Broad Beans)' },
  Peas: { en: 'Peas', te: 'బఠానీలు (Peas)' },
  'Green Peas': { en: 'Green Peas', te: 'పచ్చి బఠానీలు (Green Peas)' },
  'Sweet Potato': { en: 'Sweet Potato', te: 'చిలగడదుంప (Sweet Potato)' },
  Tapioca: { en: 'Tapioca', te: 'కర్రపెండలం (Tapioca)' },
  Yam: { en: 'Yam', te: 'కందగడ్డ (Yam)' },
  Colocasia: { en: 'Colocasia', te: 'చామగడ్డ (Colocasia)' },
  Taro: { en: 'Taro', te: 'చామగడ్డ (Taro)' },
  Spinach: { en: 'Spinach', te: 'పాలకూర (Spinach)' },
  Amaranth: { en: 'Amaranth', te: 'తోటకూర (Amaranth)' },
  Gongura: { en: 'Gongura', te: 'గోంగూర (Gongura)' },
  Sorrel: { en: 'Sorrel', te: 'గోంగూర (Sorrel)' },
  Mint: { en: 'Mint', te: 'పుదీనా (Mint)' },
  Fenugreek: { en: 'Fenugreek', te: 'మెంతులు / మెంతికూర (Fenugreek)' },
  Methi: { en: 'Methi', te: 'మెంతికూర (Methi)' },
  'Curry Leaves': { en: 'Curry Leaves', te: 'కరివేపాకు (Curry Leaves)' },
  Coriander: { en: 'Coriander', te: 'కొత్తిమీర / ధనియాలు (Coriander)' },
  Garlic: { en: 'Garlic', te: 'వెల్లుల్లి (Garlic)' },
  Ginger: { en: 'Ginger', te: 'అల్లం (Ginger)' },
  Tamarind: { en: 'Tamarind', te: 'చింతపండు (Tamarind)' },
  Mango: { en: 'Mango', te: 'మామిడి (Mango)' },
  Mangoes: { en: 'Mangoes', te: 'మామిడి పండ్లు (Mangoes)' },
  Banana: { en: 'Banana', te: 'అరటి (Banana)' },
  Bananas: { en: 'Bananas', te: 'అరటి పండ్లు (Bananas)' },
  Papaya: { en: 'Papaya', te: 'బొప్పాయి (Papaya)' },
  Guava: { en: 'Guava', te: 'జామకాయ (Guava)' },
  Watermelon: { en: 'Watermelon', te: 'పుచ్చకాయ (Watermelon)' },
  Muskmelon: { en: 'Muskmelon', te: 'కర్బూజ (Muskmelon)' },
  Pomegranate: { en: 'Pomegranate', te: 'దానిమ్మ (Pomegranate)' },
  Apple: { en: 'Apple', te: 'ఆపిల్ (Apple)' },
  Apples: { en: 'Apples', te: 'ఆపిల్ పండ్లు (Apples)' },
  'Custard Apple': { en: 'Custard Apple', te: 'సీతాఫలం (Custard Apple)' },
  Sapota: { en: 'Sapota', te: 'సపోటా (Sapota)' },
  Chikoo: { en: 'Chikoo', te: 'సపోటా (Chikoo)' },
  Pineapple: { en: 'Pineapple', te: 'అనాస పండు (Pineapple)' },
  Jackfruit: { en: 'Jackfruit', te: 'పనస పండు (Jackfruit)' },
  Grapes: { en: 'Grapes', te: 'ద్రాక్ష (Grapes)' },
  Grape: { en: 'Grape', te: 'ద్రాక్ష (Grape)' },
  Orange: { en: 'Orange', te: 'నారింజ (Orange)' },
  Oranges: { en: 'Oranges', te: 'నారింజ పండ్లు (Oranges)' },
  'Sweet Lime': { en: 'Sweet Lime', te: 'బత్తాయి (Sweet Lime)' },
  Mosambi: { en: 'Mosambi', te: 'బత్తాయి (Mosambi)' },
  Lemon: { en: 'Lemon', te: 'నిమ్మకాయలు (Lemon)' },
  Lemons: { en: 'Lemons', te: 'నిమ్మకాయలు (Lemons)' },
  Lime: { en: 'Lime', te: 'నిమ్మకాయ (Lime)' },
  Coconut: { en: 'Coconut', te: 'కొబ్బరి (Coconut)' },
  Coconuts: { en: 'Coconuts', te: 'కొబ్బరికాయలు (Coconuts)' },
  Fig: { en: 'Fig', te: 'అంజీర (Fig)' },
  'Dragon Fruit': { en: 'Dragon Fruit', te: 'డ్రాగన్ ఫ్రూట్ (Dragon Fruit)' },
  Strawberry: { en: 'Strawberry', te: 'స్ట్రాబెర్రీ (Strawberry)' },
  Amla: { en: 'Amla', te: 'ఉసిరికాయ (Amla)' },
  Gooseberry: { en: 'Gooseberry', te: 'ఉసిరికాయ (Gooseberry)' },
  Jamun: { en: 'Jamun', te: 'నేరేడు పండు (Jamun)' },
  Maize: { en: 'Maize', te: 'మొక్కజొన్న (Maize)' },
  Corn: { en: 'Corn', te: 'మొక్కజొన్న (Corn)' },
  'Sweet Corn': { en: 'Sweet Corn', te: 'స్వీట్ కార్న్ / తీపి మొక్కజొన్న (Sweet Corn)' },
  Wheat: { en: 'Wheat', te: 'గోధుమలు (Wheat)' },
  Jowar: { en: 'Jowar', te: 'జొన్నలు (Jowar)' },
  Sorghum: { en: 'Sorghum', te: 'జొన్నలు (Sorghum)' },
  Bajra: { en: 'Bajra', te: 'సజ్జలు (Bajra)' },
  'Pearl Millet': { en: 'Pearl Millet', te: 'సజ్జలు (Pearl Millet)' },
  Ragi: { en: 'Ragi', te: 'రాగులు / చోళ్లు (Ragi)' },
  'Finger Millet': { en: 'Finger Millet', te: 'రాగులు (Finger Millet)' },
  'Foxtail Millet': { en: 'Foxtail Millet', te: 'కొర్రలు (Foxtail Millet)' },
  Millet: { en: 'Millet', te: 'చిరుధాన్యాలు (Millet)' },
  Millets: { en: 'Millets', te: 'చిరుధాన్యాలు (Millets)' },
  Sugarcane: { en: 'Sugarcane', te: 'చెరుకు (Sugarcane)' },
  'Black Gram': { en: 'Black Gram', te: 'మినుములు (Black Gram)' },
  Urad: { en: 'Urad', te: 'మినుములు (Urad)' },
  'Red Gram': { en: 'Red Gram', te: 'కందులు (Red Gram)' },
  Toor: { en: 'Toor', te: 'కందులు (Toor)' },
  'Pigeon Pea': { en: 'Pigeon Pea', te: 'కందులు (Pigeon Pea)' },
  'Green Gram': { en: 'Green Gram', te: 'పెసలు (Green Gram)' },
  Moong: { en: 'Moong', te: 'పెసలు (Moong)' },
  'Bengal Gram': { en: 'Bengal Gram', te: 'శనగలు (Bengal Gram)' },
  Chickpea: { en: 'Chickpea', te: 'శనగలు (Chickpea)' },
  Chickpeas: { en: 'Chickpeas', te: 'శనగలు (Chickpeas)' },
  Chana: { en: 'Chana', te: 'శనగలు (Chana)' },
  'Horse Gram': { en: 'Horse Gram', te: 'ఉలవలు (Horse Gram)' },
  Cowpea: { en: 'Cowpea', te: 'అలసందలు / బొబ్బర్లు (Cowpea)' },
  Lentil: { en: 'Lentil', te: 'మసూర్ పప్పు (Lentil)' },
  Sunflower: { en: 'Sunflower', te: 'పొద్దుతిరుగుడు (Sunflower)' },
  Soybean: { en: 'Soybean', te: 'సోయాబీన్ (Soybean)' },
  Sesame: { en: 'Sesame', te: 'నువ్వులు (Sesame)' },
  Gingelly: { en: 'Gingelly', te: 'నువ్వులు (Gingelly)' },
  Mustard: { en: 'Mustard', te: 'ఆవాలు (Mustard)' },
  Castor: { en: 'Castor', te: 'ఆముదాలు (Castor)' },
  'Oil Palm': { en: 'Oil Palm', te: 'ఆయిల్ పామ్ (Oil Palm)' },
  Cashew: { en: 'Cashew', te: 'జీడిపప్పు (Cashew)' },
  'Cashew Nut': { en: 'Cashew Nut', te: 'జీడిపప్పు (Cashew Nut)' },
  Arecanut: { en: 'Arecanut', te: 'పోక / వక్క (Arecanut)' },
  Cardamom: { en: 'Cardamom', te: 'యాలకులు (Cardamom)' },
  'Black Pepper': { en: 'Black Pepper', te: 'మిరియాలు (Black Pepper)' },
  Pepper: { en: 'Pepper', te: 'మిరియాలు (Pepper)' },
  Cloves: { en: 'Cloves', te: 'లవంగాలు (Cloves)' },
  Cinnamon: { en: 'Cinnamon', te: 'దాల్చిన చెక్క (Cinnamon)' },
  Cumin: { en: 'Cumin', te: 'జీలకర్ర (Cumin)' },
  Ajwain: { en: 'Ajwain', te: 'వాము (Ajwain)' },
  Coffee: { en: 'Coffee', te: 'కాఫీ గింజలు (Coffee)' },
  Tea: { en: 'Tea', te: 'తేయాకు (Tea)' },
  Tobacco: { en: 'Tobacco', te: 'పొగాకు (Tobacco)' },
  Jute: { en: 'Jute', te: 'జనపనార (Jute)' },
  Mushroom: { en: 'Mushroom', te: 'పుట్టగొడుగులు (Mushroom)' },
  Mushrooms: { en: 'Mushrooms', te: 'పుట్టగొడుగులు (Mushrooms)' },
  Broccoli: { en: 'Broccoli', te: 'బ్రోకలీ (Broccoli)' },
  Lettuce: { en: 'Lettuce', te: 'లెట్యూస్ ఆకుకూర (Lettuce)' },
  Zucchini: { en: 'Zucchini', te: 'జుకినీ (Zucchini)' },
  Avocado: { en: 'Avocado', te: 'అవకాడో (Avocado)' },
  Kiwi: { en: 'Kiwi', te: 'కివీ పండు (Kiwi)' },
  Litchi: { en: 'Litchi', te: 'లిచీ పండు (Litchi)' },
  Pear: { en: 'Pear', te: 'బేరి పండు (Pear)' },
  Plum: { en: 'Plum', te: 'రేగు / ప్లమ్ (Plum)' },
  Peach: { en: 'Peach', te: 'పీచ్ పండు (Peach)' },
  Dates: { en: 'Dates', te: 'ఖర్జూరం (Dates)' },
  Almond: { en: 'Almond', te: 'బాదం (Almond)' },
  Walnut: { en: 'Walnut', te: 'వాల్‌నట్ (Walnut)' },
  Marigold: { en: 'Marigold', te: 'బంతి పూలు (Marigold)' },
  Jasmine: { en: 'Jasmine', te: 'మల్లె పూలు (Jasmine)' },
  Rose: { en: 'Rose', te: 'గులాబీ పూలు (Rose)' },
  Chrysanthemum: { en: 'Chrysanthemum', te: 'చామంతి పూలు (Chrysanthemum)' },
  Crossandra: { en: 'Crossandra', te: 'కనకాంబరాలు (Crossandra)' },
  Lotus: { en: 'Lotus', te: 'తామర పూలు (Lotus)' },
  'Aloe Vera': { en: 'Aloe Vera', te: 'కలబంద (Aloe Vera)' },
  Tulsi: { en: 'Tulsi', te: 'తులసి (Tulsi)' },
  Moringa: { en: 'Moringa', te: 'మునగ (Moringa)' },
  Neem: { en: 'Neem', te: 'వేప (Neem)' },
  Ashwagandha: { en: 'Ashwagandha', te: 'అశ్వగంధ (Ashwagandha)' },
};

export const UI_TEXT = {
  en: {
    brandTitle: 'RythuMitra',
    brandNative: 'రైతుమిత్ర',
    tagline: 'Your Trusted Friend in Farming',
    meaning: 'Friend of the Farmer · Direct Agricultural Supply Chain & Net Profit Platform',
    selectLanguage: 'Language',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    farmerLogin: 'Farmer Login',
    buyerLogin: 'Buyer Login',
    marketAdminLogin: 'Market Administrator Login',
    mainAdminLogin: 'Main Administrator Login',
    roleFarmer: 'Farmer',
    roleBuyer: 'Buyer',
    roleMarketAdmin: 'Market Administrator',
    roleMainAdmin: 'Main Administrator',
    loginSubtext: 'Sign in with your account or register with your address to access live market prices, transport estimation, and direct trade.',
    usernameOrEmail: 'Username or Email',
    password: 'Password',
    fullName: 'Full Name',
    username: 'Username',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    houseNumber: 'House Number / Door No.',
    streetName: 'Street Name / Colony',
    villageOrTown: 'Village or Town',
    city: 'City / Mandal',
    district: 'District',
    state: 'State',
    pinCode: 'PIN Code',
    addressSectionTitle: 'Registered Location & Address Details',
    addressHelper: 'Used to calculate accurate road distances, transport costs, and buyer/farmer proximity.',
    quickDemoAccess: 'Instant Demo Account Sign-In',
    createAccountBtn: 'Create RythuMitra Account',
    signInBtn: 'Sign In to Dashboard',
    navDashboard: 'Dashboard',
    navMarketPrices: 'Market Prices',
    navMyCrops: 'My Crops',
    navProfitCalc: 'Profit & Transport Calculator',
    navFindBuyers: 'Buyer Requirements',
    navMyRequirements: 'My Requirements',
    navFindFarmers: 'Find Farmers',
    navManageMarkets: 'Manage Market Prices',
    navRequests: 'Requests & Chat',
    navProfile: 'Profile & Address',
    navAdminApproval: 'System Governance',
    searchCropPlaceholder: 'Search crop (e.g., Tomatoes, Onions, Turmeric)...',
    allMarkets: 'All Markets',
    allCrops: 'All Crops',
    sortHighestNet: 'Sort: Highest Net Earnings',
    sortHighestPrice: 'Sort: Highest Crop Price',
    sortLowestPrice: 'Sort: Lowest Crop Price',
    sortNearestDistance: 'Sort: Nearest Market / Buyer',
    sortLowestTransport: 'Sort: Lowest Transport Cost',
    currentPrice: 'Current Price',
    unit: 'Unit',
    lastUpdated: 'Last Updated',
    estDistance: 'Road Distance',
    estTransport: 'Est. Transport',
    estNetEarnings: 'Expected Net Earnings',
    recommendedOption: 'Recommended #1 Selling Option (Highest Net Profit)',
    netFormulaNotice: 'Net Earnings = Selling Revenue − Transportation Cost − Market Fees − Other Selling Costs − Spoilage Loss',
    buyerCostFormulaNotice: 'Total Purchase Cost = Crop Purchase Amount + Transportation Cost + Other Applicable Charges',
    addCropTitle: 'Add Available Crop Listing',
    cropName: 'Crop Name',
    availableQty: 'Available Quantity (kg)',
    cropQuality: 'Crop Quality / Grade',
    expectedSellingPrice: 'Expected Selling Price (₹/kg)',
    harvestDate: 'Harvest / Availability Date',
    farmLocation: 'Farm Location',
    saveCropBtn: 'Publish Crop Listing',
    addRequirementTitle: 'Publish Buyer Crop Requirement',
    requiredQty: 'Required Quantity (kg)',
    requiredQuality: 'Required Quality / Grade',
    expectedBudget: 'Offered Price / Budget (₹/kg)',
    deliveryDate: 'Required Delivery Date',
    additionalNotes: 'Additional Quality / Packaging Notes',
    saveRequirementBtn: 'Publish Buyer Requirement',
    sendRequest: 'Send Trade Request',
    sentRequests: 'Sent Requests',
    receivedRequests: 'Received Requests',
    openChat: 'Open Direct Chat',
    acceptBtn: 'Accept',
    rejectBtn: 'Reject',
    cancelBtn: 'Cancel Request',
    statusPending: 'Pending',
    statusAccepted: 'Accepted',
    statusRejected: 'Rejected',
    statusCancelled: 'Cancelled',
  },
  te: {
    brandTitle: 'రైతుమిత్ర',
    brandNative: 'RythuMitra',
    tagline: 'వ్యవసాయంలో మీ నమ్మకమైన నేస్తం',
    meaning: 'రైతు యొక్క మిత్రుడు · గిట్టుబాటు ధర, రవాణా ఖర్చు మరియు నికర లాభం అంచనా వేదిక',
    selectLanguage: 'భాష (Language)',
    signIn: 'లాగిన్ (Sign In)',
    signUp: 'కొత్త ఖాతా (Sign Up)',
    signOut: 'నిష్క్రమించు (Sign Out)',
    farmerLogin: 'రైతు లాగిన్ (Farmer)',
    buyerLogin: 'కొనుగోలుదారు లాగిన్ (Buyer)',
    marketAdminLogin: 'మార్కెట్ అడ్మిన్ లాగిన్',
    mainAdminLogin: 'ప్రధాన అడ్మినిస్ట్రేటర్',
    roleFarmer: 'రైతు (Farmer)',
    roleBuyer: 'కొనుగోలుదారు (Buyer)',
    roleMarketAdmin: 'మార్కెట్ అడ్మినిస్ట్రేటర్',
    roleMainAdmin: 'ప్రధాన అడ్మినిస్ట్రేటర్',
    loginSubtext: 'మార్కెట్ ధరలు, రవాణా ఖర్చులు మరియు నికర లాభం తెలుసుకోవడానికి మీ ఖాతాతో లాగిన్ అవ్వండి.',
    usernameOrEmail: 'యూజర్‌నేమ్ లేదా ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    fullName: 'పూర్తి పేరు (Full Name)',
    username: 'యూజర్‌నేమ్ (Username)',
    emailAddress: 'ఇమెయిల్ చిరునామా',
    phoneNumber: 'ఫోన్ నంబర్',
    houseNumber: 'ఇంటి నంబర్ (House No.)',
    streetName: 'వీధి పేరు (Street Name)',
    villageOrTown: 'గ్రామం లేదా పట్టణం (Village/Town)',
    city: 'నగరం / మండలం (City)',
    district: 'జిల్లా (District)',
    state: 'రాష్ట్రం (State)',
    pinCode: 'పిన్ కోడ్ (PIN Code)',
    addressSectionTitle: 'చిరునామా మరియు ప్రాంత వివరాలు',
    addressHelper: 'ఈ చిరునామా వివరాల ద్వారా మార్కెట్ దూరం మరియు రవాణా ఖర్చులు ఖచ్చితంగా లెక్కించబడతాయి.',
    quickDemoAccess: 'డెమో ఖాతాతో తక్షణ లాగిన్ (Demo Login)',
    createAccountBtn: 'రైతుమిత్ర ఖాతా సృష్టించండి',
    signInBtn: 'డ్యాష్‌బోర్డ్‌లోకి ప్రవేశించండి',
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navMarketPrices: 'మార్కెట్ ధరలు',
    navMyCrops: 'నా పంటల వివరాలు',
    navProfitCalc: 'రవాణా & నికర లాభం లెక్క',
    navFindBuyers: 'కొనుగోలుదారుల అవసరాలు',
    navMyRequirements: 'నా కొనుగోలు అవసరాలు',
    navFindFarmers: 'రైతుల పంటల శోధన',
    navManageMarkets: 'మార్కెట్ ధరల నిర్వహణ',
    navRequests: 'అభ్యర్థనలు & చాట్ (Requests)',
    navProfile: 'ప్రొఫైల్ & చిరునామా',
    navAdminApproval: 'ప్రధాన అడ్మిన్ ఆమోదాలు',
    searchCropPlaceholder: 'పంట పేరుతో వెతకండి (ఉదా: టమాటా, ఉల్లి, పసుపు)...',
    allMarkets: 'అన్ని మార్కెట్లు',
    allCrops: 'అన్ని పంటలు',
    sortHighestNet: 'క్రమం: అత్యధిక నికర లాభం (Net Profit)',
    sortHighestPrice: 'క్రమం: అత్యధిక పంట ధర',
    sortLowestPrice: 'క్రమం: అత్యల్ప పంట ధర',
    sortNearestDistance: 'క్రమం: దగ్గరలోని మార్కెట్ / కొనుగోలుదారు',
    sortLowestTransport: 'క్రమం: తక్కువ రవాణా ఖర్చు',
    currentPrice: 'ప్రస్తుత ధర',
    unit: 'యూనిట్',
    lastUpdated: 'చివరిగా నవీకరించబడింది',
    estDistance: 'రోడ్డు దూరం',
    estTransport: 'అంచనా రవాణా ఖర్చు',
    estNetEarnings: 'అంచనా నికర ఆదాయం (Net Profit)',
    recommendedOption: 'సిఫార్సు చేయబడిన #1 ఉత్తమ విక్రయ ఎంపిక (అత్యధిక నికర లాభం)',
    netFormulaNotice: 'నికర ఆదాయం = అమ్మకపు ఆదాయం − రవాణా ఖర్చు − మార్కెట్ ఫీజు − ఇతర ఖర్చులు − తరుగుదల నష్టం',
    buyerCostFormulaNotice: 'మొత్తం కొనుగోలు ఖర్చు = పంట కొనుగోలు మొత్తం + రవాణా ఖర్చు + ఇతర ఛార్జీలు',
    addCropTitle: 'అందుబాటులో ఉన్న పంట వివరాలను జోడించండి',
    cropName: 'పంట పేరు',
    availableQty: 'అందుబాటులో ఉన్న పరిమాణం (కిలోలు)',
    cropQuality: 'పంట నాణ్యత / గ్రేడ్',
    expectedSellingPrice: 'ఆశించే అమ్మకపు ధర (₹/కిలో)',
    harvestDate: 'కోత / అందుబాటు తేదీ',
    farmLocation: 'పొలం ఉన్న ప్రాంతం',
    saveCropBtn: 'పంట వివరాలు ప్రచురించండి',
    addRequirementTitle: 'కొనుగోలుదారు పంట అవసరాన్ని ప్రచురించండి',
    requiredQty: 'కావలసిన పరిమాణం (కిలోలు)',
    requiredQuality: 'కావలసిన నాణ్యత / గ్రేడ్',
    expectedBudget: 'ఆఫర్ చేసే ధర / బడ్జెట్ (₹/కిలో)',
    deliveryDate: 'డెలివరీ కావలసిన తేదీ',
    additionalNotes: 'ఇతర నాణ్యత / ప్యాకేజింగ్ వివరాలు',
    saveRequirementBtn: 'కొనుగోలు అవసరం ప్రచురించండి',
    sendRequest: 'అభ్యర్థన పంపండి (Send Request)',
    sentRequests: 'పంపిన అభ్యర్థనలు (Sent)',
    receivedRequests: 'వచ్చిన అభ్యర్థనలు (Received)',
    openChat: 'చాట్ తెరవండి (Direct Chat)',
    acceptBtn: 'ఆమోదించు (Accept)',
    rejectBtn: 'తిరస్కరించు (Reject)',
    cancelBtn: 'రద్దు చేయి (Cancel)',
    statusPending: 'పెండింగ్‌లో ఉంది (Pending)',
    statusAccepted: 'ఆమోదించబడింది (Accepted)',
    statusRejected: 'తిరస్కరించబడింది (Rejected)',
    statusCancelled: 'రద్దు చేయబడింది (Cancelled)',
  },
};

const CROP_WORD_TE: Record<string, string> = {
  red: 'ఎర్ర',
  green: 'పచ్చి',
  yellow: 'పసుపు',
  black: 'నల్ల',
  white: 'తెల్ల',
  sweet: 'తీపి',
  bitter: 'కాకర',
  organic: 'సేంద్రియ',
  hybrid: 'హైబ్రిడ్',
  local: 'స్థానిక',
  desi: 'దేశీ',
  fresh: 'తాజా',
  dry: 'ఎండు',
  dried: 'ఎండు',
  raw: 'పచ్చి',
  baby: 'బేబీ',
  seed: 'విత్తనాలు',
  seeds: 'విత్తనాలు',
  grain: 'ధాన్యం',
  grains: 'ధాన్యాలు',
  leaf: 'ఆకు',
  leaves: 'ఆకులు',
  gourd: 'కాయ',
  gram: 'పప్పు',
  dal: 'పప్పు',
  pulse: 'పప్పుధాన్యం',
  pulses: 'పప్పుధాన్యాలు',
  bean: 'చిక్కుడు',
  beans: 'చిక్కుడు',
  pea: 'బఠానీ',
  peas: 'బఠానీలు',
  millet: 'చిరుధాన్యం',
  millets: 'చిరుధాన్యాలు',
  chilli: 'మిర్చి',
  chillies: 'మిర్చి',
  pepper: 'మిరియాలు',
  apple: 'ఆపిల్',
  melon: 'పుచ్చ',
  berry: 'బెర్రీ',
  berries: 'బెర్రీలు',
  fruit: 'పండు',
  fruits: 'పండ్లు',
  flower: 'పూలు',
  flowers: 'పూలు',
  root: 'దుంప',
  nut: 'గింజ',
  nuts: 'గింజలు',
  tomato: 'టమాటా',
  tomatoes: 'టమాటాలు',
  onion: 'ఉల్లిపాయ',
  onions: 'ఉల్లిపాయలు',
  potato: 'బంగాళాదుంప',
  potatoes: 'బంగాళాదుంపలు',
  paddy: 'వరి ధాన్యం',
  rice: 'వరి',
  turmeric: 'పసుపు',
  cotton: 'పత్తి',
  groundnut: 'వేరుశెనగ',
  brinjal: 'వంకాయ',
  okra: 'బెండకాయ',
  cabbage: 'క్యాబేజీ',
  cauliflower: 'కాలీఫ్లవర్',
  carrot: 'క్యారెట్',
  carrots: 'క్యారెట్లు',
  beetroot: 'బీట్‌రూట్',
  radish: 'ముల్లంగి',
  cucumber: 'దోసకాయ',
  capsicum: 'క్యాప్సికమ్',
  drumstick: 'మునగకాయ',
  pumpkin: 'గుమ్మడికాయ',
  spinach: 'పాలకూర',
  mint: 'పుదీనా',
  garlic: 'వెల్లుల్లి',
  ginger: 'అల్లం',
  coriander: 'కొత్తిమీర',
  tamarind: 'చింతపండు',
  mango: 'మామిడి',
  banana: 'అరటి',
  papaya: 'బొప్పాయి',
  guava: 'జామ',
  watermelon: 'పుచ్చకాయ',
  pomegranate: 'దానిమ్మ',
  sapota: 'సపోటా',
  pineapple: 'అనాస',
  jackfruit: 'పనస',
  grapes: 'ద్రాక్ష',
  orange: 'నారింజ',
  lemon: 'నిమ్మకాయ',
  coconut: 'కొబ్బరి',
  maize: 'మొక్కజొన్న',
  corn: 'మొక్కజొన్న',
  wheat: 'గోధుమలు',
  jowar: 'జొన్నలు',
  bajra: 'సజ్జలు',
  ragi: 'రాగులు',
  sugarcane: 'చెరుకు',
  sunflower: 'పొద్దుతిరుగుడు',
  soybean: 'సోయాబీన్',
  sesame: 'నువ్వులు',
  mustard: 'ఆవాలు',
  cashew: 'జీడిపప్పు',
  cardamom: 'యాలకులు',
  coffee: 'కాఫీ',
  tea: 'తేయాకు',
  mushroom: 'పుట్టగొడుగు',
};

/**
 * Phonetically transliterates an English word into Telugu script so that any
 * brand-new custom crop name entered by a user renders in Telugu script when
 * Telugu language mode is selected across all user profiles.
 */
function transliterateWordEnToTe(word: string): string {
  const clean = word.trim();
  if (!clean) return '';
  // If already contains Telugu characters or numbers/codes, return as-is
  if (/[\u0C00-\u0C7F]/.test(clean) || /^[\d\W]+$/.test(clean)) {
    return clean;
  }

  const lower = clean.toLowerCase();
  if (CROP_WORD_TE[lower]) return CROP_WORD_TE[lower];
  if (lower.endsWith('es') && CROP_WORD_TE[lower.slice(0, -2)]) {
    return CROP_WORD_TE[lower.slice(0, -2)];
  }
  if (lower.endsWith('s') && CROP_WORD_TE[lower.slice(0, -1)]) {
    return CROP_WORD_TE[lower.slice(0, -1)];
  }

  const consonants: Array<[string, string]> = [
    ['ksh', 'క్ష'],
    ['chh', 'ఛ'],
    ['sh', 'ష'],
    ['ch', 'చ'],
    ['kh', 'ఖ'],
    ['gh', 'ఘ'],
    ['th', 'థ'],
    ['dh', 'ధ'],
    ['ph', 'ఫ'],
    ['bh', 'భ'],
    ['ng', 'ంగ'],
    ['nk', 'ంక'],
    ['nt', 'ంట'],
    ['nd', 'ండ'],
    ['mp', 'ంప'],
    ['mb', 'ంబ'],
    ['ck', 'క్'],
    ['qu', 'క్వ'],
    ['k', 'క'],
    ['c', 'క'],
    ['g', 'గ'],
    ['j', 'జ'],
    ['z', 'జ'],
    ['t', 'ట'],
    ['d', 'డ'],
    ['n', 'న'],
    ['p', 'ప'],
    ['f', 'ఫ'],
    ['b', 'బ'],
    ['m', 'మ'],
    ['y', 'య'],
    ['r', 'ర'],
    ['l', 'ల'],
    ['v', 'వ'],
    ['w', 'వ'],
    ['s', 'స'],
    ['h', 'హ'],
    ['x', 'క్స'],
  ];

  const standaloneVowels: Array<[string, string]> = [
    ['aa', 'ఆ'],
    ['ee', 'ఈ'],
    ['oo', 'ఊ'],
    ['ai', 'ఐ'],
    ['au', 'ఔ'],
    ['ou', 'ఔ'],
    ['ea', 'ఈ'],
    ['a', 'అ'],
    ['i', 'ఇ'],
    ['u', 'ఉ'],
    ['e', 'ఎ'],
    ['o', 'ఒ'],
  ];

  const vowelMatras: Array<[string, string]> = [
    ['aa', 'ా'],
    ['ee', 'ీ'],
    ['oo', 'ూ'],
    ['ai', 'ై'],
    ['au', 'ౌ'],
    ['ou', 'ౌ'],
    ['ea', 'ీ'],
    ['ie', 'ీ'],
    ['a', ''],
    ['i', 'ి'],
    ['u', 'ు'],
    ['e', 'ె'],
    ['o', 'ొ'],
    ['y', 'ీ'],
  ];

  let i = 0;
  let out = '';
  while (i < lower.length) {
    const ch = lower[i];
    if (!/[a-z]/.test(ch)) {
      out += ch;
      i++;
      continue;
    }

    // Check consonant match
    let matchedCons: [string, string] | null = null;
    for (const [pat, te] of consonants) {
      if (lower.startsWith(pat, i)) {
        matchedCons = [pat, te];
        break;
      }
    }

    if (matchedCons) {
      const [cPat, cTe] = matchedCons;
      i += cPat.length;
      // Handle double consonant like 'll', 'tt', 'pp', 'mm', 'nn'
      if (cPat.length === 1 && lower[i] === cPat) {
        i++;
      }
      // Look for following vowel matra
      let matchedMatra: [string, string] | null = null;
      for (const [vPat, vTe] of vowelMatras) {
        if (lower.startsWith(vPat, i)) {
          matchedMatra = [vPat, vTe];
          break;
        }
      }
      if (matchedMatra) {
        out += cTe + matchedMatra[1];
        i += matchedMatra[0].length;
      } else {
        // Consonant at end of word or before another consonant gets virama (halant)
        out += cTe + '్';
      }
    } else {
      // Standalone vowel
      let matchedVowel: [string, string] | null = null;
      for (const [vPat, vTe] of standaloneVowels) {
        if (lower.startsWith(vPat, i)) {
          matchedVowel = [vPat, vTe];
          break;
        }
      }
      if (matchedVowel) {
        out += matchedVowel[1];
        i += matchedVowel[0].length;
      } else {
        out += lower[i];
        i++;
      }
    }
  }

  return out || clean;
}

export function translateCrop(cropName: string, lang: Language): string {
  if (!cropName) return '';
  const trimmed = cropName.trim();
  if (!trimmed) return '';

  // 1. Direct match in CROP_TRANSLATIONS
  const exact = CROP_TRANSLATIONS[trimmed];
  if (exact) return exact[lang];

  // 2. Case-insensitive or singular/plural match in CROP_TRANSLATIONS
  const lower = trimmed.toLowerCase();
  const matchedKey = Object.keys(CROP_TRANSLATIONS).find((k) => {
    const kLow = k.toLowerCase();
    return (
      kLow === lower ||
      kLow + 's' === lower ||
      kLow + 'es' === lower ||
      lower + 's' === kLow ||
      lower + 'es' === kLow
    );
  });
  if (matchedKey) return CROP_TRANSLATIONS[matchedKey][lang];

  // 3. Reverse match if user entered the crop name in Telugu (or Telugu + English)
  const reverseKey = Object.keys(CROP_TRANSLATIONS).find((k) => {
    const teVal = CROP_TRANSLATIONS[k].te.toLowerCase();
    const teOnly = teVal.split('(')[0].trim();
    return teVal === lower || teOnly === lower;
  });
  if (reverseKey) return CROP_TRANSLATIONS[reverseKey][lang];

  // 4. Dynamic translation for any custom user-added crop name
  const hasTeluguScript = /[\u0C00-\u0C7F]/.test(trimmed);
  if (lang === 'en') {
    if (!hasTeluguScript) return trimmed;
    // Extract English part if formatted like "టమాటా (Tomato)"
    const parenMatch = trimmed.match(/\(([A-Za-z0-9\s-]+)\)/);
    if (parenMatch) return parenMatch[1].trim();
    // Reverse lookup word by word
    const reverseWordMap: Record<string, string> = {};
    for (const [enW, teW] of Object.entries(CROP_WORD_TE)) {
      if (!reverseWordMap[teW]) {
        reverseWordMap[teW] = enW.charAt(0).toUpperCase() + enW.slice(1);
      }
    }
    if (reverseWordMap[trimmed]) return reverseWordMap[trimmed];

    const teToEnMap: Record<string, string> = {
      'అ': 'a', 'ఆ': 'aa', 'ఇ': 'i', 'ఈ': 'ee', 'ఉ': 'u', 'ఊ': 'oo', 'ఎ': 'e', 'ఏ': 'e', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'o', 'ఔ': 'au',
      'క': 'ka', 'ఖ': 'kha', 'గ': 'ga', 'ఘ': 'gha', 'చ': 'cha', 'ఛ': 'chha', 'జ': 'ja', 'ఝ': 'jha',
      'ట': 'ta', 'ఠ': 'tha', 'డ': 'da', 'ఢ': 'dha', 'ణ': 'na', 'త': 'tha', 'థ': 'tha', 'ద': 'da', 'ధ': 'dha', 'న': 'na',
      'ప': 'pa', 'ఫ': 'pha', 'బ': 'ba', 'భ': 'bha', 'మ': 'ma', 'య': 'ya', 'ర': 'ra', 'ల': 'la', 'ళ': 'la', 'వ': 'va',
      'శ': 'sha', 'ష': 'sha', 'స': 'sa', 'హ': 'ha', 'క్ష': 'ksha',
      'ా': 'a', 'ి': 'i', 'ీ': 'ee', 'ు': 'u', 'ూ': 'oo', 'ె': 'e', 'ే': 'e', 'ై': 'ai', 'ొ': 'o', 'ో': 'o', 'ౌ': 'au',
      'ం': 'm', 'ః': 'h', '్': '',
    };
    const matras = new Set(['ా', 'ి', 'ీ', 'ు', 'ూ', 'ె', 'ే', 'ై', 'ొ', 'ో', 'ౌ', '్']);

    const words = trimmed.split(/\s+/);
    const enWords = words.map((w) => {
      if (reverseWordMap[w]) return reverseWordMap[w];
      let res = '';
      for (let idx = 0; idx < w.length; idx++) {
        const ch = w[idx];
        const next = w[idx + 1];
        if (teToEnMap[ch] !== undefined) {
          let mapped = teToEnMap[ch];
          if (mapped.endsWith('a') && mapped.length > 1 && next && matras.has(next)) {
            mapped = mapped.slice(0, -1);
          }
          res += mapped;
        } else {
          res += ch;
        }
      }
      return res ? res.charAt(0).toUpperCase() + res.slice(1) : w;
    });
    return enWords.join(' ');
  } else {
    // lang === 'te'
    if (hasTeluguScript) return trimmed;
    const words = trimmed.split(/\s+/);
    const teWords = words.map((w) => transliterateWordEnToTe(w)).join(' ');
    return `${teWords} (${trimmed})`;
  }
}

export function getCropImage(cropName: string): string {
  const lower = (cropName || '').toLowerCase();
  if (lower.includes('tomato') || lower.includes('టమాట')) {
    return '/src/assets/images/crop_tomatoes_1793342840644.jpg';
  }
  if (lower.includes('green chilli') || lower.includes('పచ్చి మిర్చి')) {
    return '/src/assets/images/crop_green_chilli_1793342841275.jpg';
  }
  if (lower.includes('red chilli') || lower.includes('mirchi') || lower.includes('chilli') || lower.includes('మిర్చి')) {
    return '/src/assets/images/crop_red_chilli_1793342841404.jpg';
  }
  if (lower.includes('onion') || lower.includes('ఉల్లి')) {
    return '/src/assets/images/crop_onions_1793342842316.jpg';
  }
  if (lower.includes('paddy') || lower.includes('rice') || lower.includes('bpt') || lower.includes('వరి')) {
    return '/src/assets/images/crop_paddy_rice_1793342844135.jpg';
  }
  if (lower.includes('turmeric') || lower.includes('పసుపు')) {
    return '/src/assets/images/crop_turmeric_1793342845339.jpg';
  }
  if (lower.includes('groundnut') || lower.includes('peanut') || lower.includes('వేరుశెనగ')) {
    return '/src/assets/images/crop_groundnut_1793342845475.jpg';
  }
  if (lower.includes('cotton') || lower.includes('పత్తి')) {
    return '/src/assets/images/crop_cotton_1793342845258.jpg';
  }
  return '/src/assets/images/crop_tomatoes_1793342840644.jpg';
}

export const MARKET_And_LOCATION_TE: Record<string, string> = {
  // Official Market Names
  'Madanapalle APMC Tomato & Vegetable Market': 'మదనపల్లె ఎపిఎంసి టమాటా & కూరగాయల మార్కెట్',
  'Dr. B.R. Ambedkar Bowenpally Wholesale Yard': 'డా. బి.ఆర్. అంబేద్కర్ బోయిన్‌పల్లి హోల్‌సేల్ యార్డ్',
  'Guntur NTR Mirchi & Spice Market Yard': 'గుంటూరు ఎన్టీఆర్ మిర్చి & సుగంధ ద్రవ్యాల మార్కెట్ యార్డ్',
  'Swaraj Maidan Rythu Bazaar & Gollapudi Yard': 'స్వరాజ్ మైదాన్ రైతు బజార్ & గొల్లపూడి మార్కెట్ యార్డ్',
  'Kurnool Special Grade APMC Onion & Grain Market': 'కర్నూలు స్పెషల్ గ్రేడ్ ఎపిఎంసి ఉల్లి & ధాన్యం మార్కెట్',

  // Market Locations & Streets
  'Bengaluru Highway Market Yard': 'బెంగళూరు హైవే మార్కెట్ యార్డ్',
  'NH-44 Secunderabad Bypass': 'ఎన్.హెచ్-44 సికింద్రాబాద్ బైపాస్',
  'Chilakaluripet Road': 'చిలకలూరిపేట రోడ్డు',
  'NH-65 Gollapudi Market Ring': 'ఎన్.హెచ్-65 గొల్లపూడి మార్కెట్ రింగ్',
  'Bellary Cross Road': 'బళ్లారి క్రాస్ రోడ్డు',
  'Ankireddypalli Main Road': 'అంకిరెడ్డిపల్లి మెయిన్ రోడ్డు',
  'Canal Bund Street': 'కెనాల్ బండ్ వీధి',
  'Handri River Road': 'హంద్రీ నది రోడ్డు',
  'Renigunta Industrial Bypass': 'రేణిగుంట ఇండస్ట్రియల్ బైపాస్',
  'Kukatpally Agro Logistics Park': 'కూకట్‌పల్లి ఆగ్రో లాజిస్టిక్స్ పార్క్',
  'Bengaluru Road Market Yard': 'బెంగళూరు రోడ్డు మార్కెట్ యార్డ్',
  'Bellary Road Agricultural Yard': 'బళ్లారి రోడ్డు వ్యవసాయ మార్కెట్ యార్డ్',
  'MG Road Bandar': 'ఎం.జి. రోడ్డు బందరు',
  'Tiruchanur Bypass': 'తిరుచానూరు బైపాస్',
  'Balanagar Agro Park': 'బాలానగర్ ఆగ్రో పార్క్',

  // Door / House / Plot Numbers
  '4-88/A': '4-88/ఎ',
  'Plot 42, D.No 19-4-112': 'ప్లాట్ 42, డోర్ నం. 19-4-112',
  'Shed 14, Block C': 'షెడ్ 14, బ్లాక్ సి',
  'Admin Block 2': 'అడ్మిన్ బ్లాక్ 2',
  'Office 1-B': 'ఆఫీస్ 1-బి',
  'Commissioner Bhavan, 3rd Floor': 'కమిషనర్ భవన్, 3వ అంతస్తు',

  // Villages, Towns, Cities, Districts & States
  kurabalakota: 'కురబలకోట',
  Kurabalakota: 'కురబలకోట',
  Prathipadu: 'ప్రత్తిపాడు',
  Kodumur: 'కోడుమూరు',
  Tiruchanur: 'తిరుచానూరు',
  Balanagar: 'బాలానగర్',
  'Madanapalle Urban': 'మదనపల్లె అర్బన్',
  'Kurnool Camp': 'కర్నూలు క్యాంప్',
  Labbipet: 'లబ్బీపేట',
  Madanapalle: 'మదనపల్లె',
  'Annamayya (Chittoor)': 'అన్నమయ్య (చిత్తూరు)',
  Annamayya: 'అన్నమయ్య',
  Chittoor: 'చిత్తూరు',
  Tirupati: 'తిరుపతి',
  Guntur: 'గుంటూరు',
  Vijayawada: 'విజయవాడ',
  'NTR (Krishna)': 'ఎన్టీఆర్ (కృష్ణా)',
  NTR: 'ఎన్టీఆర్',
  Krishna: 'కృష్ణా',
  Hyderabad: 'హైదరాబాద్',
  'Medchal-Malkajgiri': 'మేడ్చల్-మల్కాజిగిరి',
  Kurnool: 'కర్నూలు',
  Warangal: 'వరంగల్',
  Enumamula: 'ఎనుమాముల',
  Duggirala: 'దుగ్గిరాల',
  Nizamabad: 'నిజామాబాద్',
  Anantapur: 'అనంతపురం',
  Rajahmundry: 'రాజమండ్రి',
  Visakhapatnam: 'విశాఖపట్నం',
  Nellore: 'నెల్లూరు',
  Kadapa: 'కడప',
  Khammam: 'ఖమ్మం',
  Karimnagar: 'కరీంనగర్',
  Nalgonda: 'నల్లగొండ',
  Secunderabad: 'సికింద్రాబాద్',
  Bowenpally: 'బోయిన్‌పల్లి',
  Gollapudi: 'గొల్లపూడి',
  'Andhra Pradesh': 'ఆంధ్రప్రదేశ్',
  Telangana: 'తెలంగాణ',

  // Organizations & People
  'K. Rama Rao (కె. రామారావు)': 'కె. రామారావు',
  'K. Rama Rao': 'కె. రామారావు',
  'D. Venkateswarlu (డి. వెంకటేశ్వర్లు)': 'డి. వెంకటేశ్వర్లు',
  'D. Venkateswarlu': 'డి. వెంకటేశ్వర్లు',
  'B. Mallikarjuna Reddy (బి. మల్లికార్జున రెడ్డి)': 'బి. మల్లికార్జున రెడ్డి',
  'B. Mallikarjuna Reddy': 'బి. మల్లికార్జున రెడ్డి',
  'Sri Tirumala Fresh Mart & Catering': 'శ్రీ తిరుమల ఫ్రెష్ మార్ట్ & క్యాటరింగ్',
  'Sri Tirumala Fresh Mart': 'శ్రీ తిరుమల ఫ్రెష్ మార్ట్',
  'Annapurna Agro & Supermarkets': 'అన్నపూర్ణ ఆగ్రో & సూపర్ మార్కెట్స్',
  'Annapurna Agro & Retail': 'అన్నపూర్ణ ఆగ్రో & రిటైల్',
  'P. Harish Chandra': 'పి. హరీష్ చంద్ర',
  'P.Harish Chandra': 'పి. హరీష్ చంద్ర',
  'Smt. K. Padmavathi': 'శ్రీమతి కె. పద్మావతి',
  'M. Srinivasulu': 'ఎం. శ్రీనివాసులు',
  'G. Narasimha Rao': 'జి. నరసింహారావు',
  'Dr. V. Rajasekhar': 'డా. వి. రాజశేఖర్',
  'APMC Market Officer': 'ఎపిఎంసి మార్కెట్ అధికారి',
  'Kurnool Yard Secretary': 'కర్నూలు యార్డ్ కార్యదర్శి',
  'State Directorate Admin': 'రాష్ట్ర డైరెక్టరేట్ అడ్మిన్',

  // Buyer Requirement Notes & Vehicles
  'Firm red Grade-A table tomatoes packed in 25kg ventilated plastic crates. Zero market commission.':
    '25 కిలోల ప్లాస్టిక్ క్రేట్లలో ప్యాక్ చేసిన నాణ్యమైన ఎర్రని గ్రేడ్-ఎ టమాటాలు. 0% మార్కెట్ కమిషన్.',
  'Supermarket sorting quality, direct bank transfer on weighbridge slip.':
    'సూపర్ మార్కెట్ స్థాయి నాణ్యత, కాటా స్లిప్ ఆధారంగా నేరుగా బ్యాంకు ఖాతాకు చెల్లింపు.',
  'Dry cured medium-large bulbs, 50kg jute bags.':
    'బాగా ఆరిన మధ్యస్థ-పెద్ద సైజు ఉల్లిపాయలు, 50 కిలోల గోనె సంచులలో.',
  'Moisture under 14%, Sona Masoori BPT-5204 fine grain.':
    'తేమ 14% లోపు ఉండాలి, సన్న రకం సోనా మసూరి బిపిటి-5204 వరి ధాన్యం.',
  'Direct weighbridge settlement upon quality verification.':
    'నాణ్యత పరిశీలన తర్వాత కాటా వద్ద తక్షణ చెల్లింపు.',
  'Piaggio Ape / Mini Auto (Up to 1,000 kg)': 'మినీ ఆటో (1,000 కిలోల వరకు)',
  'Tata Ace / Chota Hathi (Up to 2,000 kg)': 'టాటా ఏస్ వ్యాన్ (2,000 కిలోల వరకు)',
  'Eicher DCM Light Truck (Up to 5,000 kg)': 'ఐషర్ డిసిఎం లారీ (5,000 కిలోల వరకు)',
  'Ashok Leyland 10-Ton Carrier (Up to 10,000 kg)': '10-టన్నుల భారీ లారీ (10,000 కిలోల వరకు)',

  // Units & Grades
  'per kg': 'కిలోకు',
  'per quintal': 'క్వింటాకు',
  'Grade A': 'గ్రేడ్ ఎ',
  'Grade B': 'గ్రేడ్ బి',
  'Grade C': 'గ్రేడ్ సి',
  Standard: 'సాధారణ గ్రేడ్',
};

const ADDRESS_WORD_TE: Record<string, string> = {
  road: 'రోడ్డు',
  rd: 'రోడ్డు',
  street: 'వీధి',
  st: 'వీధి',
  colony: 'కాలనీ',
  nagar: 'నగర్',
  village: 'గ్రామం',
  town: 'పట్టణం',
  city: 'నగరం',
  district: 'జిల్లా',
  dist: 'జిల్లా',
  state: 'రాష్ట్రం',
  mandal: 'మండలం',
  plot: 'ప్లాట్',
  door: 'డోర్',
  house: 'ఇంటి',
  no: 'నం.',
  flat: 'ఫ్లాట్',
  floor: 'అంతస్తు',
  block: 'బ్లాక్',
  shed: 'షెడ్',
  office: 'ఆఫీస్',
  admin: 'అడ్మిన్',
  phase: 'ఫేజ్',
  cross: 'క్రాస్',
  main: 'మెయిన్',
  bypass: 'బైపాస్',
  highway: 'హైవే',
  ring: 'రింగ్',
  market: 'మార్కెట్',
  yard: 'యార్డ్',
  bazaar: 'బజార్',
  rythu: 'రైతు',
  wholesale: 'హోల్‌సేల్',
  special: 'స్పెషల్',
  grade: 'గ్రేడ్',
  near: 'దగ్గర',
  opposite: 'ఎదురుగా',
  opp: 'ఎదురుగా',
  behind: 'వెనుక',
  temple: 'గుడి',
  bus: 'బస్సు',
  stand: 'స్టాండ్',
  station: 'స్టేషన్',
  river: 'నది',
  canal: 'కెనాల్',
  bund: 'బండ్',
  camp: 'క్యాంప్',
  urban: 'అర్బన్',
  rural: 'రూరల్',
  industrial: 'ఇండస్ట్రియల్',
  park: 'పార్క్',
  agro: 'ఆగ్రో',
  logistics: 'లాజిస్టిక్స్',
  agricultural: 'వ్యవసాయ',
  bhavan: 'భవన్',
  commissioner: 'కమిషనర్',
  apmc: 'ఎపిఎంసి',
  nh: 'ఎన్.హెచ్',
  mg: 'ఎం.జి',
  ntr: 'ఎన్టీఆర్',
  dr: 'డా.',
  smt: 'శ్రీమతి',
  sri: 'శ్రీ',
  a: 'ఎ',
  b: 'బి',
  c: 'సి',
  d: 'డి',
  e: 'ఇ',
  f: 'ఎఫ్',
  g: 'జి',
  h: 'హెచ్',
  k: 'కె',
  m: 'ఎం',
  n: 'ఎన్',
  p: 'పి',
  r: 'ఆర్',
  s: 'ఎస్',
  t: 'టి',
  v: 'వి',
};

export function translateGrade(grade: string, lang: Language): string {
  if (!grade) return '';
  const trimmed = grade.trim();
  const norm = trimmed.toLowerCase();

  if (lang === 'te') {
    if (norm === 'grade a' || norm === 'గ్రేడ్ a' || norm === 'గ్రేడ్ ఎ') return 'గ్రేడ్ ఎ';
    if (norm === 'grade b' || norm === 'గ్రేడ్ b' || norm === 'గ్రేడ్ బి') return 'గ్రేడ్ బి';
    if (norm === 'grade c' || norm === 'గ్రేడ్ c' || norm === 'గ్రేడ్ సి') return 'గ్రేడ్ సి';
    if (norm === 'standard' || norm === 'సాధారణ గ్రేడ్') return 'సాధారణ గ్రేడ్';
    return translateLocation(trimmed, 'te');
  } else {
    if (norm === 'grade a' || norm === 'గ్రేడ్ a' || norm === 'గ్రేడ్ ఎ') return 'Grade A';
    if (norm === 'grade b' || norm === 'గ్రేడ్ b' || norm === 'గ్రేడ్ బి') return 'Grade B';
    if (norm === 'grade c' || norm === 'గ్రేడ్ c' || norm === 'గ్రేడ్ సి') return 'Grade C';
    if (norm === 'standard' || norm === 'సాధారణ గ్రేడ్') return 'Standard';
    return translateLocation(trimmed, 'en');
  }
}

export function translateRole(role: string, lang: Language): string {
  const r = (role || '').toLowerCase();
  if (lang === 'te') {
    if (r === 'farmer') return 'రైతు';
    if (r === 'buyer') return 'కొనుగోలుదారు';
    if (r === 'market_admin') return 'మార్కెట్ అడ్మినిస్ట్రేటర్';
    if (r === 'main_admin') return 'ప్రధాన అడ్మినిస్ట్రేటర్';
    return translateLocation(role, 'te');
  } else {
    if (r === 'farmer') return 'Farmer';
    if (r === 'buyer') return 'Buyer';
    if (r === 'market_admin') return 'Market Administrator';
    if (r === 'main_admin') return 'Main Administrator';
    return role;
  }
}

export function translateLocation(text: string, lang: Language): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  if (lang === 'en') {
    // Reverse lookup if text was stored or edited in Telugu
    for (const [enKey, teVal] of Object.entries(MARKET_And_LOCATION_TE)) {
      if (trimmed === teVal) return enKey;
    }
    let enResult = trimmed;
    const sortedEntries = Object.entries(MARKET_And_LOCATION_TE).sort(
      (a, b) => b[1].length - a[1].length
    );
    for (const [enKey, teVal] of sortedEntries) {
      if (teVal && enResult.includes(teVal)) {
        enResult = enResult.split(teVal).join(enKey);
      }
    }
    return enResult;
  }

  // lang === 'te'
  if (MARKET_And_LOCATION_TE[trimmed]) {
    return MARKET_And_LOCATION_TE[trimmed];
  }

  let result = trimmed;
  // 1. Replace known phrases (longest first)
  const sortedKeys = Object.keys(MARKET_And_LOCATION_TE).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (result.includes(key)) {
      result = result.split(key).join(MARKET_And_LOCATION_TE[key]);
    }
  }

  // 2. Translate any remaining English words (custom user-entered streets, villages, cities, house numbers, names)
  result = result.replace(/[A-Za-z]+/g, (engWord) => {
    const low = engWord.toLowerCase();
    if (MARKET_And_LOCATION_TE[engWord]) return MARKET_And_LOCATION_TE[engWord];
    if (MARKET_And_LOCATION_TE[low]) return MARKET_And_LOCATION_TE[low];
    if (ADDRESS_WORD_TE[low]) return ADDRESS_WORD_TE[low];
    return transliterateWordEnToTe(engWord);
  });

  return result;
}

export function translateMarketName(marketName: string, lang: Language): string {
  return translateLocation(marketName, lang);
}

export function formatCurrency(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function formatFullAddress(
  addr: {
    houseNumber: string;
    streetName: string;
    villageOrTown: string;
    city: string;
    district: string;
    state: string;
    pinCode: string;
  },
  lang: Language = 'en'
): string {
  if (lang === 'te') {
    const h = translateLocation(addr.houseNumber, 'te');
    const s = translateLocation(addr.streetName, 'te');
    const v = translateLocation(addr.villageOrTown, 'te');
    const c = translateLocation(addr.city, 'te');
    const d = translateLocation(addr.district, 'te');
    const st = translateLocation(addr.state, 'te');
    return `${h}, ${s}, ${v}, ${c}, ${d} జిల్లా, ${st} - పిన్ ${addr.pinCode}`;
  }
  const h = translateLocation(addr.houseNumber, 'en');
  const s = translateLocation(addr.streetName, 'en');
  const v = translateLocation(addr.villageOrTown, 'en');
  const c = translateLocation(addr.city, 'en');
  const d = translateLocation(addr.district, 'en');
  const st = translateLocation(addr.state, 'en');
  return `${h}, ${s}, ${v}, ${c}, ${d} Dist., ${st} - PIN ${addr.pinCode}`;
}
