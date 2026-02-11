-- Create social_links table for managing social media profiles
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL, -- 'youtube', 'instagram', 'linkedin', 'facebook', 'twitter'
    profile_url TEXT NOT NULL,
    username TEXT,
    display_name TEXT,
    follower_count TEXT, -- e.g., "25k+", "18k+"
    description TEXT, -- e.g., "Expert Insights", "Culture & Life"
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to social_links"
    ON public.social_links
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow authenticated full access to social_links"
    ON public.social_links
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Insert IKF social media profiles
INSERT INTO public.social_links (platform, profile_url, username, display_name, follower_count, description, display_order) VALUES
('linkedin', 'https://www.linkedin.com/company/i-knowledge-factory-pvt.-ltd./', 'i-knowledge-factory-pvt.-ltd.', 'IKF Official', '25k+', 'Top Talent Hub', 1),
('instagram', 'https://www.instagram.com/ikfdigital/', 'ikfdigital', 'Life At IKF', '18k+', 'Culture & Life', 2),
('youtube', 'https://www.youtube.com/c/IKFDigital', 'IKFDigital', 'IKF Insights', '5k+', 'Expert Insights', 3),
('facebook', 'https://www.facebook.com/IKFDigital/', 'IKFDigital', 'IKF Community', '42k+', 'Community Rooted', 4);

-- Create index
CREATE INDEX idx_social_links_active ON public.social_links(is_active, display_order);
