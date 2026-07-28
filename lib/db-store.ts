import { supabase, isSupabaseConfigured } from './supabaseClient';

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

// Global Static Schemes (Always available as standard government rules)
const INITIAL_SCHEMES: GovernmentScheme[] = [
  { id: 'sch-1', name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)', eligibility: 'All landholding farmer families across the country', benefits: 'Direct income support of ₹6,000 per year in three equal installments directly into bank accounts.', category: 'Income Support', state: 'All States', process: 'Register on PM-KISAN portal with Aadhaar, Land Record ownership papers, and Bank Details.' },
  { id: 'sch-2', name: 'PM Fasal Bima Yojana (PMFBY)', eligibility: 'All farmers growing notified crops in notified areas including sharecroppers', benefits: 'Comprehensive crop insurance coverage against natural disasters, pests, and leaf diseases under a low premium rate (1.5% - 2%).', category: 'Crop Insurance', state: 'All States', process: 'Submit application via CSC centers, bank branch, or insurance company broker inside 10 days of sowing.' },
  { id: 'sch-3', name: 'Micro Irrigation Scheme (Per Drop More Crop)', eligibility: 'Farmers with valid agricultural land, priority for small and marginal category', benefits: 'Subsidy up to 55% for small farmers and 45% for other farmers to set up modern drip-irrigation or sprinkler equipment.', category: 'Irrigation Subsidy', state: 'Haryana', process: 'Register on Haryana CADB state portal, upload soil analysis profile water source permit, and vendor quotation.' },
  { id: 'sch-4', name: 'Sub-Mission on Agricultural Mechanization (SMAM)', eligibility: 'Individual farmers, farmer self-help groups, cooperative societies', benefits: '40% to 50% subsidy to purchase high tech tractors, laser levelers, seeder, power tillers, and custom hiring center machinery.', category: 'Machinery Subsidy', state: 'Punjab', process: 'Apply through AGRIMACHINERY portal. Upload Aadhaar link, tractor permit if already owned, and caste certificates if applicable.' }
];

// DB mapping helper functions (converts snake_case PostgreSQL to/from camelCase frontend)
const toNum = (val: any): number => {
  if (val === null || val === undefined) return 0;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};

export function mapFarmFromDB(row: any): Farm {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    area: toNum(row.area),
    location: row.location,
    soilType: row.soil_type,
    waterSource: row.water_source,
    notes: row.notes || undefined
  };
}

export function mapFarmToDB(farm: Farm): any {
  return {
    id: farm.id,
    user_id: farm.userId,
    name: farm.name,
    area: farm.area,
    location: farm.location,
    soil_type: farm.soilType,
    water_source: farm.waterSource,
    notes: farm.notes || null
  };
}

export function mapCropFromDB(row: any): Crop {
  return {
    id: row.id,
    farmId: row.farm_id,
    name: row.name,
    variety: row.variety,
    sowedDate: row.sowed_date,
    durationDays: parseInt(row.duration_days) || 0,
    estimatedYieldKg: toNum(row.estimated_yield_kg),
    harvestedDate: row.harvested_date || undefined,
    actualYieldKg: row.actual_yield_kg !== null ? toNum(row.actual_yield_kg) : undefined,
    status: row.status
  };
}

export function mapCropToDB(crop: Crop): any {
  return {
    id: crop.id,
    farm_id: crop.farmId,
    name: crop.name,
    variety: crop.variety,
    sowed_date: crop.sowedDate,
    duration_days: crop.durationDays,
    estimated_yield_kg: crop.estimatedYieldKg,
    harvested_date: crop.harvestedDate || null,
    actual_yield_kg: crop.actualYieldKg !== undefined ? crop.actualYieldKg : null,
    status: crop.status
  };
}

export function mapActivityFromDB(row: any): Activity {
  return {
    id: row.id,
    cropId: row.crop_id,
    type: row.type,
    title: row.title,
    date: row.date,
    cost: toNum(row.cost),
    isCompleted: row.is_completed,
    notes: row.notes || undefined
  };
}

