-- Create clients table for managing client showcase
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Allow public read access to clients"
    ON public.clients
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access to clients"
    ON public.clients
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Insert sample top IKF clients
INSERT INTO public.clients (name, logo_url, category, is_featured, display_order) VALUES
('Oriental Rubber', 'https://www.ikf.co.in/wp-content/uploads/2023/01/oriental-rubber-logo.png', 'Manufacturing', true, 1),
('De Mandovi', 'https://www.ikf.co.in/wp-content/uploads/2023/01/de-mandovi-logo.png', 'Luxury', true, 2),
('Mahindra', 'https://www.ikf.co.in/wp-content/uploads/2023/01/mahindra-logo.png', 'Automotive', true, 3),
('Tata Motors', 'https://www.ikf.co.in/wp-content/uploads/2023/01/tata-motors-logo.png', 'Automotive', true, 4),
('Bajaj', 'https://www.ikf.co.in/wp-content/uploads/2023/01/bajaj-logo.png', 'Automotive', true, 5),
('Godrej', 'https://www.ikf.co.in/wp-content/uploads/2023/01/godrej-logo.png', 'FMCG', true, 6),
('Asian Paints', 'https://www.ikf.co.in/wp-content/uploads/2023/01/asian-paints-logo.png', 'Paints', true, 7),
('Pidilite', 'https://www.ikf.co.in/wp-content/uploads/2023/01/pidilite-logo.png', 'Chemicals', true, 8),
('Crompton', 'https://www.ikf.co.in/wp-content/uploads/2023/01/crompton-logo.png', 'Electronics', true, 9),
('Voltas', 'https://www.ikf.co.in/wp-content/uploads/2023/01/voltas-logo.png', 'Electronics', true, 10),
('Blue Star', 'https://www.ikf.co.in/wp-content/uploads/2023/01/blue-star-logo.png', 'HVAC', true, 11),
('Havells', 'https://www.ikf.co.in/wp-content/uploads/2023/01/havells-logo.png', 'Electronics', true, 12);

-- Create index for faster queries
CREATE INDEX idx_clients_featured ON public.clients(is_featured, display_order);
CREATE INDEX idx_clients_category ON public.clients(category);
