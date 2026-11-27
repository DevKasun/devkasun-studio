type SocialLink = { label: string; href: string }
type Centerpiece = 'sculpture' | 'portrait'

export const site = {
  name: 'DevKasun Studio',
  brand: 'DevKasun',
  studio: 'Studio',
  owner: 'Kasun Lakshitha',
  email: 'hello@devkasun.com',
  url: 'https://devkasun.com',
  home: '/',
  privacyPath: '/privacy',
  termsPath: '/terms',
  social: [] as SocialLink[], // Add verified LinkedIn, WhatsApp or other profile URLs here.
  seo: {
    title: 'DevKasun Studio — Digital Solutions for Modern Businesses',
    description:
      'Independent digital studio in Sri Lanka. Work directly with Kasun Lakshitha on websites, social media, personal branding and custom business software.',
    image: '/images/studio-og.png',
  },
  nav: [
    { id: 'services', label: 'Services' },
    { id: 'process', label: 'Process' },
    { id: 'why', label: 'Why Me' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ],
  ui: {
    project: 'Start a project',
    explore: 'See what I do',
    scroll: 'Scroll',
    skip: 'Skip to content',
    navigation: 'Main navigation',
    theme: {
      label: (current: string, next: string) =>
        `Color theme is ${current}. Switch to ${next}.`,
      system: 'System',
      dark: 'Dark',
      light: 'Light',
    },
    open: 'Open menu',
    close: 'Close menu',
    home: 'Back to the studio',
    learn: 'Learn more',
    less: 'Show less',
    privacy: 'Privacy',
    terms: 'Terms',
    top: 'Back to top',
  },
  hero: {
    eyebrow: 'Independent digital studio',
    title: ['Digital solutions', 'for modern', 'businesses.'],
    intro:
      'I help businesses build their online presence and run operations more efficiently, through websites, social media, personal branding and custom software.',
    notes: ['Growing online.', 'Running smarter.'],
    location: 'Based in Sri Lanka',
    reach: 'Working worldwide',
  },
  scene: {
    centerpiece: 'sculpture' as Centerpiece,
    portrait: '/images/kasun-cutout.png',
    poster: '/images/pearl.webp',
    mobilePoster: '/images/pearl-mobile.webp',
    words: [
      'Ideas',
      'Focus',
      'Growth',
      'Hustle',
      'Brand',
      'Craft',
      'Build',
      'Launch',
    ],
    ribbon: 'Strategy · Design · Build · Grow',
  },
  services: {
    label: 'Services',
    title: 'What I do',
    intro: 'Four ways to grow online and simplify the way you work.',
    items: [
      {
        name: 'Web Development',
        description: 'Websites and web applications',
        outcomes: [
          'Fast, responsive pages on every screen.',
          'A clear path from search to enquiry.',
          'React and TypeScript foundations that grow with you.',
        ],
        detail:
          'From a focused landing page to a web application, we map the journeys your visitors need to take and build around them.',
      },
      {
        name: 'Social Media',
        description: 'Content, strategy and management',
        outcomes: [
          'A publishing rhythm you can sustain.',
          'Content shaped around your audience.',
          'A consistent voice across your channels.',
        ],
        detail:
          'We choose the channels that suit your customers, plan a practical content calendar and review what people respond to.',
      },
      {
        name: 'Personal Branding',
        description: 'Brand identity and online presence',
        outcomes: [
          'A clear introduction to what you do.',
          'A visual identity that feels like you.',
          'Profiles that tell a consistent story.',
        ],
        detail:
          'We bring your experience, voice and visual identity together so the right people understand what you offer.',
      },
      {
        name: 'Business Systems',
        description: 'POS, dashboards and custom tools',
        outcomes: [
          'Less time spent on repetitive admin.',
          'A clearer view of daily operations.',
          'Tools tailored to the way your team works.',
        ],
        detail:
          'We follow one real workflow from start to finish, then build the smallest useful tool to make that work easier.',
      },
    ],
  },
  process: {
    label: 'Process',
    title: 'How we’ll work',
    intro:
      'Expect clear communication and a fixed-scope quote before the build begins.',
    steps: [
      [
        'Discover',
        'We talk through your business, the people you serve and what a good outcome looks like.',
      ],
      [
        'Design',
        'You see the direction early, with room to shape the details before development.',
      ],
      [
        'Build',
        'I bring the design to life and share working previews so you can follow progress.',
      ],
      [
        'Launch & Grow',
        'We test, launch and walk through the handover, with a plan for what comes next.',
      ],
    ],
  },
  why: {
    label: 'Why DevKasun Studio',
    title: 'A direct line to the person building it.',
    values: [
      [
        'Senior experience',
        'Work directly with a frontend engineer with more than seven years of experience.',
      ],
      [
        'Design and engineering together',
        'The same person carries the original idea through to the finished experience.',
      ],
      [
        'Speed and search visibility',
        'Performance, accessible markup and clear page structure are part of the build.',
      ],
      [
        'Clear pricing and honest timelines',
        'Scope, milestones and costs are agreed together before work starts.',
      ],
    ],
  },
  about: {
    label: 'About the studio',
    title: 'Hi, I’m Kasun.',
    role: 'Senior frontend engineer · Sri Lanka',
    intro:
      'I’m Kasun Lakshitha, the person behind DevKasun Studio. I’ve spent 7+ years building interfaces with React and TypeScript, including my time at Rhino Partners.',
    body: 'Today I work independently with businesses, professionals and creators. I like turning complicated problems into simple tools that feel good to use.',
    stack: ['React', 'TypeScript', 'TanStack', 'Node', 'Tailwind', 'three.js'],
  },
  contact: {
    label: 'Contact',
    title: 'Let’s build something that grows with you.',
    intro:
      'Tell me a little about your business and what you’d like to change. I’ll get back to you personally.',
    response: 'I aim to reply within two working days.',
    name: 'Name',
    email: 'Email',
    needs: 'What do you need?',
    budget: 'Budget range',
    optional: 'Optional',
    budgets: [
      'Still exploring',
      'Under $1,000',
      '$1,000–$3,000',
      '$3,000–$10,000',
      '$10,000+',
    ],
    message: 'Message',
    send: 'Send enquiry',
    sending: 'Sending…',
    success: 'Thanks for reaching out. Your enquiry is on its way to Kasun.',
    failure:
      'Your enquiry couldn’t be sent. Please try again or email me directly.',
    limited: 'Please wait a while before sending another enquiry.',
    copy: 'Copy email address',
    copied: 'Email address copied.',
    copyError: 'Select the address to copy it manually.',
    nameError: 'Enter your name (up to 100 characters).',
    emailError: 'Enter a valid email address.',
    messageError: 'Write a message between 10 and 5,000 characters.',
    needsError: 'Choose a service from the list.',
    budgetError: 'Choose a listed budget range.',
    website: 'Website',
    newMessage: 'Send another enquiry',
  },
  footer: { credit: '' },
  legal: {
    privacy: {
      title: 'Privacy',
      paragraphs: [
        'When you send an enquiry, the studio uses your name, email address and project details to reply and discuss the work.',
        'The form sends your message through Resend to the studio inbox. A short-lived request counter helps limit automated submissions. The website does not set advertising cookies.',
        'Email the studio to ask about a previous enquiry or request removal of your message.',
      ],
    },
    terms: {
      title: 'Terms of use',
      paragraphs: [
        'This website introduces the services of DevKasun Studio. A project starts once we agree its scope, price and schedule in writing.',
        'Sending an enquiry starts a conversation. Estimates, deliverables and support arrangements are confirmed individually for each project.',
      ],
    },
  },
  missing: {
    title: 'Page not found.',
    body: 'The page you’re looking for may have moved. You can find the studio back on the homepage.',
  },
} as const

export const mailto = `mailto:${site.email}`
export const sectionLink = (id: string) => `${site.home}#${id}`
