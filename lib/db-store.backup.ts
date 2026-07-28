export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'expert' | 'admin';
  phone: string;
  district: string;
  state: string;
  password?: string;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  area: number; // in acres
  location: string;
  soilType: 'Clay' | 'Sandy' | 'Loamy' | 'Silt' | 'Peaty';
  waterSource: 'Drip Irrigation' | 'Sprinkler' | 'Manual Water' | 'Rainfed';
  notes?: string;
}

export interface Crop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  sowedDate: string;
  durationDays: number;
  estimatedYieldKg: number;
  harvestedDate?: string;
  actualYieldKg?: number;
  status: 'planned' | 'growing' | 'harvesting' | 'completed';
}

export interface Activity {
  id: string;
  cropId: string;
  type: 'sowing' | 'irrigation' | 'fertilizer' | 'pesticide' | 'harvest';
  title: string;
  date: string;
  cost: number;
  isCompleted: boolean;
  notes?: string;
}

export interface Expense {
  id: string;
  farmId: string;
  category: 'seeds' | 'fertilizers' | 'labor' | 'equipment' | 'transport' | 'misc';
  amount: number;
  date: string;
  description: string;
}

export interface DiseaseReport {
  id: string;
  cropName: string;
  leafType: string;
  imageUrl: string;
  diseaseName: string;
  confidenceScore: number; // 0 to 1
  severityLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
  status: 'detected' | 'reviewed' | 'resolved';
  expertNotes?: string;
  createdAt: string;
  farmerName: string;
}

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  cropName: string;
  variety: string;
  quantityKg: number;
  pricePerKg: number;
  state: string;
  phone: string;
  imagePlaceholder: string;
  inquiriesCount: number;
  createdAt: string;
}

export interface EquipmentRental {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  type: 'tractor' | 'harvester' | 'rotavator' | 'seeder';
  pricePerDay: number;
  available: boolean;
  contact: string;
  description: string;
  imagePlaceholder: string;
  location: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorRole: 'farmer' | 'expert' | 'admin';
  title: string;
  content: string;
  category: 'discussion' | 'question' | 'expert' | 'success';
  likes: number;
  date: string;
  replies: {
    id: string;
    authorName: string;
    authorRole: 'farmer' | 'expert' | 'admin';
    content: string;
    date: string;
  }[];
}

export interface GovernmentScheme {
  id: string;
  name: string;
  eligibility: string;
  benefits: string;
  category: string;
  state: string;
  process: string;
}

// Starter static datasets for beautiful hydration
const INITIAL_USERS: User[] = [
  { id: 'usr-1', name: 'Irfan Siddique (Fictional Admin)', email: 'irfan.demo@fictional.example.com', role: 'admin', phone: '+1 (555) 019-9901', district: 'Karnal', state: 'Haryana', password: 'password' },
  { id: 'usr-2', name: 'Dr. Amit Sharma (Fictional Expert)', email: 'expert.demo@fictional.example.com', role: 'expert', phone: '+1 (555) 019-9902', district: 'New Delhi', state: 'Delhi', password: 'password' },
  { id: 'usr-3', name: 'FarmOS Demo Admin', email: 'admin.demo@fictional.example.com', role: 'admin', phone: '+1 (555) 019-9903', district: 'New Delhi', state: 'Delhi', password: 'password' }
];

const INITIAL_FARMS: Farm[] = [
  { id: 'frm-1', userId: 'usr-1', name: 'Green Valley Field A', area: 12.5, location: 'Nilokheri, Karnal', soilType: 'Loamy', waterSource: 'Drip Irrigation', notes: 'High organic carbon score' },
  { id: 'frm-2', userId: 'usr-1', name: 'South Slope Wheat Plot', area: 8.0, location: 'Taraori, Karnal', soilType: 'Clay', waterSource: 'Sprinkler', notes: 'Prone to heavy water retention during monsoon' }
];

