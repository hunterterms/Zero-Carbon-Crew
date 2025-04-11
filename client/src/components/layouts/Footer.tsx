import { FaMastodon } from 'react-icons/fa';
import { SiBluesky } from 'react-icons/si';

export default function Footer() {
  return (
    <footer className="bg-neutral-lightest py-4 border-t border-neutral-light">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-2 md:mb-0">
          <div className="flex items-center justify-center md:justify-start">
            <i className="fas fa-cannabis text-primary mr-1"></i>
            <span className="font-heading font-bold">EcoPoints</span>
          </div>
          <p className="text-sm text-neutral-dark">Gamifying your journey to carbon neutrality</p>
        </div>
        <div className="flex gap-4 items-center">
          <a href="#" className="text-neutral-dark hover:text-primary transition-colors" title="Mastodon">
            <FaMastodon size={20} />
          </a>
          <a href="#" className="text-neutral-dark hover:text-primary transition-colors" title="Bluesky">
            <SiBluesky size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
