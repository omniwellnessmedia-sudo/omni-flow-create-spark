import React from 'react';
import { Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Leaf, ArrowLeft, Mail } from 'lucide-react';

const ESGPolicy = () => {
  return (
    <>
      <UnifiedNavigation />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container-width section-large">
          {/* Header */}
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Leaf className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">ESG Policy</h1>
              <p className="text-lg text-muted-foreground">
                Environmental, Social & Governance Commitment
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: March 2026
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Our ESG Vision</h2>
                <p className="text-gray-700 leading-relaxed">
                  At Omni Wellness Media, we believe that business success and social responsibility are inseparable.
                  Our Environmental, Social, and Governance (ESG) policy reflects our commitment to operating ethically,
                  sustainably, and in service of the communities we reach. From Cape Town to the world, we strive to
                  create positive impact through every aspect of our operations -- bridging wellness, culture, and
                  conscious media with purpose.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Environmental Commitment</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We are committed to reducing our environmental footprint and promoting digital sustainability:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Carbon Footprint Reduction:</strong> We actively measure and work to reduce the carbon footprint
                    of our digital operations, including optimizing code, compressing assets, and minimizing data transfer</li>
                  <li><strong>Digital Sustainability:</strong> Our platform is built with performance and efficiency in mind,
                    reducing energy consumption through lazy loading, optimized images, and efficient caching strategies</li>
                  <li><strong>Renewable Hosting:</strong> We prioritize hosting providers and cloud services that use renewable
                    energy sources and have committed to carbon neutrality</li>
                  <li><strong>Paperless Operations:</strong> We operate as a digital-first organization, minimizing paper usage
                    across all business processes</li>
                  <li><strong>Sustainable Partnerships:</strong> We prioritize working with tour operators, retreat hosts, and
                    service providers who demonstrate environmental responsibility</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Social Responsibility</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our social commitment extends across community development, fair practices, and inclusive growth:
                </p>

                <h3 className="text-xl font-semibold mb-3">Community Programs</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Early childhood and youth development programs supporting 200+ children annually</li>
                  <li>Gangster reform program providing transformative coaching at correctional facilities</li>
                  <li>Women's empowerment through financial literacy and entrepreneurship training</li>
                  <li>Urban community gardening and permaculture education</li>
                  <li>Plant-based nutrition initiatives distributing 500+ meals monthly</li>
                  <li>Youth advocacy training through the BWC Youth Troopers program</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Fair Labor Practices</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Fair compensation for all team members and contractors</li>
                  <li>Flexible working arrangements that support work-life balance</li>
                  <li>Equal opportunity employment regardless of race, gender, age, disability, or background</li>
                  <li>Support for local freelancers and small business service providers</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Diversity & Inclusion</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Building a platform that reflects the diversity of South Africa and the global wellness community</li>
                  <li>Ensuring accessibility across our digital platforms for users of all abilities</li>
                  <li>Amplifying underrepresented voices in wellness, culture, and media</li>
                  <li>Creating inclusive content that respects cultural heritage and traditions</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Governance</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Strong governance underpins everything we do:
                </p>

                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Clear and accessible privacy, terms, and cookie policies</li>
                  <li>Open communication with users about data practices and platform changes</li>
                  <li>Regular reporting on CSR and ESG initiatives and their outcomes</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Ethical Business Practices</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Honest and transparent marketing -- no misleading wellness claims</li>
                  <li>Fair pricing and clear terms for all services and products</li>
                  <li>Responsible use of data and technology, including AI and analytics</li>
                  <li>Compliance with POPIA, consumer protection laws, and industry standards</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Anti-Corruption</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Zero tolerance for bribery, corruption, and fraud in all business dealings</li>
                  <li>Due diligence on all partners and service providers</li>
                  <li>Whistleblower protections for reporting unethical behavior</li>
                  <li>Regular review of governance practices and policies</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">UN Sustainable Development Goals Alignment</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our ESG initiatives are aligned with eight United Nations Sustainable Development Goals (SDGs),
                  as reflected in our <Link to="/csr-impact" className="text-primary hover:underline">CSR Impact</Link> programs:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { number: 1, title: 'No Poverty', color: 'bg-red-600' },
                    { number: 2, title: 'Zero Hunger', color: 'bg-yellow-600' },
                    { number: 3, title: 'Good Health & Well-being', color: 'bg-green-500' },
                    { number: 4, title: 'Quality Education', color: 'bg-red-700' },
                    { number: 5, title: 'Gender Equality', color: 'bg-orange-500' },
                    { number: 11, title: 'Sustainable Cities & Communities', color: 'bg-orange-600' },
                    { number: 15, title: 'Life on Land', color: 'bg-green-600' },
                    { number: 16, title: 'Peace, Justice & Strong Institutions', color: 'bg-blue-700' },
                  ].map((sdg) => (
                    <div key={sdg.number} className={`${sdg.color} text-white rounded-lg p-3 text-center`}>
                      <div className="text-2xl font-bold">SDG {sdg.number}</div>
                      <p className="text-xs leading-tight mt-1">{sdg.title}</p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Through our wellness exchange, community programs, tours, and partnerships, we contribute
                  meaningfully to these global goals at a local level.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Climate Action Commitments</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  As part of our environmental responsibility, we commit to the following climate action targets:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Achieve carbon-neutral digital operations by 2028</li>
                  <li>Offset carbon emissions from company-organized tours and retreats through verified carbon credit programs</li>
                  <li>Promote eco-friendly travel options and sustainable tourism practices through our platform</li>
                  <li>Partner with local environmental organizations for conservation and restoration projects</li>
                  <li>Educate our community on sustainable wellness practices through blog content and workshops</li>
                  <li>Annually assess and report on our carbon footprint and environmental impact</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Reporting and Accountability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We believe in accountability and continuous improvement:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Annual ESG and CSR impact reporting published on our platform</li>
                  <li>Regular review and updating of ESG targets and commitments</li>
                  <li>Stakeholder engagement to gather feedback on our ESG performance</li>
                  <li>Transparent disclosure of challenges and areas for improvement</li>
                  <li>Third-party verification of key ESG metrics where feasible</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Our most recent impact data and community program results are available on our{' '}
                  <Link to="/csr-impact" className="text-primary hover:underline">CSR Impact</Link> page.
                </p>
              </div>

              <div className="bg-primary/5 rounded-xl border border-primary/20 p-8">
                <h2 className="text-2xl font-bold mb-4">Contact for ESG Inquiries</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We welcome questions, feedback, and partnership inquiries related to our ESG commitments.
                  Please reach out to us:
                </p>
                <div className="flex flex-col space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href="mailto:omnimediawellness@gmail.com" className="text-primary hover:underline">
                      omnimediawellness@gmail.com
                    </a>
                  </div>
                  <p><strong>Omni Wellness Media</strong></p>
                  <p>Cape Town, South Africa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ESGPolicy;
