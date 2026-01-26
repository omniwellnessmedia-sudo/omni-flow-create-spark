# Cal.com Setup Guide for Omni Wellness Media

## For: Zenith (Administration & Coordination)
## Purpose: Configure all booking event types to match website integration

---

## 📋 Quick Reference Table

| Event Type | Slug (EXACT) | Duration | Sales Page |
|------------|--------------|----------|------------|
| Discovery Call | `discovery-call` | 30 min | https://www.omniwellnessmedia.co.za/ |
| Social Media Strategy | `social-media-strategy` | 60 min | https://www.omniwellnessmedia.co.za/social-media-strategy |
| Web Consultation | `web-consultation` | 45 min | https://www.omniwellnessmedia.co.za/web-development |
| Media Production | `media-production` | 60 min | https://www.omniwellnessmedia.co.za/media-production |
| Business Strategy | `business-strategy` | 60 min | https://www.omniwellnessmedia.co.za/business-consulting |
| Wellness Session | `wellness-session` | 60 min | https://www.omniwellnessmedia.co.za/wellness-exchange |
| UWC Programme Call | `uwc-programme` | 30 min | https://www.omniwellnessmedia.co.za/programs/uwc-human-animal |

---

## 🚀 Step 1: Account Setup

1. **Go to**: https://cal.com/signup
2. **Create account** with email: `hello@omniwellnessmedia.co.za`
3. **Choose username**: `omniwellnessmedia`
   - This creates booking URLs like: `cal.com/omniwellnessmedia/discovery-call`
4. **Set timezone**: Africa/Johannesburg (SAST)

### Brand Settings
- **Navigate to**: Settings → Appearance
- **Brand Color**: `#339999` (Omni teal)
- **Logo**: Upload Omni Wellness Media logo

---

## 🕐 Step 2: Availability Settings

**Navigate to**: Settings → Availability

### Recommended Schedule
- **Days**: Monday - Friday
- **Hours**: 09:00 - 17:00 SAST
- **Buffer between meetings**: 15 minutes
- **Minimum notice**: 24 hours

---

## 📅 Step 3: Create Event Types

For each event below, click **"+ New Event Type"** and configure as specified.

---

### Event 1: Discovery Call

**Basic Info**
- **Title**: Discovery Call
- **Slug**: `discovery-call` ⚠️ MUST MATCH EXACTLY
- **Duration**: 30 minutes
- **Location**: Google Meet (or Zoom)

**Description** (copy-paste):
```
Welcome to Omni Wellness Media! This complimentary 30-minute discovery call is your opportunity to:

✓ Share your vision and goals
✓ Explore how we can support your journey
✓ Discuss our services and find the right fit
✓ Get answers to your questions

We look forward to connecting with you and exploring how we can help transform your wellness, media, or business goals into reality.

"Bridging Wellness, Outreach & Media" - Omni Wellness Media
```

**Booking Questions** (Add these):
1. What brings you to Omni Wellness Media today? (Text, Required)
2. What's your biggest challenge right now? (Text, Required)
3. How did you hear about us? (Text, Optional)

**Confirmation Message**:
```
Thank you for booking your Discovery Call with Omni Wellness Media!

We're excited to connect with you. Please have a think about your goals and any questions you'd like to discuss.

See you soon!
- The Omni Wellness Team
```

**Redirect URL** (after booking): `https://www.omniwellnessmedia.co.za/thank-you`

---

### Event 2: Social Media Strategy Session

**Basic Info**
- **Title**: Social Media Strategy Session
- **Slug**: `social-media-strategy` ⚠️ MUST MATCH EXACTLY
- **Duration**: 60 minutes
- **Location**: Google Meet (or Zoom)

**Description** (copy-paste):
```
Transform your social media presence with our comprehensive strategy session. In this 60-minute consultation, we'll cover:

✓ Audit of your current social media presence
✓ Competitor analysis and positioning
✓ Content strategy recommendations
✓ Platform-specific tactics (Instagram, Facebook, TikTok, LinkedIn)
✓ Engagement and community building strategies
✓ Action plan with measurable goals

Come prepared to share your brand story, target audience insights, and current challenges. We'll develop a tailored roadmap for your social success.

Investment: Strategy sessions start from R2,500
```

