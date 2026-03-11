
-- Reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  review_image_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own reviews" ON public.reviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view approved reviews" ON public.reviews FOR SELECT TO public USING (status = 'approved');
CREATE POLICY "Admins can view all reviews" ON public.reviews FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update all reviews" ON public.reviews FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete all reviews" ON public.reviews FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Return requests table
CREATE TABLE public.return_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  complaint text NOT NULL,
  damage_image_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own returns" ON public.return_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own returns" ON public.return_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all returns" ON public.return_requests FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update all returns" ON public.return_requests FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete all returns" ON public.return_requests FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Add unstitched price to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS unstitched_price numeric DEFAULT NULL;

-- Storage bucket for review images
INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true) ON CONFLICT DO NOTHING;

-- Storage policies for review-images
CREATE POLICY "Users can upload review images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'review-images');
CREATE POLICY "Anyone can view review images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'review-images');

-- Storage bucket for return images
INSERT INTO storage.buckets (id, name, public) VALUES ('return-images', 'return-images', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Users can upload return images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'return-images');
CREATE POLICY "Anyone can view return images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'return-images');
