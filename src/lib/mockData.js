/**
 * Mock Data for Development
 * 
 * Provides realistic fake data so the entire app works
 * without Firebase credentials. Controlled by USE_MOCK_DATA env var.
 */

// --- Clinic working hours ---
export const CLINIC_HOURS = {
  monday:    { open: '09:00', close: '13:00', eveningOpen: '17:00', eveningClose: '21:00' },
  tuesday:   { open: '09:00', close: '13:00', eveningOpen: '17:00', eveningClose: '21:00' },
  wednesday: { open: '09:00', close: '13:00', eveningOpen: '17:00', eveningClose: '21:00' },
  thursday:  { open: '09:00', close: '13:00', eveningOpen: '17:00', eveningClose: '21:00' },
  friday:    { open: '09:00', close: '13:00', eveningOpen: '17:00', eveningClose: '21:00' },
  saturday:  { open: '09:00', close: '13:00', eveningOpen: null, eveningClose: null },
  sunday:    { open: null, close: null, eveningOpen: null, eveningClose: null }, // Closed
};

// --- Slot duration in minutes ---
export const SLOT_DURATION = 15;

// --- Services / Specialities ---
export const SERVICES = [
  {
    id: 'general-medicine',
    name: 'General Medicine',
    icon: '🩺',
    shortDesc: 'Comprehensive diagnosis and treatment for common illnesses and chronic conditions.',
    fullDesc: 'Our general medicine practice covers a wide spectrum of healthcare needs including fever, infections, digestive issues, allergies, and ongoing management of chronic conditions. Dr. Parth uses an evidence-based approach combined with patient-centered care.',
    features: ['Routine health check-ups', 'Fever & infection management', 'Chronic disease monitoring', 'Medication management', 'Health counselling'],
  },
  {
    id: 'diabetology',
    name: 'Diabetology',
    icon: '🔬',
    shortDesc: 'Specialized diabetes management with personalized treatment plans and monitoring.',
    fullDesc: 'Comprehensive diabetes care including Type 1, Type 2, and gestational diabetes. We provide individualized treatment plans, blood sugar monitoring guidance, dietary counseling, and insulin management. Our goal is to help patients achieve optimal glycemic control and prevent complications.',
    features: ['Blood sugar monitoring', 'Insulin therapy management', 'Dietary counselling', 'HbA1c tracking', 'Complication screening'],
  },
  {
    id: 'cardiology-screening',
    name: 'Cardiology Screening',
    icon: '❤️',
    shortDesc: 'Preventive heart health assessments and cardiovascular risk evaluation.',
    fullDesc: 'Early detection is key to heart health. Our cardiology screening services include blood pressure monitoring, cholesterol profiling, ECG interpretation, and cardiovascular risk assessment. We identify risk factors early and create preventive action plans.',
    features: ['Blood pressure management', 'Cholesterol profiling', 'ECG interpretation', 'Risk factor assessment', 'Lifestyle modification plans'],
  },
  {
    id: 'respiratory-care',
    name: 'Respiratory Care',
    icon: '🫁',
    shortDesc: 'Treatment for asthma, COPD, allergies, and respiratory infections.',
    fullDesc: 'Expert management of respiratory conditions including asthma, chronic obstructive pulmonary disease (COPD), bronchitis, and seasonal allergies. We provide breathing assessments, inhaler technique training, and long-term management strategies.',
    features: ['Asthma management', 'COPD treatment', 'Breathing assessments', 'Inhaler technique training', 'Allergy management'],
  },
  {
    id: 'preventive-health',
    name: 'Preventive Health Check-ups',
    icon: '🛡️',
    shortDesc: 'Comprehensive health screenings to detect issues before they become serious.',
    fullDesc: 'Prevention is better than cure. Our health check-up packages are designed for different age groups and risk profiles. We perform thorough physical examinations, blood work analysis, and provide personalized health reports with actionable recommendations.',
    features: ['Full body check-ups', 'Blood work analysis', 'Health risk profiling', 'Vaccination guidance', 'Personalized health reports'],
  },
  {
    id: 'geriatric-care',
    name: 'Geriatric Care',
    icon: '👴',
    shortDesc: 'Specialized healthcare for elderly patients with compassion and expertise.',
    fullDesc: 'Dedicated care for senior citizens addressing age-related conditions, medication management, fall prevention, cognitive health monitoring, and quality-of-life improvement. We understand the unique needs of elderly patients and provide compassionate, unhurried consultations.',
    features: ['Age-related condition management', 'Medication review & optimization', 'Fall risk assessment', 'Cognitive health monitoring', 'Nutritional guidance'],
  },
];

