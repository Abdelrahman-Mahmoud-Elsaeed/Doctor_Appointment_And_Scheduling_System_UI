import { Doctor, Appointment, Patient, DashboardStats } from '../src/app/core/models/core-models';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    rating: 4.8,
    reviewCount: 124,
    price: 150,
    gender: 'Female',
    location: 'New York, NY',
    experience: 12,
    about: 'Board-certified cardiologist with over 12 years of experience in cardiovascular medicine. Specialized in preventive cardiology and heart disease management.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday']
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Dermatologist',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    rating: 4.9,
    reviewCount: 186,
    price: 120,
    gender: 'Male',
    location: 'Los Angeles, CA',
    experience: 8,
    about: 'Expert dermatologist specializing in cosmetic and medical dermatology. Dedicated to providing personalized skin care solutions.',
    availability: ['Monday', 'Wednesday', 'Thursday', 'Saturday']
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrician',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    rating: 4.7,
    reviewCount: 98,
    price: 100,
    gender: 'Female',
    location: 'Chicago, IL',
    experience: 10,
    about: 'Compassionate pediatrician committed to providing comprehensive care for children from infancy through adolescence.',
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialization: 'Orthopedic',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    rating: 4.6,
    reviewCount: 142,
    price: 180,
    gender: 'Male',
    location: 'Houston, TX',
    experience: 15,
    about: 'Experienced orthopedic surgeon specializing in sports medicine and joint replacement surgery.',
    availability: ['Monday', 'Tuesday', 'Friday']
  },
  {
    id: '5',
    name: 'Dr. Lisa Anderson',
    specialization: 'Neurologist',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400',
    rating: 4.9,
    reviewCount: 203,
    price: 200,
    gender: 'Female',
    location: 'Boston, MA',
    experience: 18,
    about: 'Leading neurologist with expertise in treating complex neurological disorders and headache management.',
    availability: ['Monday', 'Wednesday', 'Friday']
  },
  {
    id: '6',
    name: 'Dr. Robert Taylor',
    specialization: 'General Physician',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    rating: 4.5,
    reviewCount: 76,
    price: 80,
    gender: 'Male',
    location: 'Seattle, WA',
    experience: 6,
    about: 'General physician focused on preventive care and managing chronic conditions with a patient-centered approach.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'
    },
    date: '2025-11-15',
    time: '10:00 AM',
    status: 'confirmed',
    notes: 'Regular checkup'
  },
  {
    id: '2',
    doctor: {
      name: 'Dr. Michael Chen',
      specialization: 'Dermatologist',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'
    },
    date: '2025-11-20',
    time: '2:30 PM',
    status: 'pending',
    notes: 'Skin consultation'
  },
  {
    id: '3',
    doctor: {
      name: 'Dr. Emily Rodriguez',
      specialization: 'Pediatrician',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400'
    },
    date: '2025-11-05',
    time: '11:00 AM',
    status: 'completed'
  }
];

export const mockPatient: Patient = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+1 (555) 123-4567',
  gender: 'Male',
  age: 35,
  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
};

export const mockDashboardStats: DashboardStats[] = [
  { label: 'Total Appointments', value: 48, icon: 'calendar' },
  { label: 'Today\'s Appointments', value: 5, icon: 'clock' },
  { label: 'Total Patients', value: 156, icon: 'users' },
  { label: 'This Month', value: 24, icon: 'trending-up' }
];

export const specializations = [
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Orthopedic',
  'Neurologist',
  'General Physician',
  'Dentist',
  'Ophthalmologist'
];

export const testimonials = [
  {
    id: '1',
    name: 'Amanda Stevens',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    rating: 5,
    text: 'Excellent platform! I found the perfect doctor for my needs and the booking process was seamless.'
  },
  {
    id: '2',
    name: 'David Miller',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    rating: 5,
    text: 'The doctors here are highly professional. I received great care and attention during my consultation.'
  },
  {
    id: '3',
    name: 'Rachel Green',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    rating: 5,
    text: 'Very user-friendly system. I can easily manage all my appointments in one place.'
  }
];

