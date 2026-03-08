
-- Partner applications
CREATE TABLE public.partner_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own application" ON public.partner_applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own application" ON public.partner_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Partner orders with markup
CREATE TABLE public.partner_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  base_price NUMERIC NOT NULL,
  markup_amount NUMERIC NOT NULL DEFAULT 0,
  final_price NUMERIC GENERATED ALWAYS AS (base_price + markup_amount) STORED,
  quantity INTEGER NOT NULL DEFAULT 1,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  customer_city TEXT,
  measurement_id UUID REFERENCES public.measurements(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners can view own orders" ON public.partner_orders FOR SELECT TO authenticated USING (auth.uid() = partner_id);
CREATE POLICY "Partners can insert own orders" ON public.partner_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = partner_id);
CREATE POLICY "Partners can update own orders" ON public.partner_orders FOR UPDATE TO authenticated USING (auth.uid() = partner_id);

-- Payout requests
CREATE TABLE public.partner_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'easypaisa' CHECK (payment_method IN ('easypaisa', 'jazzcash', 'bank_transfer')),
  account_number TEXT NOT NULL,
  account_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.partner_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners can view own payouts" ON public.partner_payouts FOR SELECT TO authenticated USING (auth.uid() = partner_id);
CREATE POLICY "Partners can insert own payouts" ON public.partner_payouts FOR INSERT TO authenticated WITH CHECK (auth.uid() = partner_id);
