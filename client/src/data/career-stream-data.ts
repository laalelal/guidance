type CompetitiveExam = {
  name: string;
  fullName: string;
  description: string;
};

type College = {
  name: string;
  cutoff: string;
  location: string;
};

type CareerPath = {
  title: string;
  description: string;
};

export type StreamData = {
  name: 'Science' | 'Commerce' | 'Arts';
  description: string;
  exams: CompetitiveExam[];
  colleges: College[];
  careers: CareerPath[];
};

export const streamData: Record<'Science' | 'Commerce' | 'Arts', StreamData> = {
  Science: {
    name: 'Science',
    description: 'The Science stream emphasizes subjects like Physics, Chemistry, Biology, and Mathematics, providing a strong foundation for careers in engineering, medicine, research, and technology. This stream is ideal for students with strong analytical skills and an interest in understanding how things work.',
    exams: [
      {
        name: 'JEE',
        fullName: 'Joint Entrance Examination',
        description: 'National level engineering entrance exam for admission to premier technical institutions like IITs and NITs.'
      },
      {
        name: 'NEET',
        fullName: 'National Eligibility cum Entrance Test',
        description: 'Medical entrance examination for admission to MBBS, BDS, AYUSH and other medical courses in India.'
      },
      {
        name: 'BITSAT',
        fullName: 'BITS Admission Test',
        description: 'Entrance exam for admission to various engineering programs at BITS Pilani campuses.'
      },
      {
        name: 'KVPY',
        fullName: 'Kishore Vaigyanik Protsahan Yojana',
        description: 'Fellowship program to encourage students to pursue research careers in basic sciences.'
      },
      {
        name: 'NTSE',
        fullName: 'National Talent Search Examination',
        description: 'Scholarship program to identify and nurture talented students across the country.'
      }
    ],
    colleges: [
      {
        name: 'Indian Institutes of Technology (IITs)',
        cutoff: '95-99 percentile in JEE Advanced',
        location: 'Multiple locations across India'
      },
      {
        name: 'National Institutes of Technology (NITs)',
        cutoff: '97-99 percentile in JEE Main',
        location: 'Multiple locations across India'
      },
      {
        name: 'All India Institute of Medical Sciences (AIIMS)',
        cutoff: '650+ marks in NEET',
        location: 'New Delhi and other cities'
      },
      {
        name: 'Birla Institute of Technology and Science (BITS)',
        cutoff: '320+ marks in BITSAT',
        location: 'Pilani, Goa, Hyderabad'
      },
      {
        name: 'Indian Institute of Science (IISc)',
        cutoff: '98+ percentile in JEE Advanced',
        location: 'Bangalore'
      }
    ],
    careers: [
      {
        title: 'Engineer',
        description: 'Design, develop and maintain systems, structures, machines and processes across various industries.'
      },
      {
        title: 'Doctor/Medical Professional',
        description: 'Diagnose and treat medical conditions, and contribute to healthcare and well-being.'
      },
      {
        title: 'Research Scientist',
        description: 'Conduct research to advance knowledge in fields like physics, chemistry, biology and related disciplines.'
      },
      {
        title: 'Data Scientist',
        description: 'Analyze complex data sets to identify patterns and insights that help organizations make better decisions.'
      },
      {
        title: 'Architect',
        description: 'Design buildings and structures, combining artistic, functional and technical knowledge.'
      }
    ]
  },
  Commerce: {
    name: 'Commerce',
    description: 'The Commerce stream focuses on business, economics, accounting, and finance. It provides a foundation for careers in business management, finance, accounting, banking, and entrepreneurship. This stream is suited for students interested in the dynamics of business operations and financial systems.',
    exams: [
      {
        name: 'CAT',
        fullName: 'Common Admission Test',
        description: 'Entrance exam for admission to postgraduate management programs at IIMs and other top business schools.'
      },
      {
        name: 'CA Foundation',
        fullName: 'Chartered Accountancy Foundation',
        description: 'First level exam for the Chartered Accountancy (CA) professional course.'
      },
      {
        name: 'CS Foundation',
        fullName: 'Company Secretary Foundation',
        description: 'Entry-level exam for the Company Secretary (CS) professional course.'
      },
      {
        name: 'CMA Foundation',
        fullName: 'Cost Management Accountant Foundation',
        description: 'First level exam for the Cost and Management Accountancy (CMA) course.'
      },
      {
        name: 'BBA/BBM Entrance',
        fullName: 'Bachelor of Business Administration/Management Entrance',
        description: 'Entrance exams conducted by various universities for admission to undergraduate business programs.'
      }
    ],
    colleges: [
      {
        name: 'Indian Institutes of Management (IIMs)',
        cutoff: '95+ percentile in CAT',
        location: 'Multiple locations across India'
      },
      {
        name: 'Shri Ram College of Commerce (SRCC)',
        cutoff: '98%+ in 12th (Commerce)',
        location: 'Delhi'
      },
      {
        name: 'St. Xavier\'s College',
        cutoff: '95%+ in 12th (Commerce)',
        location: 'Mumbai, Kolkata'
      },
      {
        name: 'Narsee Monjee Institute of Management Studies (NMIMS)',
        cutoff: '90%+ or high NPAT score',
        location: 'Mumbai and other cities'
      },
      {
        name: 'Christ University',
        cutoff: '85%+ or good entrance exam score',
        location: 'Bangalore'
      }
    ],
    careers: [
      {
        title: 'Chartered Accountant',
        description: 'Provide financial advice, audit accounts, and prepare financial reports for individuals and businesses.'
      },
      {
        title: 'Investment Banker',
        description: 'Help companies and governments raise capital, and provide advice on mergers, acquisitions, and other financial matters.'
      },
      {
        title: 'Business Analyst',
        description: 'Analyze business processes and systems to improve efficiency and solve organizational problems.'
      },
      {
        title: 'Financial Advisor',
        description: 'Help individuals and businesses make informed financial decisions about investments, savings, and retirement planning.'
      },
      {
        title: 'Entrepreneur',
        description: 'Start and run businesses, identify market opportunities, and develop products or services to meet market demands.'
      }
    ]
  },
  Arts: {
    name: 'Arts',
    description: 'The Arts or Humanities stream covers subjects like Literature, History, Political Science, Psychology, Sociology, and Geography. It nurtures critical thinking, communication, and creativity, preparing students for careers in law, journalism, social service, education, and creative fields. This stream is ideal for those interested in understanding human behavior, society, and culture.',
    exams: [
      {
        name: 'CLAT',
        fullName: 'Common Law Admission Test',
        description: 'Entrance exam for admission to undergraduate and postgraduate law programs at National Law Universities.'
      },
      {
        name: 'NID DAT',
        fullName: 'National Institute of Design Design Aptitude Test',
        description: 'Entrance exam for admission to design programs at National Institute of Design.'
      },
      {
        name: 'NIFT',
        fullName: 'National Institute of Fashion Technology Entrance',
        description: 'Entrance exam for admission to fashion design and related programs at NIFT campuses.'
      },
      {
        name: 'UPSC CSE',
        fullName: 'Union Public Service Commission Civil Services Examination',
        description: 'Recruitment exam for various civil services positions like IAS, IPS, IFS etc.'
      },
      {
        name: 'NET/JRF',
        fullName: 'National Eligibility Test/Junior Research Fellowship',
        description: 'Exam for determining eligibility for assistant professor positions and junior research fellowships.'
      }
    ],
    colleges: [
      {
        name: 'St. Stephen\'s College',
        cutoff: '97%+ in 12th (Arts)',
        location: 'Delhi'
      },
      {
        name: 'Lady Shri Ram College for Women',
        cutoff: '96%+ in 12th (Arts)',
        location: 'Delhi'
      },
      {
        name: 'Loyola College',
        cutoff: '90%+ in 12th (Arts)',
        location: 'Chennai'
      },
      {
        name: 'Presidency College',
        cutoff: '90%+ in 12th (Arts)',
        location: 'Kolkata'
      },
      {
        name: 'FLAME University',
        cutoff: '85%+ or good entrance score',
        location: 'Pune'
      }
    ],
    careers: [
      {
        title: 'Lawyer/Legal Professional',
        description: 'Provide legal advice and representation to individuals, businesses, and organizations.'
      },
      {
        title: 'Journalist/Media Professional',
        description: 'Gather, report, and analyze news and information across various media platforms.'
      },
      {
        title: 'Psychologist/Counselor',
        description: 'Help individuals deal with mental health issues, emotional problems, and life challenges.'
      },
      {
        title: 'Civil Services Officer',
        description: 'Work in government administration and public policy implementation at various levels.'
      },
      {
        title: 'Teacher/Professor',
        description: 'Educate and mentor students at various academic levels, from primary to higher education.'
      }
    ]
  }
};