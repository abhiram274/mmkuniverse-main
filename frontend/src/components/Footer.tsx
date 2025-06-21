
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-mmk-dark border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">MMK Universe</h3>
            <p className="text-gray-400">
              Explore. Share. Grow. A Community for Knowledge & Collaboration.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-mmk-purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-mmk-purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-mmk-purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li><Link to="/home" className="text-gray-400 hover:text-mmk-purple">Home</Link></li>
              <li><Link to="/programs" className="text-gray-400 hover:text-mmk-purple">Programs</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-mmk-purple">About Us</Link></li>

              {/* <li><Link to="/community" className="text-gray-400 hover:text-mmk-purple">Community</Link></li>
              <li><Link to="/freelance" className="text-gray-400 hover:text-mmk-purple">Freelance</Link></li> */}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="" className="text-gray-400 hover:text-mmk-purple">Blog</Link></li>
              <li><Link to="" className="text-gray-400 hover:text-mmk-purple">Documentation</Link></li>
              <li><Link to="" className="text-gray-400 hover:text-mmk-purple">FAQ</Link></li>
              <li><Link to="" className="text-gray-400 hover:text-mmk-purple">Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-mmk-purple">Terms of Service</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-mmk-purple">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-mmk-purple">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MMK Universe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