const INITIAL_CROPS: Crop[] = [
  { id: 'crp-1', farmId: 'frm-1', name: 'Basmati Rice', variety: 'Pusa 1121', sowedDate: '2026-05-10', durationDays: 135, estimatedYieldKg: 18000, status: 'growing' },
  { id: 'crp-2', farmId: 'frm-2', name: 'High-Yield Wheat', variety: 'HD-2967', sowedDate: '2026-06-01', durationDays: 140, estimatedYieldKg: 12000, status: 'growing' },
  { id: 'crp-3', farmId: 'frm-1', name: 'Organic Tomatoes', variety: 'Arka Rakshak', sowedDate: '2026-04-15', durationDays: 110, estimatedYieldKg: 4500, status: 'harvesting' }
];

const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'act-1', cropId: 'crp-1', type: 'sowing', title: 'Nursery Transplanting', date: '2026-05-12', cost: 3500, isCompleted: true },
  { id: 'act-2', cropId: 'crp-1', type: 'irrigation', title: 'First Stage Flooding', date: '2026-05-15', cost: 1200, isCompleted: true },
  { id: 'act-3', cropId: 'crp-1', type: 'fertilizer', title: 'First Urea Application', date: '2026-06-10', cost: 4200, isCompleted: true },
  { id: 'act-4', cropId: 'crp-1', type: 'pesticide', title: 'Weedicide spraying', date: '2026-06-25', cost: 2100, isCompleted: false },
  { id: 'act-5', cropId: 'crp-2', type: 'sowing', title: 'Direct Seed Sowing', date: '2026-06-02', cost: 5000, isCompleted: true },
  { id: 'act-6', cropId: 'crp-2', type: 'irrigation', title: 'Sprinkler Canal Irrigation', date: '2026-06-15', cost: 1500, isCompleted: true },
  { id: 'act-7', cropId: 'crp-3', type: 'harvest', title: 'First Picking Tomatoes', date: '2026-06-18', cost: 2400, isCompleted: true }
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', farmId: 'frm-1', category: 'seeds', amount: 8500, date: '2026-05-08', description: 'Bought Premium Basmati seeds certificates' },
  { id: 'exp-2', farmId: 'frm-1', category: 'labor', amount: 12000, date: '2026-05-12', description: 'Transplanting crew hires' },
  { id: 'exp-3', farmId: 'frm-1', category: 'fertilizers', amount: 9400, date: '2026-06-09', description: 'Purchased bio-fertilizers and potash bags' },
  { id: 'exp-4', farmId: 'frm-2', category: 'equipment', amount: 7500, date: '2026-05-29', description: 'Tractor tillage rental' },
  { id: 'exp-5', farmId: 'frm-2', category: 'seeds', amount: 6200, date: '2026-05-30', description: 'Pusa HD-2967 wheat seed sacks' }
];

const INITIAL_DISEASES: DiseaseReport[] = [
  {
    id: 'rep-1',
    cropName: 'Tomato',
    leafType: 'Tomato Leaf',
    imageUrl: 'https://picsum.photos/seed/tomato-blight/400/300',
    diseaseName: 'Tomato Late Blight',
    confidenceScore: 0.94,
    severityLevel: 'High',
    recommendations: [
      'Apply copper-based fungicides immediately.',
      'Prune lower infected canopy leaves and destroy them securely.',
      'Avoid overhead irrigation to reduce humidity on foliage.'
    ],
    status: 'reviewed',
    expertNotes: 'Late Blight spreads extremely fast under high humidity. I recommend copper spray and keeping adjacent crops covered in preventative organic barriers.',
    createdAt: '2026-06-16T10:14:00Z',
    farmerName: 'Jane Doe (Demo Farmer)'
  },
  {
    id: 'rep-2',
    cropName: 'Rice',
    leafType: 'Rice Grass',
    imageUrl: 'https://picsum.photos/seed/rice-blast/400/300',
    diseaseName: 'Rice Blast (Magnaporthe oryzae)',
    confidenceScore: 0.88,
    severityLevel: 'Medium',
    recommendations: [
      'Spray Tricyclazole 75 WP at 0.6 g/liter.',
      'Avoid high doses of nitrogenous fertilizers which favor blast.',
      'Maintain continuous light field inundation water levels.'
    ],
    status: 'detected',
    createdAt: '2026-06-18T14:30:00Z',
    farmerName: 'Jane Doe (Demo Farmer)'
  }
];

