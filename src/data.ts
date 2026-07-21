import { TeamMember, BlogPost, MarketTicker, VideoItem } from './types';

export const FOUNDER_MEMBERS_TH: TeamMember[] = [
  {
    id: 'jidapa',
    name: 'จิดาภา กัลยาณี',
    role: 'ผู้ก่อตั้ง',
    specialty: 'Distrcit Director(DD)',
    bio: 'คุณจิดาภา เป็นผู้ร่วมสร้างแนวคิดการให้คำปรึกษาที่เน้นความซื่อสัตย์ ความเข้าใจง่าย และการดูแลครอบครัวอย่างรอบด้าน',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    location: 'Nakhonratchasima Advisory Office',
    email: 'jidapa_pfa@hotmail.com',
    phone: '061-9629499',
    tags: ['Founder', 'District Director(DD)', 'MDRT'],
    profileSummary: 'เราความสำคัญกับการสร้างความไว้วางใจและการทำให้ครอบครัวเข้าใจแผนการเงินของตัวเองอย่างแท้จริง',
    biography: [
      'ดิฉันได้วางรากฐานของ Ultimate Life Advisor ให้เป็นพื้นที่ให้คำปรึกษาที่ลูกค้าสามารถพูดคุยเรื่องการเงินและความคุ้มครองได้อย่างสบายใจ',
      'โดยเชื่อว่าการวางแผนที่ดีต้องเริ่มจากการรับฟังชีวิตจริงของลูกค้า ไม่ใช่เริ่มจากผลิตภัณฑ์ เพราะแต่ละครอบครัวมีภาระ รายได้ ความกังวล และเป้าหมายที่ไม่เหมือนกัน',
      'แนวทางของเราคือทำให้เรื่องประกันชีวิต สุขภาพ การออม และการวางแผนระยะยาวกลายเป็นเรื่องที่เข้าใจง่าย โปร่งใส และตัดสินใจได้อย่างมั่นใจ'
    ],
    philosophy: 'ความไว้วางใจเกิดจากความชัดเจน ความจริงใจ และคำแนะนำที่ลูกค้าเข้าใจได้ด้วยตัวเอง',
    experience: [
      { title: 'ผู้ก่อตั้ง', company: 'Ultimate Life Advisor', period: '2009 - Present', description: 'วางแนวทางการดูแลลูกค้าและมาตรฐานการให้คำปรึกษาแบบครอบครัวเป็นศูนย์กลาง' }
    ],
    education: [
      { degree: 'คุณวุฒิและประสบการณ์', school: 'AIA FA,Ultimate Life Advisor Academy' }
    ],
    credentials: ['Founder', 'Distrcit Director', 'MDRT']
  },
  {
    id: 'weerapan',
    name: 'วีระพันธ์ เต็มดวง',
    role: 'ผู้ก่อตั้ง, นักวางแผนการเงิน CFP',
    specialty: 'Certificated Financial Planner',
    bio: 'เราออกแบบการวางแผนการเงินให้เป็นระบบตามหลักการวางแผนการเงินสากล หรือ CFP  เข้าใจง่าย และเชื่อมโยงกับเป้าหมายชีวิตของลูกค้า',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=900',
    location: 'Nakhonratchasima Advisory Office',
    email: 'weerapan.aia@hotmail.com',
    phone: '099-4588787',
    tags: ['Certificated Financial Planning(CFP)', 'MDRT Life Member'],
    profileSummary: 'ผมช่วยให้ลูกค้าเห็นภาพรวมทางการเงินอย่างเป็นขั้นตอน ตั้งแต่ความคุ้มครอง รายได้ เงินออม ไปจนถึงเป้าหมายระยะยาว เพื่อให้การวางแผนการเงิน สอดคล้องกับเป้าหมายชีวิต',
    biography: [
      'วีระพันธ์มีบทบาทในการพัฒนากระบวนการวางแผนที่ช่วยให้ลูกค้าเข้าใจสถานะทางการเงินของตัวเองอย่างชัดเจนก่อนตัดสินใจ',
      'เขาให้ความสำคัญกับการประเมินความคุ้มครอง รายได้ หนี้สิน เงินออม และเป้าหมายชีวิต เพื่อออกแบบแผนที่เหมาะสมกับแต่ละครอบครัว',
      'ในฐานะผู้ก่อตั้งและนักวางแผนการเงิน เขามุ่งให้คำแนะนำที่เป็นกลาง ตรวจสอบได้ และนำไปใช้จริงในชีวิตประจำวัน โดยยึดเป้าหมายของลูกค้าเป็นหลัก'
    ],
    philosophy: 'แผนการเงินที่ดีต้องชัดเจนพอให้ลูกค้าเข้าใจ และยืดหยุ่นพอให้เดินไปกับชีวิตจริง',
    experience: [
      { title: 'ผู้ก่อตั้ง, นักวางแผนการเงิน CFP', company: 'Ultimate Life Advisor', period: '2011 - Present', description: 'ออกแบบกระบวนการวางแผนการเงินและดูแลแนวทางการประเมินความคุ้มครองของลูกค้า' }
    ],
    education: [
      { degree: 'คุณวุฒิและประสบการณ์', school: 'Certificate financial planning(CFP), MDRT' }
    ],
    credentials: ['Co-Founder', 'CFP', 'MDRT']
  }
];

