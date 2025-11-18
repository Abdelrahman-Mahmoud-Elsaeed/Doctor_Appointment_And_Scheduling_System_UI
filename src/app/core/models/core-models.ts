// Type definitions for static UI data structures

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  gender: 'Male' | 'Female';
  location: string;
  experience: number;
  about: string;
  availability: string[];
}

export interface Appointment {
  id: string;
  doctor: {
    name: string;
    specialization: string;
    image: string;
  };
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  image: string;
}

export interface DashboardStats {
  label: string;
  value: number;
  icon: string;
}