const INITIAL_MARKETPLACE: MarketplaceListing[] = [
  { id: 'mkt-1', sellerId: 'usr-1', sellerName: 'Jane Doe (Demo Farmer)', title: 'Premium Basmati Paddy Stock', cropName: 'Paddy', variety: 'Pusa 1121', quantityKg: 5000, pricePerKg: 42, state: 'Haryana', phone: '+1 (555) 019-9901', imagePlaceholder: '🌾', inquiriesCount: 3, createdAt: '2026-06-15' },
  { id: 'mkt-2', sellerId: 'usr-4', sellerName: 'John Smith (Fictional Seller)', title: 'Fresh Yellow Sweet Corn Batch', cropName: 'Corn', variety: 'Sweet Honey', quantityKg: 1200, pricePerKg: 28, state: 'Punjab', phone: '+1 (555) 019-9904', imagePlaceholder: '🌽', inquiriesCount: 1, createdAt: '2026-06-18' },
  { id: 'mkt-3', sellerId: 'usr-5', sellerName: 'Vijay Patil (Fictional Merchant)', title: 'Exporter Standard Onions', cropName: 'Onion', variety: 'Nashik Red', quantityKg: 8000, pricePerKg: 34, state: 'Maharashtra', phone: '+1 (555) 019-9905', imagePlaceholder: '🧅', inquiriesCount: 12, createdAt: '2026-06-14' }
];

const INITIAL_EQUIPMENTS: EquipmentRental[] = [
  { id: 'eq-1', ownerId: 'usr-1', ownerName: 'Jane Doe (Demo Farmer)', title: 'John Deere 5050D Tractor', type: 'tractor', pricePerDay: 1800, available: true, contact: '+1 (555) 019-9901', description: '50HP robust tractor with rotavator attachment ready. Available for renting around Karnal region.', imagePlaceholder: '🚜', location: 'Karnal, Haryana' },
  { id: 'eq-2', ownerId: 'usr-6', ownerName: 'Gurnam Singh (Fictional Owner)', title: 'Laser Land Leveler pro', type: 'harvester', pricePerDay: 2500, available: true, contact: '+1 (555) 019-9906', description: 'Saves 30% water through uniform field leveling. Controlled by accurate laser receivers.', imagePlaceholder: '🛠️', location: 'Panipat, Haryana' },
  { id: 'eq-3', ownerId: 'usr-7', ownerName: 'Satish G (Fictional Supplier)', title: 'Paddy Multi-crop Harvester', type: 'harvester', pricePerDay: 4500, available: false, contact: '+1 (555) 019-9907', description: 'Large scale track harvester for efficient paddy separation. Fast processing speed.', imagePlaceholder: '🌾', location: 'Kurukshetra, Haryana' }
];

