
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create measurements table
CREATE TABLE public.measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL DEFAULT 'My Measurements',
  chest NUMERIC,
  waist NUMERIC,
  hip NUMERIC,
  shoulder NUMERIC,
  sleeve_length NUMERIC,
  shirt_length NUMERIC,
  trouser_length NUMERIC,
  trouser_waist NUMERIC,
  inseam NUMERIC,
  collar NUMERIC,
  measurement_photo_url TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own measurements" ON public.measurements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own measurements" ON public.measurements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own measurements" ON public.measurements FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own measurements" ON public.measurements FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for measurement photos
INSERT INTO storage.buckets (id, name, public) VALUES ('measurement-photos', 'measurement-photos', true);

CREATE POLICY "Users can upload measurement photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'measurement-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can view own measurement photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'measurement-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Anyone can view measurement photos" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'measurement-photos');
CREATE POLICY "Users can delete own measurement photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'measurement-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
