import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Clinic HMS</span>
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              Modern healthcare management solution
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Menu</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/" className="text-sm text-gray-500 hover:text-blue-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-gray-500 hover:text-blue-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-gray-500 hover:text-blue-600">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm text-gray-500 hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-gray-500 hover:text-blue-600">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li className="text-sm text-gray-500">
                  123 Healthcare St, Medical City
                </li>
                <li className="text-sm text-gray-500">
                  info@clinichms.com
                </li>
                <li className="text-sm text-gray-500">
                  +1 (123) 456-7890
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 text-center">
            &copy; {currentYear} Clinic HMS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 