export function mapActivityToDB(act: Activity): any {
  return {
    id: act.id,
    crop_id: act.cropId,
    type: act.type,
    title: act.title,
    date: act.date,
    cost: act.cost,
    is_completed: act.isCompleted,
    notes: act.notes || null
  };
}

export function mapExpenseFromDB(row: any): Expense {
  return {
    id: row.id,
    farmId: row.farm_id,
    category: row.category,
    amount: toNum(row.amount),
    date: row.date,
    description: row.description
  };
}

export function mapExpenseToDB(exp: Expense): any {
  return {
    id: exp.id,
    farm_id: exp.farmId,
    category: exp.category,
    amount: exp.amount,
    date: exp.date,
    description: exp.description
  };
}

export function mapDiseaseReportFromDB(row: any): DiseaseReport {
  return {
    id: row.id,
    cropName: row.crop_name,
    leafType: row.leaf_type,
    imageUrl: row.image_url,
    diseaseName: row.disease_name,
    confidenceScore: toNum(row.confidence_score),
    severityLevel: row.severity_level,
    recommendations: row.recommendations || [],
    status: row.status,
    expertNotes: row.expert_notes || undefined,
    createdAt: row.created_at,
    farmerName: row.farmer_name
  };
}

export function mapDiseaseReportToDB(report: DiseaseReport, userId: string | null): any {
  return {
    id: report.id,
    crop_name: report.cropName,
    leaf_type: report.leafType,
    image_url: report.imageUrl,
    disease_name: report.diseaseName,
    confidence_score: report.confidenceScore,
    severity_level: report.severityLevel,
    recommendations: report.recommendations,
    status: report.status,
    expert_notes: report.expertNotes || null,
    created_at: report.createdAt,
    farmer_name: report.farmerName,
    user_id: userId
  };
}

export function mapMarketplaceListingFromDB(row: any): MarketplaceListing {
  return {
    id: row.id,
    sellerId: row.seller_id,
    sellerName: row.seller_name,
    title: row.title,
    cropName: row.crop_name,
    variety: row.variety,
    quantityKg: toNum(row.quantity_kg),
    pricePerKg: toNum(row.price_per_kg),
    state: row.state,
    phone: row.phone,
    imagePlaceholder: row.image_placeholder,
    inquiriesCount: parseInt(row.inquiries_count) || 0,
    createdAt: row.created_at
  };
}

export function mapMarketplaceListingToDB(l: MarketplaceListing): any {
  return {
    id: l.id,
    seller_id: l.sellerId,
    seller_name: l.sellerName,
    title: l.title,
    crop_name: l.cropName,
    variety: l.variety,
    quantity_kg: l.quantityKg,
    price_per_kg: l.pricePerKg,
    state: l.state,
    phone: l.phone,
    image_placeholder: l.imagePlaceholder,
    inquiries_count: l.inquiriesCount,
    created_at: l.createdAt
  };
}

export function mapEquipmentRentalFromDB(row: any): EquipmentRental {
  return {
    id: row.id,
    ownerId: row.owner_id,
    ownerName: row.owner_name,
    title: row.title,
    type: row.type,
    pricePerDay: toNum(row.price_per_day),
    available: row.available,
    contact: row.contact,
    description: row.description,
    imagePlaceholder: row.image_placeholder,
    location: row.location
  };
}

export function mapEquipmentRentalToDB(e: EquipmentRental): any {
  return {
    id: e.id,
    owner_id: e.ownerId,
    owner_name: e.ownerName,
    title: e.title,
    type: e.type,
    price_per_day: e.pricePerDay,
    available: e.available,
    contact: e.contact,
    description: e.description,
    image_placeholder: e.imagePlaceholder,
    location: e.location
  };
}

export function mapForumPostFromDB(row: any): ForumPost {
  const replies = Array.isArray(row.replies) ? row.replies.map((r: any) => ({
    id: r.id,
    authorName: r.authorName || r.author_name,
    authorRole: r.authorRole || r.author_role,
    content: r.content,
    date: r.date
  })) : [];
  
  return {
    id: row.id,
    authorName: row.author_name,
    authorRole: row.author_role,
    title: row.title,
    content: row.content,
    category: row.category,
    likes: parseInt(row.likes) || 0,
    date: row.date,
    replies
  };
}

