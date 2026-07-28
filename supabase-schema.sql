-- 
-- PostgreSQL Database Schema for Smart Farming Operating System (FarmOS AI)
-- Compatible with Supabase PostgreSQL and RLS (Row Level Security)
-- 

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 
-- 1. Profiles Table
-- 
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'expert', 'admin')),
  phone TEXT,
  district TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Enable read access for all authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable update for users of their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, phone, district, state)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'New User'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'farmer'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'district', ''),
    COALESCE(new.raw_user_meta_data->>'state', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 
-- 2. Farms Table
-- 
CREATE TABLE IF NOT EXISTS public.farms (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  area NUMERIC NOT NULL,
  location TEXT NOT NULL,
  soil_type TEXT CHECK (soil_type IN ('Clay', 'Sandy', 'Loamy', 'Silt', 'Peaty')),
  water_source TEXT CHECK (water_source IN ('Drip Irrigation', 'Sprinkler', 'Manual Water', 'Rainfed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can fully manage their own farms" ON public.farms
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all farms" ON public.farms
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- 
-- 3. Crops Table
-- 
CREATE TABLE IF NOT EXISTS public.crops (
  id TEXT PRIMARY KEY,
  farm_id TEXT REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  variety TEXT NOT NULL,
  sowed_date TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  estimated_yield_kg NUMERIC NOT NULL,
  harvested_date TEXT,
  actual_yield_kg NUMERIC,
  status TEXT CHECK (status IN ('planned', 'growing', 'harvesting', 'completed')) NOT NULL
);

ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage crops on their own farms" ON public.crops
  FOR ALL TO authenticated
  USING (farm_id IN (SELECT id FROM public.farms WHERE user_id = auth.uid()))
  WITH CHECK (farm_id IN (SELECT id FROM public.farms WHERE user_id = auth.uid()));

CREATE POLICY "Experts and Admins can view all crops" ON public.crops
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('expert', 'admin'))
  );


-- 
-- 4. Activities Table
-- 
CREATE TABLE IF NOT EXISTS public.activities (
  id TEXT PRIMARY KEY,
  crop_id TEXT REFERENCES public.crops(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('sowing', 'irrigation', 'fertilizer', 'pesticide', 'harvest')) NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  cost NUMERIC NOT NULL,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  notes TEXT
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage activities for their owned crops" ON public.activities
  FOR ALL TO authenticated
  USING (crop_id IN (
    SELECT id FROM public.crops WHERE farm_id IN (
      SELECT id FROM public.farms WHERE user_id = auth.uid()
    )
  ))
  WITH CHECK (crop_id IN (
    SELECT id FROM public.crops WHERE farm_id IN (
      SELECT id FROM public.farms WHERE user_id = auth.uid()
    )
  ));


-- 
-- 5. Expenses Table
-- 
CREATE TABLE IF NOT EXISTS public.expenses (
  id TEXT PRIMARY KEY,
  farm_id TEXT REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  category TEXT CHECK (category IN ('seeds', 'fertilizers', 'labor', 'equipment', 'transport', 'misc')) NOT NULL,
  amount NUMERIC NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage expenses for their owned farms" ON public.expenses
  FOR ALL TO authenticated
  USING (farm_id IN (SELECT id FROM public.farms WHERE user_id = auth.uid()))
  WITH CHECK (farm_id IN (SELECT id FROM public.farms WHERE user_id = auth.uid()));


-- 
-- 6. Disease Reports Table
-- 
CREATE TABLE IF NOT EXISTS public.disease_reports (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  crop_name TEXT NOT NULL,
  leaf_type TEXT NOT NULL,
  image_url TEXT NOT NULL,
  disease_name TEXT NOT NULL,
  confidence_score NUMERIC NOT NULL,
  severity_level TEXT CHECK (severity_level IN ('Low', 'Medium', 'High')) NOT NULL,
  recommendations TEXT[] DEFAULT '{}'::text[] NOT NULL,
  status TEXT CHECK (status IN ('detected', 'reviewed', 'resolved')) NOT NULL,
  expert_notes TEXT,
  created_at TEXT NOT NULL,
  farmer_name TEXT NOT NULL
);

ALTER TABLE public.disease_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can view and create their own disease reports" ON public.disease_reports
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Experts and Admins can view/update all reports
CREATE POLICY "Experts and Admins can manage all disease reports" ON public.disease_reports
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('expert', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('expert', 'admin'))
  );


-- 
-- 7. Marketplace Listings Table
-- 
CREATE TABLE IF NOT EXISTS public.marketplace (
  id TEXT PRIMARY KEY,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_name TEXT NOT NULL,
  title TEXT NOT NULL,
  crop_name TEXT NOT NULL,
  variety TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  state TEXT NOT NULL,
  phone TEXT NOT NULL,
  image_placeholder TEXT NOT NULL,
  inquiries_count INTEGER DEFAULT 0 NOT NULL,
  created_at TEXT NOT NULL
);

ALTER TABLE public.marketplace ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view listings
CREATE POLICY "Authenticated users can view marketplace" ON public.marketplace
  FOR SELECT TO authenticated USING (true);

-- Sellers can manage their own listings
CREATE POLICY "Sellers can manage their owned listings" ON public.marketplace
  FOR ALL TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);


-- 
-- 8. Equipment Rentals Table
-- 
CREATE TABLE IF NOT EXISTS public.equipments (
  id TEXT PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  owner_name TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('tractor', 'harvester', 'rotavator', 'seeder')) NOT NULL,
  price_per_day NUMERIC NOT NULL,
  available BOOLEAN DEFAULT true NOT NULL,
  contact TEXT NOT NULL,
  description TEXT NOT NULL,
  image_placeholder TEXT NOT NULL,
  location TEXT NOT NULL
);

ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view rentals" ON public.equipments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Owners can manage their owned rentals" ON public.equipments
  FOR ALL TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);


-- 
-- 9. Forum Posts Table
-- 
CREATE TABLE IF NOT EXISTS public.forum (
  id TEXT PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL CHECK (author_role IN ('farmer', 'expert', 'admin')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('discussion', 'question', 'expert', 'success')) NOT NULL,
  likes INTEGER DEFAULT 0 NOT NULL,
  date TEXT NOT NULL,
  replies JSONB DEFAULT '[]'::jsonb NOT NULL
);

ALTER TABLE public.forum ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read forum posts" ON public.forum
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can write forum posts" ON public.forum
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 
-- 10. Notifications Table
-- 
CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  time TEXT NOT NULL,
  unread BOOLEAN DEFAULT true NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can fully manage their own notifications" ON public.notifications
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
