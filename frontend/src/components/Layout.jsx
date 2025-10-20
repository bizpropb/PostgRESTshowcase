import { Link, useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/books', label: 'Books', icon: '📚' },
    { path: '/authors', label: 'Authors', icon: '✍️' },
    { path: '/genres', label: 'Genres', icon: '🏷️' },
    { path: '/advanced', label: 'Advanced', icon: '⚡' },
    { path: '/api-docs', label: 'API Docs', icon: '📖' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-bg-secondary border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🗄️</div>
              <div>
                <h1 className="text-2xl font-bold text-dark-text">Book Haven</h1>
                <p className="text-sm text-dark-text-secondary">PostgREST Showcase</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="http://localhost:3000/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-accent hover:text-dark-accent-hover transition-colors"
              >
                OpenAPI Spec →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-dark-bg-secondary border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                  ${
                    isActive(item.path)
                      ? 'text-dark-accent border-b-2 border-dark-accent'
                      : 'text-dark-text-secondary hover:text-dark-text'
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-dark-bg-secondary border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-dark-text-secondary">
            <p>
              Powered by{' '}
              <a
                href="https://postgrest.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-accent hover:text-dark-accent-hover"
              >
                PostgREST
              </a>
            </p>
            <p>Dark Mode Only 🌙</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
