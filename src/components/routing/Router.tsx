/**
 * Simple client-side router for the application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Route = {
  path: string;
  component: React.ComponentType<any>;
  requiresAuth?: boolean;
  adminOnly?: boolean;
};

type RouterContextType = {
  currentPath: string;
  navigate: (path: string) => void;
  goBack: () => void;
};

const RouterContext = createContext<RouterContextType | null>(null);

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a Router');
  }
  return context;
};

interface RouterProps {
  children: ReactNode;
  routes: Route[];
  isAuthenticated: boolean;
  isAdmin?: boolean;
  fallbackComponent?: React.ComponentType;
  loginComponent?: React.ComponentType;
}

export const Router: React.FC<RouterProps> = ({
  children,
  routes,
  isAuthenticated,
  isAdmin = false,
  fallbackComponent: FallbackComponent,
  loginComponent: LoginComponent,
}) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [history, setHistory] = useState<string[]>([window.location.pathname]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      setHistory(prev => [...prev, path]);
      setCurrentPath(path);
      window.history.pushState({}, '', path);
    }
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousPath = newHistory[newHistory.length - 1] || '/';
      setHistory(newHistory);
      setCurrentPath(previousPath);
      window.history.back();
    }
  };

  const findRoute = (path: string): Route | null => {
    return routes.find(route => {
      if (route.path === path) return true;
      
      // Handle dynamic routes (basic implementation)
      const routeParts = route.path.split('/');
      const pathParts = path.split('/');
      
      if (routeParts.length !== pathParts.length) return false;
      
      return routeParts.every((part, index) => {
        return part.startsWith(':') || part === pathParts[index];
      });
    }) || null;
  };

  const currentRoute = findRoute(currentPath);

  const renderRoute = () => {
    if (!currentRoute) {
      return FallbackComponent ? <FallbackComponent /> : <div>404 - Page not found</div>;
    }

    // Check authentication requirements
    if (currentRoute.requiresAuth && !isAuthenticated) {
      return LoginComponent ? <LoginComponent /> : <div>Please log in</div>;
    }

    // Check admin requirements
    if (currentRoute.adminOnly && !isAdmin) {
      return <div>Access denied - Admin only</div>;
    }

    const Component = currentRoute.component;
    return <Component />;
  };

  const contextValue: RouterContextType = {
    currentPath,
    navigate,
    goBack,
  };

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
      {renderRoute()}
    </RouterContext.Provider>
  );
};

// Route component for declarative routing
interface RouteProps {
  path: string;
  component: React.ComponentType<any>;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

export const Route: React.FC<RouteProps> = () => {
  // This is just for type checking, actual routing is handled by Router
  return null;
};

// Link component for navigation
interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Link: React.FC<LinkProps> = ({ to, children, className, onClick }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};