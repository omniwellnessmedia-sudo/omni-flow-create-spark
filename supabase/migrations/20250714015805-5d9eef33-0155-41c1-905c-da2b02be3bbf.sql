-- Update tour images to use provided images and enhance with National Geographic style galleries
UPDATE tours 
SET hero_image_url = CASE 
        WHEN slug = 'conscious-connections-indigenous-wisdom-healing' THEN '/lovable-uploads/8147b3e9-6b38-4827-a312-432b0e2ed031.png'
        WHEN slug = 'fact-wellness-hybrid-classes' THEN '/lovable-uploads/e6789c18-637e-45cc-8fe4-eda77834167c.png'
        WHEN slug = 'cape-town-service-learning-program' THEN '/lovable-uploads/640bba04-9344-4dab-8fe2-ca1fc4006c80.png'
        ELSE hero_image_url
    END,
    image_gallery = CASE 
        WHEN slug = 'conscious-connections-indigenous-wisdom-healing' THEN 
            ARRAY[
                '/lovable-uploads/dd4158b7-7645-4ed7-b907-9c2a96575522.png',
                '/lovable-uploads/a52350ad-ae19-4d77-b79d-4cdd18b94367.png',
                '/lovable-uploads/cf5cd20e-6ef2-4728-902c-4ced28da0fb1.png',
                '/lovable-uploads/8147b3e9-6b38-4827-a312-432b0e2ed031.png',
                '/lovable-uploads/a045fef8-5243-4990-a695-c17fe80d419f.png'
            ]
        WHEN slug = 'fact-wellness-hybrid-classes' THEN 
            ARRAY[
                '/lovable-uploads/e6789c18-637e-45cc-8fe4-eda77834167c.png',
                '/lovable-uploads/cf53ace8-167a-4cef-9a61-c50b58e2ffbb.png',
                '/lovable-uploads/b69f9a35-02ab-45fd-868d-4a8df59e9ef1.png',
                '/lovable-uploads/9c5aba11-91e9-42a2-a75d-1e9d53a54ef1.png'
            ]
        WHEN slug = 'cape-town-service-learning-program' THEN 
            ARRAY[
                '/lovable-uploads/640bba04-9344-4dab-8fe2-ca1fc4006c80.png',
                '/lovable-uploads/a045fef8-5243-4990-a695-c17fe80d419f.png',
                '/lovable-uploads/e6789c18-637e-45cc-8fe4-eda77834167c.png',
                '/lovable-uploads/dd4158b7-7645-4ed7-b907-9c2a96575522.png'
            ]
        ELSE image_gallery
    END
WHERE slug IN ('conscious-connections-indigenous-wisdom-healing', 'fact-wellness-hybrid-classes', 'cape-town-service-learning-program');