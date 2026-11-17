-- ============================================================================
-- SMART LOST & FOUND INTELLIGENCE SYSTEM
-- Initial Seed Data (Categories and Campus Locations)
-- ============================================================================

-- Seed Categories
INSERT INTO public.categories (id, name, description, icon) VALUES
    ('11111111-1111-1111-1111-111111111101', 'Electronics', 'Smartphones, laptops, tablets, chargers, headphones, earbuds, smartwatches, power banks', 'Smartphone'),
    ('11111111-1111-1111-1111-111111111102', 'Wallets & Money', 'Wallets, purses, coin pouches, cash clips', 'Wallet'),
    ('11111111-1111-1111-1111-111111111103', 'Keys & IDs', 'Campus ID cards, room keys, bike/car keys, lanyards, access cards', 'Key'),
    ('11111111-1111-1111-1111-111111111104', 'Bags & Luggage', 'Backpacks, shoulder bags, duffels, laptop bags, tote bags', 'Briefcase'),
    ('11111111-1111-1111-1111-111111111105', 'Books & Stationery', 'Textbooks, notebooks, calculators, pencil cases, research folders', 'BookOpen'),
    ('11111111-1111-1111-1111-111111111106', 'Clothing & Accessories', 'Jackets, hoodies, caps, glasses, sunglasses, umbrellas, jewelry, watches', 'Shirt'),
    ('11111111-1111-1111-1111-111111111107', 'Bottles & Containers', 'Water bottles, thermoses, lunch boxes, containers', 'Coffee'),
    ('11111111-1111-1111-1111-111111111108', 'Sports Equipment', 'Badminton rackets, footballs, gym gear, skateboards', 'Activity'),
    ('11111111-1111-1111-1111-111111111109', 'Others', 'Miscellaneous personal items and unmatched belongings', 'HelpCircle')
ON CONFLICT (name) DO NOTHING;

-- Seed Campus Locations (with approximate campus zones)
INSERT INTO public.campus_locations (id, name, zone_code, description, latitude, longitude) VALUES
    ('22222222-2222-2222-2222-222222222201', 'Central Library', 'LIB-01', 'Ground and Upper reading floors, digital reference hall', 12.9716, 77.5946),
    ('22222222-2222-2222-2222-222222222202', 'Main Auditorium', 'AUD-01', 'Main stage, seminar complex and lobby area', 12.9719, 77.5950),
    ('22222222-2222-2222-2222-222222222203', 'Engineering Block A', 'ENG-A', 'Classrooms 101-305, Computer Science and Robotics labs', 12.9723, 77.5942),
    ('22222222-2222-2222-2222-222222222204', 'Science Block B', 'SCI-B', 'Physics, Chemistry and Biotech research wings', 12.9725, 77.5948),
    ('22222222-2222-2222-2222-222222222205', 'Student Activity Center', 'SAC-01', 'Indoor sports hall, clubs arena, recreational lounge', 12.9712, 77.5939),
    ('22222222-2222-2222-2222-222222222206', 'Campus Cafeteria', 'CAF-01', 'Central dining hall, food court and outdoor lawn seating', 12.9715, 77.5955),
    ('22222222-2222-2222-2222-222222222207', 'Sports Complex & Ground', 'SPT-01', 'Athletics track, football field, basketball courts', 12.9708, 77.5960),
    ('22222222-2222-2222-2222-222222222208', 'North Gate Security', 'SEC-01', 'Main entrance checkpoint and Lost & Found custody office', 12.9730, 77.5940)
ON CONFLICT (name) DO NOTHING;