// --- Doctor info ---
export const DOCTOR_INFO = {
  name: 'Dr. Parth',
  title: 'MBBS, MD (Internal Medicine)',
  specialization: 'General Medicine & Diabetology',
  experience: '15+ Years',
  patients: '5000+',
  bio: `Dr. Parth is a highly experienced physician specializing in General Medicine and Diabetology. With over 15 years of clinical practice, he has earned the trust of thousands of patients across the region. His patient-first approach combines modern medical practices with personalized care, ensuring every patient receives the attention they deserve.

Dr. Parth completed his MBBS from Grant Medical College, Mumbai, and his MD in Internal Medicine from AIIMS, New Delhi. He has worked at several prestigious hospitals before establishing his own clinic to provide accessible, quality healthcare to the community.

He is passionate about preventive medicine and believes in empowering patients with knowledge to take charge of their health.`,
  philosophy: 'Every patient deserves to be heard, understood, and treated with the highest standard of care. Medicine is not just about treating diseases — it\'s about healing people.',
  qualifications: [
    'MBBS — Grant Medical College, Mumbai (2008)',
    'MD (Internal Medicine) — AIIMS, New Delhi (2012)',
    'Fellowship in Diabetology — IDF (2014)',
    'Certified in Preventive Cardiology (2016)',
  ],
  memberships: [
    'Indian Medical Association (IMA)',
    'Association of Physicians of India (API)',
    'Research Society for the Study of Diabetes in India (RSSDI)',
    'Indian Academy of Geriatrics (IAG)',
  ],
  timeline: [
    { year: '2008', title: 'MBBS Completed', desc: 'Graduated from Grant Medical College, Mumbai with distinction.' },
    { year: '2009', title: 'Junior Residency', desc: 'Joined KEM Hospital, Mumbai as Junior Resident in Internal Medicine.' },
    { year: '2012', title: 'MD Completed', desc: 'Earned MD in Internal Medicine from AIIMS, New Delhi.' },
    { year: '2013', title: 'Senior Resident', desc: 'Appointed Senior Resident at Safdarjung Hospital, New Delhi.' },
    { year: '2014', title: 'Diabetology Fellowship', desc: 'Completed advanced fellowship in Diabetology from IDF.' },
    { year: '2016', title: 'Consultant Physician', desc: 'Joined Max Super Speciality Hospital as Consultant.' },
    { year: '2019', title: 'Clinic Established', desc: 'Founded Dr. Parth\'s Medical Clinic to serve the community.' },
    { year: '2024', title: '5000+ Patients', desc: 'Crossed the milestone of serving over 5000 patients.' },
  ],
};

// --- Clinic info ---
export const CLINIC_INFO = {
  name: "Parth's Medical Clinic",
  tagline: 'Your Health, Our Priority',
  address: '123, MG Road, Sector 15, Gurugram, Haryana 122001',
  phone: '+91-9876543210',
  email: 'clinic@parthsclinic.com',
  whatsapp: '919876543210',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.2233913121413!2d77.0266!3d28.4595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI3JzM0LjIiTiA3N8KwMDEnMzUuOCJF!5e0!3m2!1sen!2sin!4v1234567890',
  googleMapsLink: 'https://maps.google.com/?q=28.4595,77.0266',
  workingHours: {
    weekdays: 'Mon - Fri: 9:00 AM - 1:00 PM, 5:00 PM - 9:00 PM',
    saturday: 'Saturday: 9:00 AM - 1:00 PM',
    sunday: 'Sunday: Closed',
  },
  trustMetrics: {
    patients: 5000,
    experience: 15,
    rating: 4.8,
    successRate: 98,
  },
};