**Booking Questions**:
1. What's your business/brand name? (Text, Required)
2. Which social media platforms are you currently using? (Checkboxes: Instagram, Facebook, TikTok, LinkedIn, YouTube, None)
3. What's your main goal for social media? (Text, Required)
4. What's your approximate monthly marketing budget? (Dropdown: Under R5k, R5k-R15k, R15k-R30k, R30k+)

**Redirect URL**: `https://www.omniwellnessmedia.co.za/social-media-strategy`

---

### Event 3: Web Development Consultation

**Basic Info**
- **Title**: Web Development Consultation
- **Slug**: `web-consultation` ⚠️ MUST MATCH EXACTLY
- **Duration**: 45 minutes
- **Location**: Google Meet (or Zoom)

**Description** (copy-paste):
```
Let's bring your digital vision to life! This 45-minute web consultation covers:

✓ Understanding your website needs and goals
✓ Review of your current site (if applicable)
✓ Discussion of features and functionality
✓ E-commerce requirements assessment
✓ Timeline and budget planning
✓ Technology recommendations

Whether you need a new website, e-commerce store, or website refresh, we'll create a clear path forward.

Our web services include:
• Custom website design & development
• E-commerce solutions
• Website maintenance & support
• SEO optimization
• Mobile-responsive design
```

**Booking Questions**:
1. Do you have an existing website? If yes, what's the URL? (Text, Optional)
2. What type of website do you need? (Dropdown: Business/Portfolio, E-commerce, Blog/Content, Web Application, Other)
3. What's your ideal launch timeline? (Dropdown: ASAP, 1-2 months, 3-6 months, Planning ahead)
4. Brief description of your project: (Long Text, Required)

**Redirect URL**: `https://www.omniwellnessmedia.co.za/web-development`

---

### Event 4: Media Production Consultation

**Basic Info**
- **Title**: Media Production Consultation
- **Slug**: `media-production` ⚠️ MUST MATCH EXACTLY
- **Duration**: 60 minutes
- **Location**: Google Meet (or Zoom)

**Description** (copy-paste):
```
Ready to create impactful visual content? This creative consultation covers:

✓ Understanding your media production needs
✓ Concept development and creative direction
✓ Video, photography, or podcast planning
✓ Production timeline and logistics
✓ Budget and resource planning
✓ Distribution strategy

Our media services include:
• Video production (corporate, promotional, documentary)
• Photography (portraits, events, products)
• Podcast production and editing
• Social media content creation
• Drone videography
• Post-production and editing

Let's create conscious content that uplifts, educates, and inspires.
```

**Booking Questions**:
1. What type of media production do you need? (Checkboxes: Video, Photography, Podcast, Social Content, Other)
2. Describe your project vision: (Long Text, Required)
3. Do you have a deadline or event date? (Date, Optional)
4. What's your approximate budget range? (Dropdown: Under R10k, R10k-R25k, R25k-R50k, R50k+)

**Redirect URL**: `https://www.omniwellnessmedia.co.za/media-production`

---

### Event 5: Business Strategy Session

**Basic Info**
- **Title**: Business Strategy Session
- **Slug**: `business-strategy` ⚠️ MUST MATCH EXACTLY
- **Duration**: 60 minutes
- **Location**: Google Meet (or Zoom)

**Description** (copy-paste):
```
Unlock your business potential with strategic guidance. This comprehensive session covers:

✓ Business model review and optimization
✓ Market positioning and branding strategy
✓ Growth planning and sustainable development
✓ Financial strategy alignment
✓ Operational efficiency recommendations
✓ Action plan with clear next steps

Ideal for:
• Startups seeking direction
• Growing businesses ready to scale
• Organizations embracing sustainability
• Entrepreneurs needing clarity

Our approach combines business acumen with conscious values to help you build something meaningful.
```