const INITIAL_FORUM: ForumPost[] = [
  {
    id: 'post-1',
    authorName: 'Sukhdev Singh (Fictional Grower)',
    authorRole: 'farmer',
    title: 'Yellow rust infestation in early wheat sowings - Help needed!',
    content: 'My HD-3086 wheat crops are showing yellow stripes on the leaves. It started in small patches but seems to be spreading over to the neighbor plot as well. What fungicides produce the fastest response? Temperatures are around 18-24 C.',
    category: 'question',
    likes: 14,
    date: '2026-06-15',
    replies: [
      { id: 'rpl-1', authorName: 'Dr. Amit Sharma (Fictional Expert)', authorRole: 'expert', content: 'This is indeed Yellow Rust (Puccinia striiformis). Spray Propiconazole 25 EC (Tilt) @ 1 ml/liter of water instantly. Propiconazole has systemic activity and will halt spore multiplication. Keep monitoring leaf surfaces.', date: '2026-06-16' },
      { id: 'rpl-2', authorName: 'Jane Doe (Demo Farmer)', authorRole: 'farmer', content: 'Yes, Tilt worked very well for my fields last year! Do not apply during heavy rainfall, check the FarmOS weather forecast first.', date: '2026-06-17' }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Dr. Amit Sharma (Fictional Expert)',
    authorRole: 'expert',
    title: 'Smart Water Management Tips for Sowing Season',
    content: 'With erratic monsoon conditions in Haryana & Punjab, utilizing drip lines is crucial. Overwatering rice during early nursery duration creates shallow root structures which collapse under wind. Ideal moisture should be soft but not waterlogged.',
    category: 'expert',
    likes: 32,
    date: '2026-06-18',
    replies: [
      { id: 'rpl-3', authorName: 'Kuldeep Mand (Fictional Upgrader)', authorRole: 'farmer', content: 'Excellent advice Dr. Amit! I upgraded Green Valley Farm plot B to drip lines and the water bills are down by 35%.', date: '2026-06-18' }
    ]
  },
  {
    id: 'post-3',
    authorName: 'Pratima Patil (Fictional Grower)',
    authorRole: 'farmer',
    title: 'Success Story: 2x tomato yield using precision fertilization schedules',
    content: 'Very happy to report that with nitrogen splitting and micronutrient spraying based on professional advise from agronomists, our family harvested 40 tonnes/acre of organic tomatoes in Nashik! Zero chemical burn on leaves.',
    category: 'success',
    likes: 45,
    date: '2026-06-14',
    replies: []
  }
];

const INITIAL_SCHEMES: GovernmentScheme[] = [
  { id: 'sch-1', name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)', eligibility: 'All landholding farmer families across the country', benefits: 'Direct income support of ₹6,000 per year in three equal installments directly into bank accounts.', category: 'Income Support', state: 'All States', process: 'Register on PM-KISAN portal with Aadhaar, Land Record ownership papers, and Bank Details.' },
  { id: 'sch-2', name: 'PM Fasal Bima Yojana (PMFBY)', eligibility: 'All farmers growing notified crops in notified areas including sharecroppers', benefits: 'Comprehensive crop insurance coverage against natural disasters, pests, and leaf diseases under a low premium rate (1.5% - 2%).', category: 'Crop Insurance', state: 'All States', process: 'Submit application via CSC centers, bank branch, or insurance company broker inside 10 days of sowing.' },
  { id: 'sch-3', name: 'Micro Irrigation Scheme (Per Drop More Crop)', eligibility: 'Farmers with valid agricultural land, priority for small and marginal category', benefits: 'Subsidy up to 55% for small farmers and 45% for other farmers to set up modern drip-irrigation or sprinkler equipment.', category: 'Irrigation Subsidy', state: 'Haryana', process: 'Register on Haryana CADB state portal, upload soil analysis profile water source permit, and vendor quotation.' },
  { id: 'sch-4', name: 'Sub-Mission on Agricultural Mechanization (SMAM)', eligibility: 'Individual farmers, farmer self-help groups, cooperative societies', benefits: '40% to 50% subsidy to purchase high tech tractors, laser levelers, seeder, power tillers, and custom hiring center machinery.', category: 'Machinery Subsidy', state: 'Punjab', process: 'Apply through AGRIMACHINERY portal. Upload Aadhaar link, tractor permit if already owned, and caste certificates if applicable.' }
];

export class LocalDB {
  private static get<T>(key: string, initial: T): T {
    if (typeof window === 'undefined') return initial;
    const item = localStorage.getItem(`farmos_db_${key}`);
    if (!item) {
      localStorage.setItem(`farmos_db_${key}`, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(item);
    } catch {
      return initial;
    }
  }

  private static set<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`farmos_db_${key}`, JSON.stringify(data));
  }

  // Active Role State
  static getActiveRole(): 'farmer' | 'expert' | 'admin' {
    return this.get<'farmer' | 'expert' | 'admin'>('active_role', 'farmer');
  }

  static setActiveRole(role: 'farmer' | 'expert' | 'admin'): void {
    this.set('active_role', role);
  }

  static getActiveRoleSignature(): string | null {
    return this.get<string | null>('active_role_signature', null);
  }

  static setActiveRoleSignature(sig: string | null): void {
    this.set('active_role_signature', sig);
  }

  static async fetchAndStoreRoleSignature(userId: string, role: string): Promise<string | null> {
    try {
      const response = await fetch('/api/auth/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.signature) {
          this.setActiveRoleSignature(data.signature);
          return data.signature;
        }
      }
    } catch (e) {
      console.error("Failed to fetch role signature from server:", e);
    }
    return null;
  }

  // Auth State Simulation
  static getIsLoggedIn(): boolean {
    return this.get<boolean>('is_logged_in', false);
  }

  static setIsLoggedIn(val: boolean): void {
    this.set('is_logged_in', val);
    if (!val) {
      this.setCurrentUserId(null);
      this.setActiveRoleSignature(null);
    }
  }

  static getCurrentUserId(): string | null {
    return this.get<string | null>('current_user_id', null);
  }

  static setCurrentUserId(id: string | null): void {
    this.set('current_user_id', id);
  }

  static getCurrentUser(): User | null {
    if (!this.getIsLoggedIn()) return null;
    const uid = this.getCurrentUserId();
    if (!uid) return null;
    const users = this.getUsers();
    return users.find(u => u.id === uid) || null;
  }

  static verifyLogin(email: string, password: string): User | null {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.trim().toLowerCase() === normalizedEmail);
    if (user && user.password === password) {
      this.setIsLoggedIn(true);
      this.setCurrentUserId(user.id);
      this.setActiveRole(user.role);
      return user;
    }
    return null;
  }

  static registerUser(
    name: string,
    email: string,
    password: string,
    role: 'farmer' | 'expert' | 'admin',
    phone = '',
    district = '',
    state = ''
  ): User | null {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const exists = users.some(u => u.email.trim().toLowerCase() === normalizedEmail);
    if (exists) return null;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: normalizedEmail,
      role,
      phone,
      district,
      state,
      password
    };

    users.push(newUser);
    this.setUsers(users);

    // Auto log in after registration
    this.setIsLoggedIn(true);
    this.setCurrentUserId(newUser.id);
    this.setActiveRole(role);

    return newUser;
  }

  static updateUserProfile(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx > -1) {
      users[idx] = { ...users[idx], ...updates };
      this.setUsers(users);
      return users[idx];
    }
    return null;
  }

  static resetPassword(email: string, newPassword: string): boolean {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const idx = users.findIndex(u => u.email.trim().toLowerCase() === normalizedEmail);
    if (idx > -1) {
      users[idx].password = newPassword;
      this.setUsers(users);
      return true;
    }
    return false;
  }

  // Notifications Persistence
  static getNotifications(): { id: number; type: string; text: string; time: string; unread: boolean; }[] {
    return this.get('notifications', [
      { id: 1, type: 'weather', text: 'Rain alert: 85% probability in Karnal tomorrow. Secure harvested paddy.', time: '10m ago', unread: true },
      { id: 2, type: 'disease', text: 'Dr. Amit Sharma commented on your Tomato Late Blight report.', time: '2h ago', unread: true },
      { id: 3, type: 'market', text: 'Basmati Paddy market price increased by +3.2% in Taraori Mandi.', time: '1d ago', unread: false }
    ]);
  }

  static setNotifications(items: { id: number; type: string; text: string; time: string; unread: boolean; }[]): void {
    this.set('notifications', items);
  }

  // Core Entity CRUD operations
  static getUsers(): User[] { return this.get('users', INITIAL_USERS); }
  static setUsers(users: User[]): void { this.set('users', users); }

  static getFarms(): Farm[] { return this.get('farms', INITIAL_FARMS); }
  static setFarms(farms: Farm[]): void { this.set('farms', farms); }
  static addFarm(farm: Omit<Farm, 'id' | 'userId'>): Farm {
    const list = this.getFarms();
    const currentUserId = this.getCurrentUserId() || 'usr-1';
    const newFarm: Farm = { ...farm, id: `frm-${Date.now()}`, userId: currentUserId };
    list.push(newFarm);
    this.setFarms(list);
    return newFarm;
  }

  static getCrops(): Crop[] { return this.get('crops', INITIAL_CROPS); }
  static setCrops(crops: Crop[]): void { this.set('crops', crops); }
  static addCrop(crop: Omit<Crop, 'id'>): Crop {
    const list = this.getCrops();
    const newCrop: Crop = { ...crop, id: `crp-${Date.now()}` };
    list.push(newCrop);
    this.setCrops(list);
    return newCrop;
  }
  static updateCrop(id: string, updates: Partial<Crop>): Crop {
    const list = this.getCrops();
    const idx = list.findIndex(c => c.id === id);
    if (idx > -1) {
      list[idx] = { ...list[idx], ...updates };
      this.setCrops(list);
      return list[idx];
    }
    throw new Error('Crop not found');
  }

  static getActivities(): Activity[] { return this.get('activities', INITIAL_ACTIVITIES); }
  static setActivities(activities: Activity[]): void { this.set('activities', activities); }
  static addActivity(act: Omit<Activity, 'id' | 'isCompleted'>): Activity {
    const list = this.getActivities();
    const newAct: Activity = { ...act, id: `act-${Date.now()}`, isCompleted: false };
    list.push(newAct);
    this.setActivities(list);
    return newAct;
  }
  static toggleActivity(id: string): Activity {
    const list = this.getActivities();
    const idx = list.findIndex(a => a.id === id);
    if (idx > -1) {
      list[idx].isCompleted = !list[idx].isCompleted;
      this.setActivities(list);
      return list[idx];
    }
    throw new Error('Activity not found');
  }
  static addExpense(exp: Omit<Expense, 'id'>): Expense {
    const list = this.getExpenses();
    const newExp: Expense = { ...exp, id: `exp-${Date.now()}` };
    list.push(newExp);
    this.setExpenses(list);
    return newExp;
  }

  static getExpenses(): Expense[] { return this.get('expenses', INITIAL_EXPENSES); }
  static setExpenses(expenses: Expense[]): void { this.set('expenses', expenses); }

  static getAllDiseasesRaw(): DiseaseReport[] { return this.get('diseases', INITIAL_DISEASES); }
  static setDiseases(diseases: DiseaseReport[]): void { this.set('diseases', diseases); }
  
  static getDiseases(): DiseaseReport[] {
    const all = this.getAllDiseasesRaw();
    const user = this.getCurrentUser();
    const activeRole = this.getActiveRole();
    const isLoggedIn = this.getIsLoggedIn();

    if (!isLoggedIn || !user) {
      return [];
    }

    if (activeRole === 'admin') {
      return all;
    }

    if (activeRole === 'expert') {
      // Expert: assigned reports (all reports in the system for this simulation)
      return all;
    }

    if (activeRole === 'farmer') {
      // Farmer: own reports only
      return all.filter(r => r.farmerName === user.name);
    }

    return [];
  }

  static addDiseaseReport(report: Omit<DiseaseReport, 'id' | 'createdAt' | 'status' | 'farmerName'>): DiseaseReport {
    const list = this.getAllDiseasesRaw();
    const currentUser = this.getCurrentUser();
    const newReport: DiseaseReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'detected',
      farmerName: currentUser?.name || 'Jane Doe (Demo Farmer)',
      createdAt: new Date().toISOString()
    };
    list.unshift(newReport);
    this.setDiseases(list);
    return newReport;
  }
  static updateDiseaseReportStatus(id: string, status: 'reviewed' | 'resolved', notes?: string): DiseaseReport {
    const list = this.getAllDiseasesRaw();
    const idx = list.findIndex(r => r.id === id);
    if (idx > -1) {
      list[idx].status = status;
      if (notes !== undefined) {
        list[idx].expertNotes = notes;
      }
      this.setDiseases(list);
      return list[idx];
    }
    throw new Error('Disease report not found');
  }

  static getMarketplace(): MarketplaceListing[] { return this.get('marketplace', INITIAL_MARKETPLACE); }
  static setMarketplace(listings: MarketplaceListing[]): void { this.set('marketplace', listings); }
  static addMarketplaceListing(listing: Omit<MarketplaceListing, 'id' | 'sellerId' | 'sellerName' | 'inquiriesCount' | 'createdAt'>): MarketplaceListing {
    const list = this.getMarketplace();
    const currentUser = this.getCurrentUser();
    const newListing: MarketplaceListing = {
      ...listing,
      id: `mkt-${Date.now()}`,
      sellerId: currentUser?.id || 'usr-1',
      sellerName: currentUser?.name || 'Jane Doe (Demo Farmer)',
      inquiriesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(newListing);
    this.setMarketplace(list);
    return newListing;
  }

  static getEquipments(): EquipmentRental[] { return this.get('equipments', INITIAL_EQUIPMENTS); }
  static setEquipments(equipments: EquipmentRental[]): void { this.set('equipments', equipments); }
  static addEquipmentRental(rental: Omit<EquipmentRental, 'id' | 'ownerId' | 'ownerName' | 'available'>): EquipmentRental {
    const list = this.getEquipments();
    const currentUser = this.getCurrentUser();
    const newRental: EquipmentRental = {
      ...rental,
      id: `eq-${Date.now()}`,
      ownerId: currentUser?.id || 'usr-1',
      ownerName: currentUser?.name || 'Jane Doe (Demo Farmer)',
      available: true
    };
    list.unshift(newRental);
    this.setEquipments(list);
    return newRental;
  }
  static toggleEquipmentAvailability(id: string): EquipmentRental {
    const list = this.getEquipments();
    const idx = list.findIndex(e => e.id === id);
    if (idx > -1) {
      list[idx].available = !list[idx].available;
      this.setEquipments(list);
      return list[idx];
    }
    throw new Error('Equipment not found');
  }

  static getForum(): ForumPost[] { return this.get('forum', INITIAL_FORUM); }
  static setForum(forum: ForumPost[]): void { this.set('forum', forum); }
  static addForumPost(title: string, content: string, category: 'discussion' | 'question' | 'success'): ForumPost {
    const list = this.getForum();
    const currentUser = this.getCurrentUser();
    const role = this.getActiveRole();
    const name = currentUser?.name || (role === 'farmer' ? 'Jane Doe (Demo Farmer)' : role === 'expert' ? 'Dr. Amit Sharma (Fictional Expert)' : 'FarmOS Demo Admin');
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      authorName: name,
      authorRole: role,
      title,
      content,
      category,
      likes: 0,
      date: new Date().toISOString().split('T')[0],
      replies: []
    };
    list.unshift(newPost);
    this.setForum(list);
    return newPost;
  }
  static AddReplyToPost(postId: string, content: string): ForumPost {
    const list = this.getForum();
    const currentUser = this.getCurrentUser();
    const role = this.getActiveRole();
    const name = currentUser?.name || (role === 'farmer' ? 'Jane Doe (Demo Farmer)' : role === 'expert' ? 'Dr. Amit Sharma (Fictional Expert)' : 'FarmOS Demo Admin');
    const idx = list.findIndex(p => p.id === postId);
    if (idx > -1) {
      list[idx].replies.push({
        id: `rpl-${Date.now()}`,
        authorName: name,
        authorRole: role,
        content,
        date: new Date().toISOString().split('T')[0]
      });
      this.setForum(list);
      return list[idx];
    }
    throw new Error('Post not found');
  }
  static likePost(postId: string): ForumPost {
    const list = this.getForum();
    const idx = list.findIndex(p => p.id === postId);
    if (idx > -1) {
      list[idx].likes += 1;
      this.setForum(list);
      return list[idx];
    }
    throw new Error('Post not found');
  }

  static getSchemes(): GovernmentScheme[] { return INITIAL_SCHEMES; }
}