export const FOUNDER_MEMBERS_EN: TeamMember[] = [
  {
    id: 'jidapa',
    name: 'Jidapa Kulyanee',
    role: 'Founder',
    specialty: 'Distrcit Director(DD)',
    bio: 'Jidapa shaped the firm around clear, honest, family-centered financial guidance.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    location: 'Nakhonratchasima Advisory Office',
    email: 'jidapa_pfa@hotmail.com',
    phone: '061-9629499',
    tags: ['Founder', 'District Director(DD)', 'MDRT'],
    profileSummary: 'Jidapa focuses on trust, clarity, and helping families understand the financial plan behind every recommendation.',
    biography: [
      'Jidapa helped build Ultimate Life Advisor as a place where families can discuss protection, savings, and long-term planning with confidence.',
      'She believes good planning begins with listening to real life needs rather than starting with products. Every family has different responsibilities, concerns, and goals.',
      'Her work centers on making life insurance, health protection, savings, and long-term planning clear, transparent, and easier to decide on.'
    ],
    philosophy: 'Trust is built through clarity, sincerity, and advice clients can understand for themselves.',
    experience: [
      { title: 'Founder', company: 'Ultimate Life Advisor', period: '2009 - Present', description: 'Shapes client-care standards and family-centered advisory principles.' }
    ],
    education: [
      { degree: 'Certificated', school: 'AIA FA, Ultimate Life Advisor Academy' }
    ],
    credentials: ['Founder', 'Distrcit Director', 'MDRT']
  },
  {
    id: 'weerapan',
    name: 'Weerapan Temduang',
    role: 'Co-Founder, Financial Planner',
    specialty: 'Financial Planner',
    bio: 'Weerapan designs structured financial planning processes that connect protection, savings, and life goals.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=900',
    location: 'Nakhonratchasima Advisory Office',
    email: 'weerapan.aia@hotmail.com',
    phone: '099-4588787',
    tags: ['Certificated Financial Planning(CFP)', 'MDRT Lifemember'],
    profileSummary: 'Weerapan helps clients see their financial picture step by step, from protection and income to savings and long-term goals.',
    biography: [
      'Weerapan develops planning workflows that help clients understand their financial position before making decisions.',
      'He focuses on reviewing protection, income, liabilities, savings, and life goals so each family receives a plan that fits its real priorities.',
      'As Co-Founder and Financial Planner, he emphasizes practical, transparent, and unbiased advice clients can apply in daily life.'
    ],
    philosophy: 'A good financial plan should be clear enough to understand and flexible enough to move with real life.',
    experience: [
      { title: 'Co-Founder, Financial Planner', company: 'Ultimate Life Advisor', period: '2009 - Present', description: 'Designs financial planning processes and client protection review frameworks.' }
    ],
    education: [
      { degree: 'Certificated', school: 'Certificated Financial Planning(CFP), MDRT' }
    ],
    credentials: ['Co-Founder', 'CFP', 'MDRT']
  }
];