// --- Testimonials (Phase 2 but useful for mock) ---
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Mehta',
    rating: 5,
    text: 'Dr. Parth is incredibly thorough and patient. He took the time to explain everything about my diabetes management plan. Highly recommend!',
    date: '2025-11-15',
  },
  {
    id: 2,
    name: 'Amit Kumar',
    rating: 5,
    text: 'The clinic is clean, well-organized, and the staff is very friendly. I\'ve been coming here for my annual check-ups for 3 years now.',
    date: '2025-10-22',
  },
  {
    id: 3,
    name: 'Sunita Devi',
    rating: 5,
    text: 'As a senior citizen, I really appreciate the care and attention Dr. Parth provides. He always makes sure I understand my medications.',
    date: '2025-12-01',
  },
];

/**
 * Generate available time slots for a given date.
 * Simulates Firestore data for development.
 * @param {string} dateStr - YYYY-MM-DD format
 * @returns {Array<{ start: string, end: string, available: boolean }>}
 */
export function generateMockSlots(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[date.getDay()];
  const hours = CLINIC_HOURS[dayName];

  if (!hours || (!hours.open && !hours.eveningOpen)) {
    return []; // Clinic closed
  }

  const slots = [];

  // Helper to generate slots for a time range
  function addSlots(openTime, closeTime) {
    if (!openTime || !closeTime) return;
    const [openH, openM] = openTime.split(':').map(Number);
    const [closeH, closeM] = closeTime.split(':').map(Number);
    let currentH = openH;
    let currentM = openM;

    while (currentH < closeH || (currentH === closeH && currentM < closeM)) {
      const endM = currentM + SLOT_DURATION;
      const endH = currentH + Math.floor(endM / 60);
      const endMinute = endM % 60;

      if (endH > closeH || (endH === closeH && endMinute > closeM)) break;

      const start = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;
      const end = `${String(endH).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

      // Randomly mark some slots as unavailable for realism.
      // Hash the whole date and start time so dates ending in a multiple of 5
      // do not accidentally make every 15-minute slot unavailable.
      const seedSource = `${dateStr}-${start}`;
      let seed = 0;
      for (let i = 0; i < seedSource.length; i++) {
        seed = (seed * 31 + seedSource.charCodeAt(i)) % 9973;
      }
      const available = seed % 5 !== 0; // ~20% unavailable

      slots.push({ start, end, available });

      currentM = endMinute;
      currentH = endH;
    }
  }

  addSlots(hours.open, hours.close);
  addSlots(hours.eveningOpen, hours.eveningClose);

  return slots;
}

// --- Mock appointments storage (in-memory for dev) ---
const mockAppointments = [];
const mockContacts = [];
const mockDataRequests = [];

export function getMockAppointments() {
  return [...mockAppointments];
}

export function addMockAppointment(appointment) {
  const newAppointment = {
    id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...appointment,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  mockAppointments.push(newAppointment);
  return newAppointment;
}

export function getMockContacts() {
  return [...mockContacts];
}

export function addMockContact(contact) {
  const newContact = {
    id: `mock-contact-${Date.now()}`,
    ...contact,
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  mockContacts.push(newContact);
  return newContact;
}

export function addMockDataRequest(request) {
  const newRequest = {
    id: `mock-dpdp-${Date.now()}`,
    ...request,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  mockDataRequests.push(newRequest);
  return newRequest;
}
