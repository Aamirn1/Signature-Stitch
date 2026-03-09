-- 1. Create Enum and Table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- 2. Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security Definer Function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. RLS for user_roles
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 5. Add Admin RLS to existing tables
-- orders
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete all orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- partner_applications
CREATE POLICY "Admins can view all applications" ON public.partner_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all applications" ON public.partner_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete all applications" ON public.partner_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- partner_orders
CREATE POLICY "Admins can view all partner_orders" ON public.partner_orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all partner_orders" ON public.partner_orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete all partner_orders" ON public.partner_orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- partner_payouts
CREATE POLICY "Admins can view all payouts" ON public.partner_payouts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all payouts" ON public.partner_payouts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete all payouts" ON public.partner_payouts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete all profiles" ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- measurements
CREATE POLICY "Admins can view all measurements" ON public.measurements FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all measurements" ON public.measurements FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete all measurements" ON public.measurements FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 6. Create products table for dynamic product management
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    category_slug TEXT NOT NULL,
    image_url TEXT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));