export const FOUNDER_MEMBERS: TeamMember[] = FOUNDER_MEMBERS_TH.map((founderTh) => {
  const founderEn = FOUNDER_MEMBERS_EN.find((founder) => founder.id === founderTh.id);

  return {
    ...founderTh,
    nameTh: founderTh.name,
    nameEn: founderEn?.name ?? founderTh.name,
    roleTh: founderTh.role,
    roleEn: founderEn?.role ?? founderTh.role,
    bioTh: founderTh.bio,
    bioEn: founderEn?.bio ?? founderTh.bio,
    specialtyTh: founderTh.specialty,
    specialtyEn: founderEn?.specialty ?? founderTh.specialty,
    locationTh: founderTh.location,
    locationEn: founderEn?.location ?? founderTh.location,
    profileSummaryTh: founderTh.profileSummary,
    profileSummaryEn: founderEn?.profileSummary ?? founderTh.profileSummary,
    biographyTh: founderTh.biography ?? [],
    biographyEn: founderEn?.biography ?? founderTh.biography ?? [],
    philosophyTh: founderTh.philosophy,
    philosophyEn: founderEn?.philosophy ?? founderTh.philosophy,
    experienceTh: founderTh.experience ?? [],
    experienceEn: founderEn?.experience ?? founderTh.experience ?? [],
    educationTh: founderTh.education ?? [],
    educationEn: founderEn?.education ?? founderTh.education ?? [],
    credentialsTh: founderTh.credentials ?? [],
    credentialsEn: founderEn?.credentials ?? founderTh.credentials ?? [],
  };
});

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    role: 'Co-Founder & Lead Financial Planner',
    bio: 'With over 18 years of experience in wealth preservation, Marcus guides families through comprehensive retirement architectures, life protection, and generational security.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    specialty: 'Family Wealth Strategy',
    location: 'Bangkok Advisory Office',
    email: 'marcus@ultimate-life-advisor.com',
    phone: '+66 2 123 4567',
    tags: ['Asset Allocation', 'Retirement', 'Legacy Planning'],
    profileSummary: 'Marcus leads holistic family financial planning for clients who need a clear balance between protection, retirement readiness, and long-term capital discipline.',
    biography: [
      'Marcus works with families and business owners to translate complex financial goals into practical protection and investment plans. His advisory process begins with income security, liquidity needs, and long-term family obligations before recommending any product.',
      'He has spent more than 18 years designing retirement architectures, life protection programs, and wealth preservation strategies. His strength is helping clients understand trade-offs clearly so every decision supports their real-life priorities.',
      'At Ultimate Life Advisor, Marcus oversees the planning framework used by the advisory team, including risk profiling, cash-flow review, insurance gap analysis, and disciplined portfolio allocation.'
    ],
    philosophy: 'A strong financial plan should protect the family first, then let long-term capital grow with discipline. The best advice is simple enough to follow and robust enough to hold through uncertain markets.',
    experience: [
      { title: 'Lead Financial Planner', company: 'Ultimate Life Advisor', period: '2018 - Present', description: 'Leads family financial planning, retirement architecture, and protection strategy.' },
      { title: 'Senior Wealth Advisor', company: 'Independent Advisory Group', period: '2010 - 2018', description: 'Advised high-income professionals and business owners on risk-managed wealth plans.' },
      { title: 'Financial Consultant', company: 'Regional Insurance & Wealth Firm', period: '2006 - 2010', description: 'Built foundational expertise in life insurance, health protection, and savings plans.' }
    ],
    education: [
      { degree: 'MBA, Finance', school: 'International Business School' },
      { degree: 'Certified Financial Planning Program', school: 'Thai Financial Planners Association' },
      { degree: 'Life & Health Insurance License', school: 'OIC Approved Program' }
    ],
    credentials: ['AIA', 'MDRT']
  },
  {
    id: 'elena',
    name: 'Elena Vance',
    role: 'Head of Protection & Health Insurance',
    bio: 'Elena specializes in tailored life insurance, premium healthcare risk mitigation, and critical illness protection, ensuring complete family income shielding.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    specialty: 'Health & Income Protection',
    location: 'Bangkok Advisory Office',
    email: 'elena@ultimate-life-advisor.com',
    phone: '+66 2 123 4568',
    tags: ['Life Insurance', 'Health Cover', 'Critical Illness'],
    profileSummary: 'Elena helps families close protection gaps with life insurance, health coverage, and critical illness plans that match real household responsibilities.',
    biography: [
      'Elena focuses on the protection side of financial planning, especially income replacement, medical expense risk, and critical illness exposure. Her work is ideal for clients who want to know exactly what their family would need if life changes unexpectedly.',
      'She reviews existing policies, employer benefits, family liabilities, and dependents before recommending a coverage structure. Her process is designed to avoid duplicate coverage while keeping the most important risks protected.',
      'Within Ultimate Life Advisor, Elena supports advisors on underwriting strategy, medical plan comparison, and protection-first planning for young families and business owners.'
    ],
    philosophy: 'Good protection is not about buying the largest policy. It is about placing the right shield in the right position so the family can keep living with dignity when income or health is interrupted.',
    experience: [
      { title: 'Head of Protection & Health Insurance', company: 'Ultimate Life Advisor', period: '2019 - Present', description: 'Designs life, health, and critical illness protection frameworks for families.' },
      { title: 'Protection Planning Specialist', company: 'Premium Health Advisory', period: '2013 - 2019', description: 'Compared medical and income protection solutions for professional clients.' },
      { title: 'Client Risk Consultant', company: 'Life Protection Group', period: '2009 - 2013', description: 'Built coverage gap reports and policy review workflows.' }
    ],
    education: [
      { degree: 'B.S. Public Health', school: 'International Health University' },
      { degree: 'Advanced Protection Planning', school: 'Insurance Advisory Institute' },
      { degree: 'Health Insurance Specialist Certificate', school: 'OIC Approved Program' }
    ],
    credentials: ['Health Planner', 'AIA', 'MDRT']
  },
  {
    id: 'julian',
    name: 'Julian Rossi',
    role: 'Senior Retirement & Education Specialist',
    bio: 'Julian coordinates strategic goal-based savings structures, focusing on tax-advantaged retirement compounding and premium children\'s education fund designs.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    specialty: 'Retirement & Education Funding',
    location: 'Bangkok Advisory Office',
    email: 'julian@ultimate-life-advisor.com',
    phone: '+66 2 123 4569',
    tags: ['Retirement Income', 'Education Fund', 'Goal Planning'],
    profileSummary: 'Julian builds goal-based savings plans for retirement income and children education funding, with emphasis on timeline, inflation, and contribution discipline.',
    biography: [
      'Julian works with clients who need a roadmap for future liabilities such as university tuition, retirement income, and milestone family goals. He turns long-term numbers into monthly actions that clients can actually maintain.',
      'His advisory approach combines future value estimates, inflation assumptions, and realistic contribution planning. Clients often choose Julian when they need clarity on how much to save and which goal should come first.',
      'At Ultimate Life Advisor, Julian develops education-fund calculators, retirement scenarios, and annual review frameworks that keep family goals visible over time.'
    ],
    philosophy: 'Every big life goal becomes easier when it is converted into a clear monthly habit. Planning should reduce anxiety by showing the next realistic step, not overwhelm families with abstract numbers.',
    experience: [
      { title: 'Senior Retirement & Education Specialist', company: 'Ultimate Life Advisor', period: '2020 - Present', description: 'Builds retirement and education funding strategies for families.' },
      { title: 'Goal-Based Planning Advisor', company: 'Future Funds Advisory', period: '2014 - 2020', description: 'Designed savings programs for retirement and children education goals.' },
      { title: 'Investment Planning Associate', company: 'Private Client Planning Desk', period: '2011 - 2014', description: 'Prepared client scenarios, contribution models, and portfolio reviews.' }
    ],
    education: [
      { degree: 'M.Sc. Financial Planning', school: 'European School of Finance' },
      { degree: 'Retirement Planning Certificate', school: 'Financial Planning Institute' },
      { degree: 'Education Funding Workshop', school: 'Private Wealth Academy' }
    ],
    credentials: ['Retirement Planner', 'Education Fund']
  },
  {
    id: 'sarah',
    name: 'Sarah Chen',
    role: 'Head of Personal Investment Strategy',
    bio: 'Sarah oversees personalized asset allocation, utilizing rigorous mutual fund selection and portfolio rebalancing models to build durable, inflation-beating portfolios.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    specialty: 'Portfolio Strategy',
    location: 'Bangkok Advisory Office',
    email: 'sarah@ultimate-life-advisor.com',
    phone: '+66 2 123 4570',
    tags: ['Mutual Funds', 'Portfolio Review', 'Rebalancing'],
    profileSummary: 'Sarah leads personal investment strategy with a focus on asset allocation, fund selection, and portfolio rebalancing that fits each client risk profile.',
    biography: [
      'Sarah helps clients invest with a disciplined process rather than short-term market reactions. She starts with risk tolerance, time horizon, liquidity needs, and protection readiness before selecting an investment path.',
      'Her work includes mutual fund screening, portfolio diversification, and rebalancing plans for clients who want growth while keeping downside risk understandable.',
      'Within Ultimate Life Advisor, Sarah supports the investment committee and translates market conditions into practical portfolio guidance for personal financial plans.'
    ],
    philosophy: 'A portfolio should be built to survive emotions, not just market cycles. The right allocation gives clients confidence to stay invested through volatility and keep moving toward their goals.',
    experience: [
      { title: 'Head of Personal Investment Strategy', company: 'Ultimate Life Advisor', period: '2018 - Present', description: 'Leads fund selection, portfolio review, and client investment frameworks.' },
      { title: 'Portfolio Strategy Manager', company: 'Private Wealth Research', period: '2012 - 2018', description: 'Built model portfolios and conducted fund due diligence.' },
      { title: 'Investment Analyst', company: 'Regional Asset Management Firm', period: '2008 - 2012', description: 'Analyzed mutual funds, market trends, and portfolio allocation data.' }
    ],
    education: [
      { degree: 'M.S. Investment Management', school: 'Asia Graduate School of Finance' },
      { degree: 'CFA Program Candidate', school: 'CFA Institute' },
      { degree: 'Portfolio Construction Certificate', school: 'Wealth Management Academy' }
    ],
    credentials: ['CFA', 'Portfolio Strategy']
  },
  {
    id: 'narin',
    name: 'Narin Kittisak',
    role: 'Family Protection Advisor',
    bio: 'Narin advises young families on life protection, income replacement, and healthcare coverage, helping clients build a strong first layer of financial security.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    specialty: 'Family Protection Planning',
    location: 'Bangkok Advisory Office',
    email: 'narin@ultimate-life-advisor.com',
    phone: '+66 2 123 4571',
    tags: ['Income Protection', 'Family Cover', 'Policy Review'],
    profileSummary: 'Narin helps young families understand the protection they need before moving into investment or long-term savings decisions.',
    biography: [
      'Narin focuses on the early stage of family financial planning, where income security, healthcare coverage, and debt protection often matter most. He helps clients see which risks could interrupt the household plan and how to cover them efficiently.',
      'His review process compares existing policies, family expenses, liabilities, and children needs before building a protection recommendation. This makes the plan easier to understand and easier to maintain.',
      'At Ultimate Life Advisor, Narin works closely with new clients who want a clear foundation before choosing retirement, education, or investment strategies.'
    ],
    philosophy: 'Protection should make a family feel steady, not overloaded. The right plan removes the largest risks first and leaves room for life to keep moving.',
    experience: [
      { title: 'Family Protection Advisor', company: 'Ultimate Life Advisor', period: '2021 - Present', description: 'Designs income protection and family insurance plans for new households.' },
      { title: 'Insurance Planning Consultant', company: 'Family Risk Advisory', period: '2016 - 2021', description: 'Reviewed life and health policies for working professionals.' },
      { title: 'Client Service Associate', company: 'Protection Planning Desk', period: '2013 - 2016', description: 'Supported client onboarding, policy comparison, and annual reviews.' }
    ],
    education: [
      { degree: 'B.B.A. Finance', school: 'Bangkok Business University' },
      { degree: 'Life Insurance Planning Certificate', school: 'OIC Approved Program' },
      { degree: 'Family Risk Advisory Workshop', school: 'Wealth Protection Academy' }
    ],
    credentials: ['AIA', 'Protection', 'MDRT']
  },
  {
    id: 'maya',
    name: 'Maya Laurent',
    role: 'Tax & Retirement Planning Consultant',
    bio: 'Maya builds retirement and tax-aware savings frameworks for professionals who want their long-term plan to be efficient, practical, and easy to review each year.',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=400',
    specialty: 'Tax-Aware Retirement Planning',
    location: 'Bangkok Advisory Office',
    email: 'maya@ultimate-life-advisor.com',
    phone: '+66 2 123 4572',
    tags: ['Tax Planning', 'Retirement', 'Annual Review'],
    profileSummary: 'Maya supports professionals and business owners with retirement plans that consider tax efficiency, contribution discipline, and annual optimization.',
    biography: [
      'Maya helps clients connect their retirement goals with tax-aware saving decisions. Her work is especially useful for clients who want to reduce friction between short-term tax planning and long-term financial freedom.',
      'She reviews cash flow, current tax allowances, retirement timeline, and expected future lifestyle before building a savings structure. Her goal is to keep the plan clear enough to update every year.',
      'At Ultimate Life Advisor, Maya contributes to annual review workflows and client education around retirement readiness, savings discipline, and tax-benefit planning.'
    ],
    philosophy: 'A retirement plan should not be reviewed only once. It should mature with your income, your family, and the rules around your money.',
    experience: [
      { title: 'Tax & Retirement Planning Consultant', company: 'Ultimate Life Advisor', period: '2020 - Present', description: 'Builds retirement and tax-aware savings plans for professionals.' },
      { title: 'Retirement Planning Analyst', company: 'Private Retirement Desk', period: '2015 - 2020', description: 'Prepared retirement scenarios and annual optimization plans.' },
      { title: 'Financial Planning Associate', company: 'Regional Advisory Firm', period: '2012 - 2015', description: 'Supported savings, tax allowance, and client review documentation.' }
    ],
    education: [
      { degree: 'M.A. Financial Economics', school: 'International School of Economics' },
      { degree: 'Retirement Income Planning Certificate', school: 'Financial Planning Institute' },
      { degree: 'Tax Planning Workshop', school: 'Thai Tax Advisory Academy' }
    ],
    credentials: ['Tax Planning', 'Retirement']
  },
  {
    id: 'thanawat',
    name: 'Thanawat Chaiyaporn',
    role: 'Business Owner Advisory Specialist',
    bio: 'Thanawat works with entrepreneurs on business protection, key-person coverage, succession planning, and personal wealth separation from company risk.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    specialty: 'Business Owner Advisory',
    location: 'Bangkok Advisory Office',
    email: 'thanawat@ultimate-life-advisor.com',
    phone: '+66 2 123 4573',
    tags: ['Key Person', 'Succession', 'Business Protection'],
    profileSummary: 'Thanawat helps business owners protect both the company and the family by separating personal wealth goals from business operating risk.',
    biography: [
      'Thanawat specializes in advisory work for entrepreneurs and family businesses. He helps owners identify where personal financial security is tied too closely to company cash flow, key-person risk, or succession uncertainty.',
      'His process includes owner income analysis, business continuity needs, liability review, and family protection planning. The result is a structure that supports both the company and the household.',
      'At Ultimate Life Advisor, Thanawat supports business-owner cases that require coordinated insurance, succession, and long-term wealth planning.'
    ],
    philosophy: 'A strong business can still leave the family exposed if the owner plan is unclear. The best advisory work protects the engine and the people behind it.',
    experience: [
      { title: 'Business Owner Advisory Specialist', company: 'Ultimate Life Advisor', period: '2019 - Present', description: 'Advises entrepreneurs on business protection and owner wealth planning.' },
      { title: 'SME Financial Consultant', company: 'Enterprise Advisory Partners', period: '2013 - 2019', description: 'Designed continuity and protection plans for small and medium enterprises.' },
      { title: 'Corporate Relationship Manager', company: 'Commercial Banking Group', period: '2009 - 2013', description: 'Managed entrepreneur relationships and business financial reviews.' }
    ],
    education: [
      { degree: 'MBA, Entrepreneurship', school: 'Sasin Graduate Institute' },
      { degree: 'Business Succession Planning Certificate', school: 'Private Wealth Academy' },
      { degree: 'Corporate Risk Advisory Program', school: 'Business Advisory Institute' }
    ],
    credentials: ['SME Advisory', 'AIA', 'Succession']
  },
  {
    id: 'isabella',
    name: 'Isabella Morgan',
    role: 'Education & Legacy Planning Advisor',
    bio: 'Isabella guides parents through education funding, legacy goals, and long-term family planning so the next generation receives both opportunity and protection.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    specialty: 'Education & Legacy Planning',
    location: 'Bangkok Advisory Office',
    email: 'isabella@ultimate-life-advisor.com',
    phone: '+66 2 123 4574',
    tags: ['Education Fund', 'Legacy', 'Family Goals'],
    profileSummary: 'Isabella helps parents plan for children education costs, family milestones, and legacy goals with a practical savings and protection framework.',
    biography: [
      'Isabella works with parents who want to prepare education funding without sacrificing household protection or retirement security. She translates future school and university costs into realistic monthly planning.',
      'Her advisory style combines savings timeline design, inflation assumptions, protection checks, and family priority mapping. She helps clients decide which goal should be funded first and how to review progress.',
      'At Ultimate Life Advisor, Isabella contributes to education-fund planning and legacy conversations for families who want to provide lasting support to the next generation.'
    ],
    philosophy: 'Legacy is not only what remains at the end. It is the series of thoughtful choices that give the next generation more stability, options, and confidence.',
    experience: [
      { title: 'Education & Legacy Planning Advisor', company: 'Ultimate Life Advisor', period: '2022 - Present', description: 'Builds education funding and family legacy plans for parents.' },
      { title: 'Family Goals Consultant', company: 'Next Generation Planning', period: '2016 - 2022', description: 'Prepared education cost projections and long-term family savings plans.' },
      { title: 'Client Planning Coordinator', company: 'Private Family Office Services', period: '2012 - 2016', description: 'Supported multi-generation planning and client reporting.' }
    ],
    education: [
      { degree: 'B.A. Economics', school: 'University of Melbourne' },
      { degree: 'Education Funding Planning Certificate', school: 'Family Wealth Institute' },
      { degree: 'Legacy Planning Workshop', school: 'Private Client Academy' }
    ],
    credentials: ['Education', 'Legacy']
  },
  {
    id: 'ananda',
    name: 'Ananda Srisuwan',
    role: 'Life Protection & Income Security Advisor',
    bio: 'Ananda helps working families design income replacement, life protection, and healthcare coverage that stays practical through different life stages.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    specialty: 'Income Security Planning',
    location: 'Nakhonratchasima Advisory Office',
    email: 'ananda@ultimate-life-advisor.com',
    phone: '099-4588787',
    tags: ['Life Protection', 'Income Security', 'Health Cover'],
    profileSummary: 'Ananda focuses on practical protection planning for families who need clear income security, health coverage, and policy review guidance.',
    biography: [
      'Ananda works with clients who want to protect household income before making long-term investment decisions. He reviews living expenses, debt obligations, dependents, and existing coverage to identify the most important gaps.',
      'His planning style is simple and practical. Clients receive a clear explanation of what each coverage layer protects, how much protection is needed, and which risks should be prioritized first.',
      'At Ultimate Life Advisor, Ananda supports family protection reviews, income replacement planning, and annual insurance checkups.'
    ],
    philosophy: 'Protection should be understandable, affordable, and strong enough to keep the family plan alive when life becomes uncertain.',
    experience: [
      { title: 'Life Protection & Income Security Advisor', company: 'Ultimate Life Advisor', period: '2021 - Present', description: 'Builds life protection and income security plans for working families.' },
      { title: 'Protection Consultant', company: 'Family Coverage Advisory', period: '2016 - 2021', description: 'Reviewed life and health insurance structures for professional clients.' },
      { title: 'Client Service Specialist', company: 'Insurance Planning Desk', period: '2013 - 2016', description: 'Supported policy comparison, client onboarding, and protection reviews.' }
    ],
    education: [
      { degree: 'B.B.A. Finance', school: 'Nakhonratchasima Business Institute' },
      { degree: 'Life Insurance Planning Certificate', school: 'OIC Approved Program' },
      { degree: 'Income Protection Workshop', school: 'Family Risk Academy' }
    ],
    credentials: ['AIA', 'Protection', 'Income Security']
  },
  {
    id: 'pimchanok',
    name: 'Pimchanok Rattanakul',
    role: 'Retirement Readiness Advisor',
    bio: 'Pimchanok helps clients turn retirement concerns into clear savings milestones, income targets, and annual review plans.',
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=400',
    specialty: 'Retirement Readiness',
    location: 'Nakhonratchasima Advisory Office',
    email: 'pimchanok@ultimate-life-advisor.com',
    phone: '099-4588787',
    tags: ['Retirement', 'Cash Flow', 'Annual Review'],
    profileSummary: 'Pimchanok guides clients through retirement readiness by connecting savings discipline, income needs, and protection planning.',
    biography: [
      'Pimchanok works with clients who want to know whether their retirement plan is on track. She translates future income needs into realistic savings steps and reviewable milestones.',
      'Her process includes cash-flow review, retirement age assumptions, inflation estimates, protection readiness, and contribution planning. This helps clients see what needs to change now rather than waiting until retirement is close.',
      'At Ultimate Life Advisor, Pimchanok supports retirement scenario reviews and annual progress checkups.'
    ],
    philosophy: 'Retirement confidence comes from a plan that can be measured, reviewed, and adjusted before it is too late.',
    experience: [
      { title: 'Retirement Readiness Advisor', company: 'Ultimate Life Advisor', period: '2020 - Present', description: 'Creates retirement readiness plans and annual review frameworks.' },
      { title: 'Retirement Planning Consultant', company: 'Future Income Advisory', period: '2015 - 2020', description: 'Prepared retirement income scenarios and savings plans.' },
      { title: 'Financial Planning Associate', company: 'Private Client Services', period: '2012 - 2015', description: 'Supported cash-flow analysis and client planning documentation.' }
    ],
    education: [
      { degree: 'M.A. Applied Economics', school: 'Kasetsart University' },
      { degree: 'Retirement Planning Certificate', school: 'Financial Planning Institute' },
      { degree: 'Cash Flow Planning Workshop', school: 'Wealth Advisory Academy' }
    ],
    credentials: ['Retirement', 'Planning', 'Review']
  },
  {
    id: 'kittipong',
    name: 'Kittipong Arunrat',
    role: 'Investment & Portfolio Review Advisor',
    bio: 'Kittipong helps clients review portfolio structure, risk levels, and fund allocation so investments align with real goals rather than market noise.',
    image: 'https://images.unsplash.com/photo-1562788869-4ed32648eb72?auto=format&fit=crop&q=80&w=400',
    specialty: 'Portfolio Review',
    location: 'Nakhonratchasima Advisory Office',
    email: 'kittipong@ultimate-life-advisor.com',
    phone: '099-4588787',
    tags: ['Portfolio Review', 'Mutual Funds', 'Risk Profile'],
    profileSummary: 'Kittipong supports investment planning through risk profiling, portfolio review, mutual fund selection, and disciplined rebalancing.',
    biography: [
      'Kittipong works with clients who already invest but are not sure whether their portfolio matches their risk level, timeline, and family goals.',
      'He reviews asset allocation, concentration risk, liquidity needs, and protection readiness before recommending investment adjustments. His goal is to make the portfolio easier to understand and easier to stay with.',
      'At Ultimate Life Advisor, Kittipong contributes to portfolio review sessions and investment planning workflows.'
    ],
    philosophy: 'A portfolio is useful only when clients understand why they own it and can stay disciplined through market changes.',
    experience: [
      { title: 'Investment & Portfolio Review Advisor', company: 'Ultimate Life Advisor', period: '2021 - Present', description: 'Reviews client portfolios and risk-aligned allocation strategies.' },
      { title: 'Investment Planning Analyst', company: 'Regional Wealth Research', period: '2016 - 2021', description: 'Analyzed mutual funds, asset allocation, and portfolio performance.' },
      { title: 'Client Portfolio Associate', company: 'Asset Advisory Desk', period: '2013 - 2016', description: 'Prepared portfolio reports and investment review materials.' }
    ],
    education: [
      { degree: 'B.S. Finance', school: 'Thammasat University' },
      { degree: 'Portfolio Management Certificate', school: 'Investment Advisory Institute' },
      { degree: 'Mutual Fund Planning Workshop', school: 'Wealth Management Academy' }
    ],
    credentials: ['Portfolio', 'Funds', 'Risk Review']
  },
  {
    id: 'sirinya',
    name: 'Sirinya Phromchai',
    role: 'Family Education Fund Advisor',
    bio: 'Sirinya helps parents prepare education funding plans that balance school costs, protection needs, and long-term household stability.',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400',
    specialty: 'Education Fund Planning',
    location: 'Nakhonratchasima Advisory Office',
    email: 'sirinya@ultimate-life-advisor.com',
    phone: '099-4588787',
    tags: ['Education Fund', 'Family Goals', 'Savings Plan'],
    profileSummary: 'Sirinya helps families build education funding plans with realistic contribution schedules, inflation assumptions, and protection checks.',
    biography: [
      'Sirinya works with parents who want to prepare for children education costs without weakening emergency funds, retirement goals, or insurance protection.',
      'Her process reviews the child timeline, expected school path, future tuition assumptions, and current household cash flow. She helps clients choose a savings rhythm that is realistic and sustainable.',
      'At Ultimate Life Advisor, Sirinya supports education-fund planning and family goal review sessions.'
    ],
    philosophy: 'Education planning works best when it gives parents confidence today and children more choices tomorrow.',
    experience: [
      { title: 'Family Education Fund Advisor', company: 'Ultimate Life Advisor', period: '2022 - Present', description: 'Builds education funding and family savings plans.' },
      { title: 'Family Planning Consultant', company: 'Next Step Advisory', period: '2017 - 2022', description: 'Prepared goal-based savings plans for families with young children.' },
      { title: 'Client Planning Coordinator', company: 'Private Advisory Services', period: '2014 - 2017', description: 'Supported family cash-flow analysis and planning documents.' }
    ],
    education: [
      { degree: 'B.A. Economics', school: 'Chiang Mai University' },
      { degree: 'Education Funding Certificate', school: 'Family Wealth Institute' },
      { degree: 'Goal-Based Planning Workshop', school: 'Financial Advisory Academy' }
    ],
    credentials: ['Education', 'Savings', 'Family Goals']
  }
];

