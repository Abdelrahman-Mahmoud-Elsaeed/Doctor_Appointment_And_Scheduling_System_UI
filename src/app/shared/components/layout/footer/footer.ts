import { CommonModule } from '@angular/common';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, LucideAngularModule } from 'lucide-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule , LucideAngularModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  footerLinks = {
    services: [
      'Find Doctors',
      'Book Appointment',
      'Specializations',
      'Health Blog'
    ],
    company: [
      'About Us',
      'Contact',
      'Careers',
      'Press'
    ],
    support: [
      'Help Center',
      'Terms of Service',
      'Privacy Policy',
      'FAQ'
    ]
  };
  readonly Mail = Mail  
  readonly Phone = Phone  
  readonly MapPin = MapPin  
  readonly Facebook = Facebook  
  readonly Twitter = Twitter  
  readonly Instagram = Instagram  
  readonly Linkedin = Linkedin  
}
