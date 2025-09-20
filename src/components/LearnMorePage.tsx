import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MessageCircle, Truck, RefreshCw, Ruler, Package, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearnMorePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('about-us');

  const sections = [
    { id: 'about-us', title: 'About Us', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'contact', title: 'Contact', icon: <Phone className="w-5 h-5" /> },
    { id: 'faq', title: 'FAQ', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'shipping-info', title: 'Shipping Info', icon: <Truck className="w-5 h-5" /> },
    { id: 'customer-service', title: 'Customer Service', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'return-policy', title: 'Return Policy', icon: <RefreshCw className="w-5 h-5" /> },
    { id: 'size-guide', title: 'Size Guide', icon: <Ruler className="w-5 h-5" /> },
    { id: 'track-order', title: 'Track Order', icon: <Package className="w-5 h-5" /> },
    { id: 'support', title: 'Support', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  useEffect(() => {
    // Check if there's a hash in the URL to set the active section
    const hash = window.location.hash.substring(1);
    if (hash && sections.some(section => section.id === hash)) {
      setActiveSection(hash);
    }
  }, []);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    window.history.replaceState(null, '', `#${sectionId}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'about-us':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">About Us</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                BijouShop is your premier destination for exquisite jewelry and timeless elegance. 
                We are dedicated to providing high-quality pieces that combine beauty, craftsmanship, 
                and affordability to help you shine every day.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-jungle-500 to-earth-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Craftsmanship</h3>
                  <p className="text-gray-600">Every piece is carefully crafted using premium materials and traditional techniques.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-jungle-500 to-earth-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Unique Designs</h3>
                  <p className="text-gray-600">Discover one-of-a-kind pieces that reflect your personal style and personality.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-jungle-500 to-earth-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                  <p className="text-gray-600">Quick and secure delivery to your doorstep with tracking and insurance.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Contact</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Have a question? Reach out to us anytime via email at{' '}
                <a href="mailto:support@bijoushop.com" className="text-jungle-600 hover:text-jungle-700 font-medium">
                  support@bijoushop.com
                </a>{' '}
                or call us at{' '}
                <a href="tel:+254700123456" className="text-jungle-600 hover:text-jungle-700 font-medium">
                  +254 700 123 456
                </a>.
              </p>
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-6 h-6 text-jungle-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Support</p>
                      <p className="text-gray-600">support@bijoushop.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-6 h-6 text-jungle-600" />
                    <div>
                      <p className="font-medium text-gray-900">Phone Support</p>
                      <p className="text-gray-600">+254 700 123 456</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">FAQ</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed mb-8">
                Find answers to the most common questions about our products, 
                shipping policies, returns, and jewelry care tips in our FAQ section.
              </p>
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What materials do you use?</h3>
                  <p className="text-gray-600">We use high-quality materials including sterling silver, gold-plated metals, and genuine gemstones.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I care for my jewelry?</h3>
                  <p className="text-gray-600">Store jewelry in a cool, dry place and clean with a soft cloth. Avoid contact with perfumes and lotions.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer custom designs?</h3>
                  <p className="text-gray-600">Yes! We offer custom jewelry design services. Contact us to discuss your vision.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'shipping-info':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Shipping Info</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                We ship worldwide with reliable carriers. Orders are processed within 1–2 business days. 
                Standard shipping takes 5–7 days, while express options are also available at checkout.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <Truck className="w-8 h-8 text-jungle-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Shipping</h3>
                  <p className="text-gray-600">5-7 business days</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <Truck className="w-8 h-8 text-jungle-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Express Shipping</h3>
                  <p className="text-gray-600">2-3 business days</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <Truck className="w-8 h-8 text-jungle-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Same Day Delivery</h3>
                  <p className="text-gray-600">Available in Nairobi</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'customer-service':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Customer Service</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Our customer service team is here to assist you with orders, payments, returns, and general inquiries. 
                We strive to ensure your shopping experience is smooth and enjoyable.
              </p>
              <div className="mt-8 bg-jungle-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Help</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Order Support</h4>
                    <p className="text-gray-600">Help with placing orders, modifications, and tracking</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Assistance</h4>
                    <p className="text-gray-600">Support with M-Pesa, card payments, and billing</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Product Information</h4>
                    <p className="text-gray-600">Detailed information about our jewelry pieces</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Returns & Exchanges</h4>
                    <p className="text-gray-600">Guidance on returns, exchanges, and refunds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'return-policy':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Return Policy</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                If you are not satisfied with your purchase, you may return unworn items within 14 days 
                for a full refund or exchange. Items must be in their original packaging.
              </p>
              <div className="mt-8 space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Conditions</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Items must be unworn and in original condition</li>
                    <li>• Original packaging and tags must be included</li>
                    <li>• Returns must be initiated within 14 days of delivery</li>
                    <li>• Custom or personalized items cannot be returned</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Return</h3>
                  <ol className="space-y-2 text-gray-600">
                    <li>1. Contact our customer service team</li>
                    <li>2. Receive return authorization and instructions</li>
                    <li>3. Package items securely with original packaging</li>
                    <li>4. Send via tracked shipping</li>
                    <li>5. Receive refund within 5-7 business days</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        );

      case 'size-guide':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Size Guide</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Unsure about your ring or bracelet size? Refer to our detailed size guide to ensure the perfect fit 
                before making your purchase.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ring Sizes</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">US Size 5</span>
                      <span className="text-gray-600">15.7mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">US Size 6</span>
                      <span className="text-gray-600">16.5mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">US Size 7</span>
                      <span className="text-gray-600">17.3mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">US Size 8</span>
                      <span className="text-gray-600">18.1mm</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bracelet Sizes</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Small (6.5")</span>
                      <span className="text-gray-600">16.5cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Medium (7")</span>
                      <span className="text-gray-600">17.8cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Large (7.5")</span>
                      <span className="text-gray-600">19.1cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">X-Large (8")</span>
                      <span className="text-gray-600">20.3cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'track-order':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Track Order</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Enter your order number on our{' '}
                <Link to="/track" className="text-jungle-600 hover:text-jungle-700 font-medium">
                  tracking page
                </Link>{' '}
                to see real-time updates on your shipment's status.
              </p>
              <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Your Order</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
                    <input
                      type="text"
                      placeholder="Enter your order number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jungle-500 focus:border-transparent"
                    />
                  </div>
                  <button className="w-full bg-jungle-600 text-white py-3 rounded-lg font-semibold hover:bg-jungle-700 transition-colors">
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Support</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Need help? Our support team is available via live chat, email, or phone to guide you through 
                every step of your jewelry journey.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-jungle-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                  <p className="text-gray-600 mb-4">Available 24/7 for instant support</p>
                  <button className="bg-jungle-600 text-white px-4 py-2 rounded-lg hover:bg-jungle-700 transition-colors">
                    Start Chat
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <Mail className="w-8 h-8 text-jungle-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-600 mb-4">Get detailed help via email</p>
                  <a href="mailto:support@bijoushop.com" className="bg-jungle-600 text-white px-4 py-2 rounded-lg hover:bg-jungle-700 transition-colors inline-block">
                    Send Email
                  </a>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <Phone className="w-8 h-8 text-jungle-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
                  <p className="text-gray-600 mb-4">Call us for immediate assistance</p>
                  <a href="tel:+254700123456" className="bg-jungle-600 text-white px-4 py-2 rounded-lg hover:bg-jungle-700 transition-colors inline-block">
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-jungle-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Shop</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Learn More</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-8">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Quick Links</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-jungle-600 to-earth-700 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-jungle-50 hover:text-jungle-600'
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMorePage;