export const DEFAULT_ADVISOR_MEMBERS: TeamMember[] = [
  ...FOUNDER_MEMBERS,
  ...TEAM_MEMBERS,
];

export const MARKET_TICKERS: MarketTicker[] = [
  { symbol: 'SPX', name: 'S&P 500 Index', price: '5,432.12', change: '+1.24%', isPositive: true },
  { symbol: 'VIX', name: 'Volatility Index', price: '12.40', change: '-4.80%', isPositive: false },
  { symbol: 'ALPHA', name: 'Alpha Gen (Top 2%)', price: '142.80', change: '+3.15%', isPositive: true },
  { symbol: 'BTC', name: 'Bitcoin / Digital Gold', price: '68,240.50', change: '+2.85%', isPositive: true }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'market-trends-2024',
    title: 'แนวโน้มตลาดทุนโลก 2026: โอกาสและความท้าทายในการบริหารความมั่งคั่ง',
    category: 'investment',
    categoryTh: 'การลงทุน',
    excerpt: 'เจาะลึกการวางกลยุทธ์การลงทุนภายใต้สภาวะเศรษฐกิจผันผวน พร้อมเทคนิคการปรับพอร์ตให้รับมือกับอัตราดอกเบี้ยผันผวนและเงินเฟ้อ',
    date: '1 กรกฎาคม 2026',
    author: 'อนันต์ บูรณเกียรติ',
    readTime: '8 นาที',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800',
    content: `สถานการณ์เศรษฐกิจโลกในปัจจุบันก้าวเข้าสู่ยุค 'Higher for Longer' หรือภาวะที่อัตราดอกเบี้ยนโยบายอยู่ในระดับสูงเป็นระยะเวลานานกว่าที่ตลาดคาดการณ์ไว้ ซึ่งนี่เป็นความท้าทายครั้งสำคัญสำหรับนักลงทุนที่ต้องการปกป้องและเพิ่มพูนความมั่งคั่งของตนเอง

ในบทความนี้ ฝ่ายกลยุทธ์ของ Ultimate Life Advisor จะนำเสนอ 3 แนวทางสำคัญที่จะช่วยให้พอร์ตการลงทุนของคุณมีความทนทานและพร้อมรับมือกับทุกความผันผวน:

1. **การกระจายความเสี่ยงในสินทรัพย์ทางเลือก (Alternative Investments)**
การพึ่งพาเพียงพอร์ตหุ้นและตราสารหนี้แบบเดิม (60/40) อาจไม่เพียงพออีกต่อไป การเพิ่มสัดส่วนทองคำ อสังหาริมทรัพย์ระดับพรีเมียม และกองทุน Private Equity จะช่วยสร้างเกราะป้องกันภัยเงินเฟ้อได้เป็นอย่างดี

2. **การเน้นลงทุนในหุ้นกลุ่มที่มีกระแสเงินสดแข็งแกร่ง (Quality Growth)**
เลือกบริษัทที่มีหนี้สินต่ำ มีอำนาจการต่อรองราคา และสามารถส่งผ่านต้นทุนที่เพิ่มขึ้นไปยังผู้บริโภคได้ หุ้นเหล่านี้มักจะเป็นผู้ชนะในระยะยาวเสมอ

3. **กลยุทธ์การบริหารสภาพคล่องเชิงรุก (Active Treasury Management)**
ด้วยผลตอบแทนจากตลาดเงินและพันธบัตรรัฐบาลระยะสั้นที่น่าดึงดูดใจ การพักเงินบางส่วนในสินทรัพย์ที่มีสภาพคล่องสูงเพื่อรอจังหวะที่ตลาดปรับฐาน เป็นกลยุทธ์สำคัญที่จะช่วยรักษาเสถียรภาพโดยรวมของพอร์ต`
  },
  {
    id: 'portfolio-tips',
    title: '5 เคล็ดลับการวางแผนพอร์ตหุ้นให้เติบโตอย่างยั่งยืนในยุคดิจิทัล',
    category: 'investment',
    categoryTh: 'การลงทุน',
    excerpt: 'คัดสรรกลวิธีเด็ดจากผู้เชี่ยวชาญ ค้นหาหุ้นแกร่งด้วยระบบตรวจสอบคุณภาพสินทรัพย์แบบเจาะลึก และเพิ่มผลตอบแทนทบต้นด้วยวินัยในการรีบาลานซ์',
    date: '28 มิถุนายน 2026',
    author: 'วิภาดา รัตนรุ่งเรือง',
    readTime: '5 นาที',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800',
    content: `การสร้างพอร์ตหุ้นในยุคปัจจุบันมีความซับซ้อนมากกว่าเดิมเนื่องจากความเร็วของข้อมูลและเทคโนโลยีการเทรดอัตโนมัติ อย่างไรก็ตาม หลักการพื้นฐานของการเติบโตของเงินทุนอย่างยั่งยืนยังคงไม่เปลี่ยนแปลง

นี่คือ 5 เคล็ดลับสำคัญที่คุณควรนำไปปรับใช้ทันที:
- **ทำ Asset Allocation อย่างเหมาะสม**: อย่าทุ่มเงินทั้งหมดลงไปในอุตสาหกรรมเดียว
- **ใช้ระบบตรวจสอบคุณภาพแบบคัดกรองเข้มข้น**: มองหาบริษัทที่มีเกราะป้องกันแกร่ง (Economic Moat)
- **ปรับสมดุลพอร์ตอย่างมีวินัย (Rebalancing)**: การขายทำกำไรหุ้นที่ขึ้นแรงเพื่อมาซื้อหุ้นที่มูลค่าต่ำกว่าราคาประเมิน จะช่วยลดความเสี่ยงโดยธรรมชาติ
- **หลีกเลี่ยงการใช้อารมณ์ตามกระแสข่าวรายวัน**: ให้ความสำคัญกับปัจจัยพื้นฐานและการเติบโตที่แท้จริง
- **วางกลยุทธ์ภาษีเพื่อผลตอบแทนที่สุทธิสูงสุด**: การรู้จักใช้เครื่องมือลดหย่อนและการถือครองเพื่อการลงทุนระยะยาวจะช่วยรักษาพูนพอร์ตได้สูงสุด`
  },
  {
    id: 'retirement-power',
    title: 'เกษียณสำราญด้วยพลังของดอกเบี้ยทบต้น: เริ่มต้นตั้งแต่วันนี้',
    category: 'retirement',
    categoryTh: 'วางแผนเกษียณ',
    excerpt: 'ส่องพลังทวีของเวลา ยิ่งเริ่มเร็วยิ่งได้เปรียบ เจาะลึกสูตรคำนวณและขั้นตอนการสร้างแผนเกษียณที่ตอบโจทย์ไลฟ์สไตล์ที่คุณต้องการอย่างแท้จริง',
    date: '15 มิถุนายน 2026',
    author: 'สมชาย สกุลดี',
    readTime: '6 นาที',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800',
    content: `ไอน์สไตน์เคยกล่าวไว้ว่า "ดอกเบี้ยทบต้นคือสิ่งมหัศจรรย์อันดับ 8 ของโลก" และประโยคนี้พิสูจน์แล้วว่าเป็นความจริงสูงสุดในการวางแผนเกษียณอายุ

สมมติว่าคุณต้องการมีเงินเก็บ 10 ล้านบาท ณ วันเกษียณที่อายุ 60 ปี:
- หากเริ่มต้นออมและลงทุนที่อายุ 25 ปี (ระยะเวลา 35 ปี) ภายใต้ผลตอบแทนคาดหวัง 7% ต่อปี คุณจะต้องออมเงินเพียงเดือนละประมาณ 5,500 บาทเท่านั้น
- แต่หากคุณผัดผ่อนไปเริ่มต้นออมที่อายุ 45 ปี (ระยะเวลา 15 ปี) คุณจะต้องออมเงินสูงถึงเดือนละกว่า 31,000 บาทเพื่อไปให้ถึงเป้าหมายเดียวกัน!

นี่คือหลักฐานเชิงประจักษ์ว่า 'เวลา' คือตัวคูณพลังแห่งการลงทุนที่ทรงอนุภาพที่สุด`
  },
  {
    id: 'tax-update-2026',
    title: 'อัปเดตสิทธิลดหย่อนภาษี 2569 ที่คุณต้องรู้เพื่อความคุ้มค่าสูงสุด',
    category: 'tax',
    categoryTh: 'ภาษี',
    excerpt: 'ประหยัดเงินแสนได้ไม่ยากถ้าวางแผนล่วงหน้า สรุปเงื่อนไขและกองทุนลดหย่อนภาษีล่าสุด พร้อมสูตรจัดสัดส่วนแบบเป็นขั้นเป็นตอน',
    date: '10 มิถุนายน 2026',
    author: 'ณัฐพงษ์ ลิ้มสุวรรณ',
    readTime: '10 นาที',
    image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=800',
    content: `เมื่อเข้าใกล้ช่วงปลายปี เรื่องภาษีมักเป็นหัวข้อยอดนิยม อย่างไรก็ตาม การวางแผนภาษีที่มีประสิทธิภาพสูงสุดควรเริ่มต้นตั้งแต่ต้นปี เพื่อให้มีเวลาศึกษาข้อมูล และไม่เผชิญกับสภาวะตึงตัวทางการเงินในช่วงเดือนสุดท้าย

ในปี 2569 นี้ มีการอัปเดตหลักเกณฑ์สำคัญเกี่ยวกับเพดานและสัดส่วนการลงทุนในกองทุนประหยัดภาษี เช่น กองทุน ThaiESG, SSF และ RMF รวมถึงเบี้ยประกันสุขภาพและประกันบำนาญ การจัดพอร์ตให้เกิดประโยชน์สูงสุดคู่ขนานไปกับเป้าหมายการเงินส่วนบุคคลจึงเป็นสิ่งที่เราห้ามละเลยเด็ดขาด`
  }
];

