import { Link } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/#como-funciona', label: 'Como Funciona' },
    { to: '/#impacto', label: 'Impacto' },
    { to: '/#depoimentos', label: 'Depoimentos' },
    { to: '/#faq', label: 'FAQ' },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Leaf className="h-6 w-6" />
          </div>
          <span className="font-display text-xl font-bold text-gray-900">
            Alimenta<span className="text-primary-600">+</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-600"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
            Entrar
          </Link>
          <Link to="/cadastro" className="btn-primary py-2 text-sm">
            Começar Agora
          </Link>
        </div>

        <button
          className="rounded-lg p-2 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-white md:hidden"
          >
            <div className="flex flex-col gap-2 p-4">
              {links.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link to="/login" className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50">
                Entrar
              </Link>
              <Link to="/cadastro" className="btn-primary text-center">
                Começar Agora
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
