import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ChevronUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

export function Footer() {
  const { state } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const translations = {
    en: {
      aboutUs: 'About AmarShop',
      aboutText: 'AmarShop is your trusted online fashion destination, offering premium quality clothing for men, women, and kids. We believe in making fashion accessible to everyone.',
      quickLinks: 'Quick Links',
      customerService: 'Customer Service',
      followUs: 'Follow Us',
      newsletter: 'Newsletter',
      newsletterText: 'Subscribe to get updates on new arrivals and exclusive offers',
      subscribe: 'Subscribe',
      emailPlaceholder: 'Enter your email',
      paymentMethods: 'Payment Methods',
      allRightsReserved: 'All rights reserved',
      privacyPolicy: 'Privacy Policy',
      termsConditions: 'Terms & Conditions',
      returnPolicy: 'Return Policy',
      shippingInfo: 'Shipping Info',
      contactUs: 'Contact Us',
      aboutUsLink: 'About Us',
      careers: 'Careers',
      blog: 'Blog',
      faq: 'FAQ',
      sizeGuide: 'Size Guide',
      trackOrder: 'Track Order',
      helpCenter: 'Help Center',
      backToTop: 'Back to Top'
    },
    bn: {
      aboutUs: 'আমারশপ সম্পর্কে',
      aboutText: 'আমারশপ আপনার বিশ্বস্ত অনলাইন ফ্যাশন গন্তব্য, পুরুষ, মহিলা এবং শিশুদের জন্য প্রিমিয়াম মানের পোশাক অফার করে। আমরা সবার জন্য ফ্যাশনকে সহজলভ্য করতে বিশ্বাস করি।',
      quickLinks: 'দ্রুত লিংক',
      customerService: 'গ্রাহক সেবা',
      followUs: 'আমাদের ফলো করুন',
      newsletter: 'নিউজলেটার',
      newsletterText: 'নতুন আগমন এবং এক্সক্লুসিভ অফারের আপডেট পেতে সাবস্ক্রাইব করুন',
      subscribe: 'সাবস্ক্রাইব',
      emailPlaceholder: 'আপনার ইমেইল প্রবেশ করান',
      paymentMethods: 'পেমেন্ট পদ্ধতি',
      allRightsReserved: 'সমস্ত অধিকার সংরক্ষিত',
      privacyPolicy: 'গোপনীয়তা নীতি',
      termsConditions: 'শর্তাবলী',
      returnPolicy: 'রিটার্ন নীতি',
      shippingInfo: 'শিপিং তথ্য',
      contactUs: 'যোগাযোগ করুন',
      aboutUsLink: 'আমাদের সম্পর্কে',
      careers: 'ক্যারিয়ার',
      blog: 'ব্লগ',
      faq: 'সচরাচর জিজ্ঞাসা',
      sizeGuide: 'সাইজ গাইড',
      trackOrder: 'অর্ডার ট্র্যাক করুন',
      helpCenter: 'সহায়তা কেন্দ্র',
      backToTop: 'উপরে ফিরে যান'
    }
  };

  const t = translations[state.language];

  const quickLinks = [
    { name: t.aboutUsLink, href: '/about' },
    { name: t.careers, href: '/careers' },
    { name: t.blog, href: '/blog' },
    { name: t.privacyPolicy, href: '/privacy' },
    { name: t.termsConditions, href: '/terms' }
  ];

  const customerServiceLinks = [
    { name: t.contactUs, href: '/contact' },
    { name: t.faq, href: '/faq' },
    { name: t.sizeGuide, href: '/size-guide' },
    { name: t.trackOrder, href: '/track-order' },
    { name: t.helpCenter, href: '/help' },
    { name: t.returnPolicy, href: '/returns' },
    { name: t.shippingInfo, href: '/shipping' }
  ];

  return (
    <footer className="bg-muted/50 border-t">
      {/* Back to Top Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Button
          variant="outline"
          onClick={scrollToTop}
          className="w-full flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground"
        >
          <ChevronUp className="h-4 w-4" />
          {t.backToTop}
        </Button>
      </div>

      <Separator />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg">
                <span className="font-bold text-lg">AmarShop</span>
              </div>
            </div>
            <h3 className="font-semibold">{t.aboutUs}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.aboutText}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>123 Fashion Street, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>info@amarshop.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t.quickLinks}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t.customerService}</h3>
            <ul className="space-y-2">
              {customerServiceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t.newsletter}</h3>
            <p className="text-sm text-muted-foreground">
              {t.newsletterText}
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={t.emailPlaceholder}
                className="text-sm"
              />
              <Button size="sm">{t.subscribe}</Button>
            </div>
            
            <div className="pt-4">
              <h4 className="font-medium mb-3">{t.followUs}</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="p-2">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Payment Methods & Copyright */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-sm font-medium">{t.paymentMethods}:</span>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium">bKash</div>
              <div className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium">Nagad</div>
              <div className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium">Rocket</div>
              <div className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium">COD</div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2025 AmarShop. {t.allRightsReserved}.
          </div>
        </div>
      </div>
    </footer>
  );
}
