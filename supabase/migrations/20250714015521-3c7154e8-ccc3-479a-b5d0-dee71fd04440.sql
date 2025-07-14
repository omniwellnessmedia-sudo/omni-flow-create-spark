-- Add testimonials for FACT Wellness and Service Learning tours
WITH tour_data AS (
    SELECT id, slug FROM tours WHERE slug IN ('fact-wellness-hybrid-classes', 'cape-town-service-learning-program')
)
INSERT INTO tour_testimonials (tour_id, name, title, testimonial_text, rating, image_url, approved, featured)
SELECT 
    t.id,
    CASE 
        WHEN t.slug = 'fact-wellness-hybrid-classes' THEN 'Sarah Johnson'
        WHEN t.slug = 'cape-town-service-learning-program' THEN 'Marcus Williams'
    END,
    CASE 
        WHEN t.slug = 'fact-wellness-hybrid-classes' THEN 'Local Muizenberg Resident'
        WHEN t.slug = 'cape-town-service-learning-program' THEN 'University Student, USA'
    END,
    CASE 
        WHEN t.slug = 'fact-wellness-hybrid-classes' THEN 'Chad and his team have created something truly special in Muizenberg. The hybrid classes allow me to join from anywhere - whether I''m at the beach, traveling, or at home. The quality of instruction is world-class, and the community is incredibly welcoming.'
        WHEN t.slug = 'cape-town-service-learning-program' THEN 'This program completely changed my perspective on service, community, and what it means to make a difference. Working with local organizations in Cape Town taught me more about sustainable development and cross-cultural understanding than any classroom ever could.'
    END,
    5,
    CASE 
        WHEN t.slug = 'fact-wellness-hybrid-classes' THEN '/lovable-uploads/cf53ace8-167a-4cef-9a61-c50b58e2ffbb.png'
        WHEN t.slug = 'cape-town-service-learning-program' THEN '/lovable-uploads/a045fef8-5243-4990-a695-c17fe80d419f.png'
    END,
    true,
    true
FROM tour_data t

UNION ALL
SELECT 
    t.id,
    CASE 
        WHEN t.slug = 'fact-wellness-hybrid-classes' THEN 'David Chen'
        WHEN t.slug = 'cape-town-service-learning-program' THEN 'Emma Rodriguez'
    END,
    CASE 
        WHEN t.slug = 'fact-wellness-hybrid-classes' THEN 'International Yoga Teacher'
        WHEN t.slug = 'cape-town-service-learning-program' THEN 'Graduate Student, Canada'
    END,
    CASE 
        WHEN t.slug = 'fact-wellness-hybrid-classes' THEN 'I''ve practiced yoga around the world, and FACT Wellness offers something unique. The combination of Chad''s expert guidance, the stunning Muizenberg location, and the innovative hybrid technology creates an experience that''s both grounding and accessible.'
        WHEN t.slug = 'cape-town-service-learning-program' THEN 'The relationships I built with community members and fellow participants continue to inspire my work years later. This isn''t just a program - it''s a transformation that prepares you to be a more effective global citizen.'
    END,
    5,
    CASE 
        WHEN t.slug = 'fact-wellness-hybrid-classes' THEN '/lovable-uploads/9c5aba11-91e9-42a2-a75d-1e9d53a54ef1.png'
        WHEN t.slug = 'cape-town-service-learning-program' THEN '/lovable-uploads/640bba04-9344-4dab-8fe2-ca1fc4006c80.png'
    END,
    true,
    false
FROM tour_data t;