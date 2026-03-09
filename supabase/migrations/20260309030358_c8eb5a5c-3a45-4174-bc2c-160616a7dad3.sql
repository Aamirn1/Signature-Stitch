
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  items jsonb NOT NULL,
  subtotal numeric NOT NULL,
  advance_amount numeric NOT NULL,
  remaining_amount numeric NOT NULL,
  payment_method text NOT NULL DEFAULT 'advance',
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  customer_address text NOT NULL,
  customer_city text NOT NULL,
  notes text,
  payment_screenshot_url text,
  status text NOT NULL DEFAULT 'pending_payment',
  is_reseller boolean NOT NULL DEFAULT false,
  profit_amount numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE TO authenticated USING (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Users can upload payment screenshots" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'payment-screenshots' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Anyone can view payment screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'payment-screenshots');