**Booking Questions**:
1. What's your business name and industry? (Text, Required)
2. How long have you been in business? (Dropdown: Pre-launch, 0-1 years, 1-3 years, 3-5 years, 5+ years)
3. What's your biggest business challenge right now? (Long Text, Required)
4. What does success look like for you in the next 12 months? (Long Text, Required)

**Redirect URL**: `https://www.omniwellnessmedia.co.za/business-consulting`

---

### Event 6: Wellness Exchange Session

**Basic Info**
- **Title**: Wellness Exchange Session
- **Slug**: `wellness-session` ⚠️ MUST MATCH EXACTLY
- **Duration**: 60 minutes
- **Location**: Google Meet (or Zoom)

**Description** (copy-paste):
```
Explore holistic wellness with our Wellness Exchange. This nurturing 60-minute session offers:

✓ Wellness goal exploration
✓ Mind-body-spirit assessment
✓ Personalized wellness recommendations
✓ Introduction to our wellness practitioners
✓ Resource sharing and community connection

The Wellness Exchange connects you with:
• Conscious nutrition guidance
• Mental wellness support
• Movement and body practices
• Financial wellness coaching
• Personal development resources

Begin your journey to holistic well-being with guidance that honors your unique path.
```

**Booking Questions**:
1. What aspect of wellness interests you most? (Checkboxes: Physical, Mental, Emotional, Financial, Spiritual, All of the above)
2. What's your primary wellness goal? (Long Text, Required)
3. Have you worked with wellness practitioners before? (Dropdown: Yes, No, Currently working with someone)

**Redirect URL**: `https://www.omniwellnessmedia.co.za/wellness-exchange`

---

### Event 7: UWC Human-Animal Programme Call

**Basic Info**
- **Title**: UWC Human-Animal Programme Call
- **Slug**: `uwc-programme` ⚠️ MUST MATCH EXACTLY
- **Duration**: 30 minutes
- **Location**: Google Meet (or Zoom)

**Description** (copy-paste):
```
Interested in the UWC Human-Animal Studies Programme? Join us for an informational call to learn about:

✓ Programme overview and curriculum
✓ Semester structure (Italy & South Africa)
✓ Application requirements
✓ Investment and payment options
✓ Career pathways in Human-Animal Studies
✓ Answers to your specific questions

This transformative academic journey combines:
• Human-Animal Studies education
• International study experience
• Hands-on field work with partner organizations
• Career preparation in animal welfare

Applications now open for 2026 cohort!
```

**Booking Questions**:
1. Your current educational background: (Text, Required)
2. Why are you interested in Human-Animal Studies? (Long Text, Required)
3. Are you considering the 2026 cohort? (Dropdown: Yes - 2026, Maybe - exploring options, Future - 2027 or later)
4. Any specific questions you'd like addressed? (Long Text, Optional)

**Redirect URL**: `https://www.omniwellnessmedia.co.za/programs/uwc-human-animal`

---

## ✅ Step 4: Final Checklist

After creating all event types, verify:

- [ ] All slugs match exactly (case-sensitive!)
- [ ] Brand color #339999 is applied
- [ ] Timezone is Africa/Johannesburg
- [ ] Availability hours are set correctly
- [ ] All redirect URLs are correct
- [ ] Test each booking flow yourself

---

## 🔗 Your Cal.com Links

Once setup is complete, your booking URLs will be:

| Event | Booking URL |
|-------|-------------|
| Discovery Call | `https://cal.com/omniwellnessmedia/discovery-call` |
| Social Media Strategy | `https://cal.com/omniwellnessmedia/social-media-strategy` |
| Web Consultation | `https://cal.com/omniwellnessmedia/web-consultation` |
| Media Production | `https://cal.com/omniwellnessmedia/media-production` |
| Business Strategy | `https://cal.com/omniwellnessmedia/business-strategy` |
| Wellness Session | `https://cal.com/omniwellnessmedia/wellness-session` |
| UWC Programme | `https://cal.com/omniwellnessmedia/uwc-programme` |

---

## 📞 Need Help?

Contact the web team if you need:
- Changes to event slugs (requires website code update)
- Additional event types
- Integration troubleshooting
- Custom booking forms

---

*Document created: January 2026*
*For: Omni Wellness Media Team*