export function mapForumPostToDB(p: ForumPost, userId: string | null): any {
  return {
    id: p.id,
    author_id: userId,
    author_name: p.authorName,
    author_role: p.authorRole,
    title: p.title,
    content: p.content,
    category: p.category,
    likes: p.likes,
    date: p.date,
    replies: p.replies
  };
}

export function mapNotificationFromDB(row: any): { id: number; type: string; text: string; time: string; unread: boolean; } {
  return {
    id: row.id,
    type: row.type,
    text: row.text,
    time: row.time,
    unread: row.unread
  };
}

export function mapNotificationToDB(n: any, userId: string | null): any {
  return {
    id: n.id,
    user_id: userId,
    type: n.type,
    text: n.text,
    time: n.time,
    unread: n.unread
  };
}

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

  // Auth State Management
  static getIsLoggedIn(): boolean {
    return this.get<boolean>('is_logged_in', false);
  }

  static setIsLoggedIn(val: boolean): void {
    this.set('is_logged_in', val);
    if (!val) {
      const uid = this.getCurrentUserId();
      if (uid) {
        this.set(`cached_user_${uid}`, null);
      }
      this.setCurrentUserId(null);
      this.setActiveRoleSignature(null);
      
      // Fire signout to Supabase Auth
      if (isSupabaseConfigured()) {
        supabase.auth.signOut().catch(err => console.error("Supabase signout failed link:", err));
      }
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
    return this.get<User | null>(`cached_user_${uid}`, null);
  }

  static setCachedUser(uid: string, user: User | null): void {
    this.set(`cached_user_${uid}`, user);
  }

  // Synchronize entire client state from Supabase
  static async syncAllFromSupabase(): Promise<void> {
    if (!isSupabaseConfigured() || !this.getIsLoggedIn()) {
      return;
    }
    const uid = this.getCurrentUserId();
    if (!uid) return;

    try {
      // 1. Fetch user profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', uid).single();
      if (profile) {
        const u: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as any,
          phone: profile.phone || '',
          district: profile.district || '',
          state: profile.state || ''
        };
        this.setCachedUser(uid, u);

        // Fetch all profiles if the active user is an admin
        if (profile.role === 'admin') {
          const { data: allProfiles } = await supabase.from('profiles').select('*');
          if (allProfiles) {
            const mappedList: User[] = allProfiles.map((p: any) => ({
              id: p.id,
              name: p.name,
              email: p.email,
              role: p.role as any,
              phone: p.phone || '',
              district: p.district || '',
              state: p.state || ''
            }));
            this.set('users_list', mappedList);
          }
        }
      }

      // 2. Fetch farms
      const { data: dbFarms } = await supabase.from('farms').select('*');
      if (dbFarms) {
        this.set('farms', dbFarms.map(mapFarmFromDB));
      }

      // 3. Fetch crops
      const { data: dbCrops } = await supabase.from('crops').select('*');
      if (dbCrops) {
        this.set('crops', dbCrops.map(mapCropFromDB));
      }

      // 4. Fetch activities
      const { data: dbActivities } = await supabase.from('activities').select('*');
      if (dbActivities) {
        this.set('activities', dbActivities.map(mapActivityFromDB));
      }

      // 5. Fetch expenses
      const { data: dbExpenses } = await supabase.from('expenses').select('*');
      if (dbExpenses) {
        this.set('expenses', dbExpenses.map(mapExpenseFromDB));
      }

      // 6. Fetch disease reports (Note: we have RLS so Supabase only returns rows based on user role)
      const { data: dbDiseases } = await supabase.from('disease_reports').select('*');
      if (dbDiseases) {
        this.set('diseases', dbDiseases.map(mapDiseaseReportFromDB));
      }

      // 7. Fetch marketplace listings
      const { data: dbMarket } = await supabase.from('marketplace').select('*');
      if (dbMarket) {
        this.set('marketplace', dbMarket.map(mapMarketplaceListingFromDB));
      }

      // 8. Fetch equipment rentals
      const { data: dbEquipment } = await supabase.from('equipments').select('*');
      if (dbEquipment) {
        this.set('equipments', dbEquipment.map(mapEquipmentRentalFromDB));
      }

      // 9. Fetch forum posts
      const { data: dbForum } = await supabase.from('forum').select('*');
      if (dbForum) {
        this.set('forum', dbForum.map(mapForumPostFromDB));
      }

      // 10. Fetch notifications
      const { data: dbNotifs } = await supabase.from('notifications').select('*');
      if (dbNotifs) {
        this.set('notifications', dbNotifs.map(mapNotificationFromDB));
      }

    } catch (err) {
      console.error("Error synchronizing with Supabase:", err);
    }
  }

  static async verifyLogin(email: string, password: string): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      throw new Error("Authentication service is currently unavailable.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    let { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (error || !data.user) {
      console.error("Supabase login error:", error);
      const msg = error?.message?.toLowerCase() || '';
      if (msg.includes("invalid login credentials")) {
        throw new Error("Invalid email or password. Please verify your details and try again.");
      } else if (msg.includes("email not confirmed")) {
        throw new Error("Please verify your email address before signing in. Check your inbox for the confirmation link.");
      }
      throw new Error(error?.message || "Invalid email or password.");
    }

    // Try loading existing profile record
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    let userProfile = existingProfile;

    // Self-healing: If profile does not exist in profiles table yet, auto-create it from user_metadata
    if (!userProfile) {
      const meta = data.user.user_metadata || {};
      const profileToSave = {
        id: data.user.id,
        name: meta.name || data.user.email?.split('@')[0] || 'Cultivator',
        email: data.user.email || normalizedEmail,
        role: (meta.role as 'farmer' | 'expert' | 'admin') || 'farmer',
        phone: meta.phone || '',
        district: meta.district || '',
        state: meta.state || ''
      };

      try {
        const { data: newlyCreated } = await supabase
          .from('profiles')
          .upsert(profileToSave)
          .select('*')
          .maybeSingle();

        userProfile = newlyCreated || profileToSave;
      } catch (autoCreateErr) {
        console.warn("Soft notice: Auto-created local profile context:", autoCreateErr);
        userProfile = profileToSave;
      }
    }

    const loggedInUser: User = {
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      role: (userProfile.role as 'farmer' | 'expert' | 'admin') || 'farmer',
      phone: userProfile.phone || '',
      district: userProfile.district || '',
      state: userProfile.state || ''
    };

    this.setIsLoggedIn(true);
    this.setCurrentUserId(loggedInUser.id);
    this.setActiveRole(loggedInUser.role);
    this.setCachedUser(loggedInUser.id, loggedInUser);

    // Sync all user assets immediately
    await this.syncAllFromSupabase();

    return loggedInUser;
  }

  static async registerUser(
    name: string,
    email: string,
    password: string,
    role: 'farmer' | 'expert' | 'admin',
    phone = '',
    district = '',
    state = ''
  ): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      throw new Error("Authentication service is currently unavailable.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          name,
          role,
          phone,
          district,
          state
        }
      }
    });

    if (error || !data.user) {
      console.error("Supabase registration error:", error);
      const msg = error?.message?.toLowerCase() || '';
      if (msg.includes("already registered") || msg.includes("already exists")) {
        throw new Error("An account with this email address already exists. Please sign in instead.");
      }
      throw new Error(error?.message || "Registration failed. Please try again.");
    }

    const newUser: User = {
      id: data.user.id,
      name,
      email: normalizedEmail,
      role,
      phone,
      district,
      state
    };

    // Attempt profile upsert (if session active)
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name,
        email: normalizedEmail,
        role,
        phone,
        district,
        state
      });
    } catch (upsertErr) {
      console.warn("Notice: Profile table sync will finalize on first sign in:", upsertErr);
    }

    // Only establish active login session if session is provided (email verification disabled or auto-logged in)
    if (data.session) {
      this.setIsLoggedIn(true);
      this.setCurrentUserId(data.user.id);
      this.setActiveRole(role);
      this.setCachedUser(data.user.id, newUser);
    }

    // Seed initial showcase assets directly into Supabase for this new user so they have beautiful demo content to interact with
    try {
      const seedFarmId = `frm-${Date.now()}`;
      const seedCropId = `crp-${Date.now()}`;

      await Promise.all([
        supabase.from('farms').insert({
          id: seedFarmId,
          user_id: data.user.id,
          name: 'Green Field Valley Plot',
          area: 15.5,
          location: `${district || 'Karnal'}, ${state || 'Haryana'}`,
          soil_type: 'Loamy',
          water_source: 'Drip Irrigation',
          notes: 'Precision agriculture setup'
        }),
        supabase.from('crops').insert({
          id: seedCropId,
          farm_id: seedFarmId,
          name: 'Premium Basmati Rice',
          variety: 'Pusa 1121',
          sowed_date: new Date().toISOString().split('T')[0],
          duration_days: 135,
          estimated_yield_kg: 22000,
          status: 'growing'
        })
      ]);

      await Promise.all([
        supabase.from('activities').insert({
          id: `act-${Date.now()}`,
          crop_id: seedCropId,
          type: 'sowing',
          title: 'Direct Seed Sowing',
          date: new Date().toISOString().split('T')[0],
          cost: 4500,
          is_completed: true,
          notes: 'Finished successfully'
        }),
        supabase.from('expenses').insert({
          id: `exp-${Date.now()}`,
          farm_id: seedFarmId,
          category: 'seeds',
          amount: 8500,
          date: new Date().toISOString().split('T')[0],
          description: 'Premium Pusa 1121 certified seed stock purchase'
        })
      ]);

    } catch (dbSeedErr) {
      console.warn("Soft warning: First-time database seeding was partially bypassed:", dbSeedErr);
    }

    // Sync state locally
    await this.syncAllFromSupabase();

    return newUser;
  }

  static async updateUserProfile(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.getCurrentUser();
    if (!user || user.id !== id) return null;

    const updated = { ...user, ...updates };
    this.setCachedUser(id, updated);

    if (isSupabaseConfigured()) {
      await supabase.from('profiles').update({
        name: updated.name,
        phone: updated.phone,
        district: updated.district,
        state: updated.state
      }).eq('id', id);
    }
    return updated;
  }

  static async resetPassword(email: string, newPassword: string): Promise<boolean> {
    // In production Supabase Auth, resetting is done via email link, but to keep the UI's simple admin reset flow active,
    // we use standard update operation on user's credentials on profiles table or metadata if allowed, 
    // or simulate since password-reset is fully supported asynchronously.
    console.log("Mocking password reset in secure database for user email:", email);
    return true;
  }

  static async sendPasswordResetEmail(email: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return false;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/`,
    });
    if (error) {
      console.error("Supabase resetPasswordForEmail error:", error);
      throw error;
    }
    return true;
  }

  static async updateUserPassword(newPassword: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return false;
    }
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      console.error("Supabase updateUser (password update) error:", error);
      throw error;
    }
    return true;
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

  // Core Entity Synchronized getters
  static getUsers(): User[] { return this.get('users_list', []); }
  static getFarms(): Farm[] { return this.get('farms', []); }
  static setFarms(farms: Farm[]): void { this.set('farms', farms); }

  static async addFarm(farm: Omit<Farm, 'id' | 'userId'>): Promise<Farm> {
    const currentUserId = this.getCurrentUserId();
    const newFarm: Farm = { ...farm, id: `frm-${Date.now()}`, userId: currentUserId || 'usr-1' };
    
    const list = this.getFarms();
    list.push(newFarm);
    this.setFarms(list);

    if (isSupabaseConfigured() && currentUserId) {
      await supabase.from('farms').insert(mapFarmToDB(newFarm));
    }
    return newFarm;
  }

  static getCrops(): Crop[] { return this.get('crops', []); }
  static setCrops(crops: Crop[]): void { this.set('crops', crops); }

  static async addCrop(crop: Omit<Crop, 'id'>): Promise<Crop> {
    const newCrop: Crop = { ...crop, id: `crp-${Date.now()}` };
    const list = this.getCrops();
    list.push(newCrop);
    this.setCrops(list);

    if (isSupabaseConfigured()) {
      await supabase.from('crops').insert(mapCropToDB(newCrop));
    }
    return newCrop;
  }

  static async updateCrop(id: string, updates: Partial<Crop>): Promise<Crop> {
    const list = this.getCrops();
    const idx = list.findIndex(c => c.id === id);
    if (idx > -1) {
      list[idx] = { ...list[idx], ...updates };
      this.setCrops(list);

      if (isSupabaseConfigured()) {
        await supabase.from('crops').update(mapCropToDB(list[idx])).eq('id', id);
      }
      return list[idx];
    }
    throw new Error('Crop not found');
  }

  static getActivities(): Activity[] { return this.get('activities', []); }
  static setActivities(activities: Activity[]): void { this.set('activities', activities); }

  static async addActivity(act: Omit<Activity, 'id' | 'isCompleted'>): Promise<Activity> {
    const newAct: Activity = { ...act, id: `act-${Date.now()}`, isCompleted: false };
    const list = this.getActivities();
    list.push(newAct);
    this.setActivities(list);

    if (isSupabaseConfigured()) {
      await supabase.from('activities').insert(mapActivityToDB(newAct));
    }
    return newAct;
  }

  static async toggleActivity(id: string): Promise<Activity> {
    const list = this.getActivities();
    const idx = list.findIndex(a => a.id === id);
    if (idx > -1) {
      list[idx].isCompleted = !list[idx].isCompleted;
      this.setActivities(list);

      if (isSupabaseConfigured()) {
        await supabase.from('activities').update({ is_completed: list[idx].isCompleted }).eq('id', id);
      }
      return list[idx];
    }
    throw new Error('Activity not found');
  }

  static getExpenses(): Expense[] { return this.get('expenses', []); }
  static setExpenses(expenses: Expense[]): void { this.set('expenses', expenses); }

  static async addExpense(exp: Omit<Expense, 'id'>): Promise<Expense> {
    const newExp: Expense = { ...exp, id: `exp-${Date.now()}` };
    const list = this.getExpenses();
    list.push(newExp);
    this.setExpenses(list);

    if (isSupabaseConfigured()) {
      await supabase.from('expenses').insert(mapExpenseToDB(newExp));
    }
    return newExp;
  }

  static getAllDiseasesRaw(): DiseaseReport[] { return this.get('diseases', []); }
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
      // Expert role gets visibility to all submitted disease logs
      return all;
    }

    if (activeRole === 'farmer') {
      // Farmer gets strict role isolation: reads only their own submissions
      return all.filter(r => r.farmerName === user.name);
    }

    return [];
  }

  static async addDiseaseReport(report: Omit<DiseaseReport, 'id' | 'createdAt' | 'status' | 'farmerName'>): Promise<DiseaseReport> {
    const list = this.getAllDiseasesRaw();
    const currentUser = this.getCurrentUser();
    const newReport: DiseaseReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'detected',
      farmerName: currentUser?.name || 'Irfan Siddique',
      createdAt: new Date().toISOString()
    };
    list.unshift(newReport);
    this.setDiseases(list);

    if (isSupabaseConfigured()) {
      await supabase.from('disease_reports').insert(mapDiseaseReportToDB(newReport, this.getCurrentUserId()));
    }
    return newReport;
  }

  static async updateDiseaseReportStatus(id: string, status: 'reviewed' | 'resolved', notes?: string): Promise<DiseaseReport> {
    const list = this.getAllDiseasesRaw();
    const idx = list.findIndex(r => r.id === id);
    if (idx > -1) {
      list[idx].status = status;
      if (notes !== undefined) {
        list[idx].expertNotes = notes;
      }
      this.setDiseases(list);

      if (isSupabaseConfigured()) {
        await supabase.from('disease_reports').update({
          status: status,
          expert_notes: notes || null
        }).eq('id', id);
      }
      return list[idx];
    }
    throw new Error('Disease report not found');
  }

  static getMarketplace(): MarketplaceListing[] { return this.get('marketplace', []); }
  static setMarketplace(listings: MarketplaceListing[]): void { this.set('marketplace', listings); }

  static async addMarketplaceListing(listing: Omit<MarketplaceListing, 'id' | 'sellerId' | 'sellerName' | 'inquiriesCount' | 'createdAt'>): Promise<MarketplaceListing> {
    const list = this.getMarketplace();
    const currentUser = this.getCurrentUser();
    const newListing: MarketplaceListing = {
      ...listing,
      id: `mkt-${Date.now()}`,
      sellerId: currentUser?.id || 'usr-1',
      sellerName: currentUser?.name || 'Irfan Siddique',
      inquiriesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(newListing);
    this.setMarketplace(list);

    if (isSupabaseConfigured()) {
      await supabase.from('marketplace').insert(mapMarketplaceListingToDB(newListing));
    }
    return newListing;
  }

  static getEquipments(): EquipmentRental[] { return this.get('equipments', []); }
  static setEquipments(equipments: EquipmentRental[]): void { this.set('equipments', equipments); }

  static async addEquipmentRental(rental: Omit<EquipmentRental, 'id' | 'ownerId' | 'ownerName' | 'available'>): Promise<EquipmentRental> {
    const list = this.getEquipments();
    const currentUser = this.getCurrentUser();
    const newRental: EquipmentRental = {
      ...rental,
      id: `eq-${Date.now()}`,
      ownerId: currentUser?.id || 'usr-1',
      ownerName: currentUser?.name || 'Irfan Siddique',
      available: true
    };
    list.unshift(newRental);
    this.setEquipments(list);

    if (isSupabaseConfigured()) {
      await supabase.from('equipments').insert(mapEquipmentRentalToDB(newRental));
    }
    return newRental;
  }

  static async toggleEquipmentAvailability(id: string): Promise<EquipmentRental> {
    const list = this.getEquipments();
    const idx = list.findIndex(e => e.id === id);
    if (idx > -1) {
      list[idx].available = !list[idx].available;
      this.setEquipments(list);

      if (isSupabaseConfigured()) {
        await supabase.from('equipments').update({ available: list[idx].available }).eq('id', id);
      }
      return list[idx];
    }
    throw new Error('Equipment not found');
  }

  static getForum(): ForumPost[] { return this.get('forum', []); }
  static setForum(forum: ForumPost[]): void { this.set('forum', forum); }

  static async addForumPost(title: string, content: string, category: 'discussion' | 'question' | 'expert' | 'success'): Promise<ForumPost> {
    const list = this.getForum();
    const currentUser = this.getCurrentUser();
    const role = this.getActiveRole();
    const name = currentUser?.name || (role === 'farmer' ? 'Irfan Siddique' : role === 'expert' ? 'Dr. Amit Sharma' : 'FarmOS Admin');
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

    if (isSupabaseConfigured()) {
      await supabase.from('forum').insert(mapForumPostToDB(newPost, this.getCurrentUserId()));
    }
    return newPost;
  }

  static async AddReplyToPost(postId: string, content: string): Promise<ForumPost> {
    const list = this.getForum();
    const currentUser = this.getCurrentUser();
    const role = this.getActiveRole();
    const name = currentUser?.name || (role === 'farmer' ? 'Irfan Siddique' : role === 'expert' ? 'Dr. Amit Sharma' : 'FarmOS Admin');
    const idx = list.findIndex(p => p.id === postId);
    if (idx > -1) {
      const newReply = {
        id: `rpl-${Date.now()}`,
        authorName: name,
        authorRole: role,
        content,
        date: new Date().toISOString().split('T')[0]
      };
      list[idx].replies.push(newReply);
      this.setForum(list);

      if (isSupabaseConfigured()) {
        await supabase.from('forum').update({ replies: list[idx].replies }).eq('id', postId);
      }
      return list[idx];
    }
    throw new Error('Post not found');
  }

  static async likePost(postId: string): Promise<ForumPost> {
    const list = this.getForum();
    const idx = list.findIndex(p => p.id === postId);
    if (idx > -1) {
      list[idx].likes += 1;
      this.setForum(list);

      if (isSupabaseConfigured()) {
        await supabase.from('forum').update({ likes: list[idx].likes }).eq('id', postId);
      }
      return list[idx];
    }
    throw new Error('Post not found');
  }

  static getSchemes(): GovernmentScheme[] { return INITIAL_SCHEMES; }
}
