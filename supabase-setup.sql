-- ============================================================================
-- SUPABASE DATABASE & STORAGE SETUP SCRIPT (IDEMPOTENT)
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE cart_status AS ENUM ('active', 'converted', 'abandoned');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  billing_address TEXT,
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  is_new BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status order_status DEFAULT 'pending' NOT NULL,
  shipping_address TEXT,
  payment_receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES public.products(id) NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile." ON public.profiles;
CREATE POLICY "Users can view own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile." ON public.profiles;
CREATE POLICY "Users can insert own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can view products." ON public.products;
CREATE POLICY "Anyone can view products." ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own orders." ON public.orders;
CREATE POLICY "Users can view own orders." ON public.orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own orders." ON public.orders;
CREATE POLICY "Users can insert own orders." ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own order items." ON public.order_items;
CREATE POLICY "Users can view own order items." ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can insert own order items." ON public.order_items;
CREATE POLICY "Users can insert own order items." ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-uploads', 'payment-uploads', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can view receipts" ON storage.objects;
CREATE POLICY "Anyone can view receipts" ON storage.objects FOR SELECT USING (bucket_id = 'payment-uploads');

DROP POLICY IF EXISTS "Authenticated users can upload receipts" ON storage.objects;
CREATE POLICY "Authenticated users can upload receipts" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'payment-uploads' AND auth.role() = 'authenticated'
);

INSERT INTO public.products (id, name, category, description, price, image_url, sizes, is_new) VALUES 
('w1', 'Vibrant Pink Flamenco-Style Evening Dress', 'Evening Wear', 'Vibrant pink flowing dress with a dramatic, flamenco-inspired silhouette; photographed in Nairobi, Kenya.', 89.99, 'https://images.pexels.com/photos/3625757/pexels-photo-3625757.jpeg', '{XS,S,M,L}', true),
('w2', 'Casual Red Summer Midi Dress', 'Casual Wear', 'Bright red midi dress in a relaxed, confident fit, styled for a sunny outdoor summer day.', 45.99, 'https://images.pexels.com/photos/11837672/pexels-photo-11837672.jpeg', '{XS,S,M,L}', true),
('w3', 'Classic Red Cocktail Dress', 'Party Wear', 'Form-fitting red cocktail dress with a sleek finish, ideal for evening parties and photoshoots.', 69.99, 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg', '{XS,S,M,L}', false),
('w4', 'Red Evening Gown - Urban Elegance', 'Evening Wear', 'Striking red gown with a graceful drape, photographed against historic architecture for a bold, elegant look.', 129.99, 'https://images.pexels.com/photos/31768082/pexels-photo-31768082.jpeg', '{XS,S,M,L}', false),
('w5', 'Floral Print Blue Day Dress', 'Casual Wear', 'Breathable blue dress featuring a floral pattern, perfect for daytime outings in the park.', 39.99, 'https://images.pexels.com/photos/2077158/pexels-photo-2077158.jpeg', '{XS,S,M,L}', false),
('w6', 'Coastal Blue Flowy Dress', 'Resort Wear', 'Airy blue dress with an elegant drape, styled for coastal getaways and cliffside photoshoots.', 59.99, 'https://images.pexels.com/photos/10306486/pexels-photo-10306486.jpeg', '{XS,S,M,L}', false),
('w7', 'Designer Blue Maxi Gown', 'Designer Wear', 'Fit-and-flare maxi gown in blue and white with haute-couture styling, shot in a studio setting.', 149.99, 'https://images.pexels.com/photos/14452579/pexels-photo-14452579.jpeg', '{XS,S,M,L}', false),
('w8', 'Classic Blue Evening Dress', 'Evening Wear', 'Sophisticated dark blue dress with a sleek silhouette, suited for formal evening events.', 99.99, 'https://images.pexels.com/photos/36284634/pexels-photo-36284634.jpeg', '{XS,S,M,L}', false),
('w9', 'Traditional Vibrant Print Dress', 'Ethnic Wear', 'Ornate traditional-style dress in rich, vibrant colors, paired with statement jewelry.', 79.99, 'https://images.pexels.com/photos/10693948/pexels-photo-10693948.jpeg', '{XS,S,M,L}', false),
('w10', 'Flowing White Ethereal Gown', 'Bridal / Special Occasion', 'Flowing white gown with a dramatic, ethereal silhouette, ideal for bridal or special-occasion wear.', 119.99, 'https://images.pexels.com/photos/6480050/pexels-photo-6480050.jpeg', '{XS,S,M,L}', false),
('m1', 'Classic Black Formal Suit', 'Formal Wear', 'Sharp black suit with a tailored fit, styled with a bow tie for formal occasions.', 199.99, 'https://images.pexels.com/photos/26615808/pexels-photo-26615808.jpeg', '{S,M,L,XL}', true),
('m2', 'Bearded Gentleman Black Suit', 'Formal Wear', 'Classic black suit paired with a bow tie, styled for weddings and black-tie events.', 189.99, 'https://images.pexels.com/photos/6065901/pexels-photo-6065901.jpeg', '{S,M,L,XL}', true),
('m3', 'Plaid Pattern Statement Suit', 'Designer Wear', 'Bold plaid-patterned suit photographed outdoors against rugged terrain, for a modern fashion statement.', 229.99, 'https://images.pexels.com/photos/15048407/pexels-photo-15048407.jpeg', '{S,M,L,XL}', false),
('m4', 'Blue Three-Piece Wedding Suit', 'Wedding Wear', 'Elegant blue three-piece suit styled for weddings and festive occasions, with a refined garden backdrop.', 249.99, 'https://images.pexels.com/photos/27670428/pexels-photo-27670428.jpeg', '{S,M,L,XL}', false),
('m5', 'Blue Business Suit with Tie', 'Business Wear', 'Sharp blue business suit with tie and glasses, styled for a confident urban city look.', 179.99, 'https://images.pexels.com/photos/16476878/pexels-photo-16476878.jpeg', '{S,M,L,XL}', false),
('m6', 'Grey Professional Business Suit', 'Business Wear', 'Classic grey business suit with tie, styled for corporate and professional settings.', 169.99, 'https://images.pexels.com/photos/31626525/pexels-photo-31626525.jpeg', '{S,M,L,XL}', false),
('m7', 'Denim Jacket Studio Portrait Look', 'Casual Wear', 'Trendy denim jacket styled for a confident, modern casual look, shot in studio lighting.', 69.99, 'https://images.pexels.com/photos/7389036/pexels-photo-7389036.jpeg', '{S,M,L,XL}', false),
('m8', 'Classic Denim Jacket', 'Casual Wear', 'Strong, minimal denim jacket look paired with a t-shirt, styled for everyday casual wear.', 64.99, 'https://images.pexels.com/photos/30395493/pexels-photo-30395493.jpeg', '{S,M,L,XL}', false),
('m9', 'Blue Shirt', 'Streetwear', 'Blue shirt styled for an urban street-fashion look.', 79.99, 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800', '{S,M,L,XL}', false),
('m10', 'Casual White T-Shirt & Jeans Outfit', 'Casual Wear', 'Relaxed white t-shirt and denim jeans combo, styled for everyday urban streetwear.', 39.99, 'https://images.pexels.com/photos/17132129/pexels-photo-17132129.jpeg', '{S,M,L,XL}', false)
ON CONFLICT (id) DO NOTHING;