export const VIDEO_ITEMS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'สัมมนาพิเศษ: พลิกวิกฤตเป็นโอกาสในการลงทุนต่างประเทศ 2026',
    duration: '45:12',
    views: '12.4K views',
    thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'vid-2',
    title: 'เจาะลึก: วางแผนบริหารภาษีมรดกและส่งต่อความมั่งคั่งอย่างถูกกฎหมาย',
    duration: '22:15',
    views: '8.2K views',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'vid-3',
    title: 'จัดพอร์ตเงินออมเพื่อการศึกษาบุตร: เคล็ดลับสะสมเงินร้อยสู่เงินล้าน',
    duration: '18:40',
    views: '4.5K views',
    thumbnail: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'vid-4',
    title: 'แนวโน้ม Crypto & Digital Assets ท่ามกลางกฎเกณฑ์กำกับดูแลใหม่',
    duration: '31:05',
    views: '15.1K views',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'vid-5',
    title: 'เตรียมเกษียณอย่างมั่นคง: วางแผนรายได้หลังหยุดทำงาน',
    titleTh: 'เตรียมเกษียณอย่างมั่นคง: วางแผนรายได้หลังหยุดทำงาน',
    titleEn: 'Retirement Income Planning: Building Confidence After Work',
    description: 'แนวทางวางโครงสร้างรายได้หลังเกษียณ การจัดสภาพคล่อง และการคุ้มครองความเสี่ยงของครอบครัว',
    descriptionTh: 'แนวทางวางโครงสร้างรายได้หลังเกษียณ การจัดสภาพคล่อง และการคุ้มครองความเสี่ยงของครอบครัว',
    descriptionEn: 'A practical framework for retirement income, liquidity, and family risk protection.',
    duration: '26:30',
    views: '6.8K views',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
];
