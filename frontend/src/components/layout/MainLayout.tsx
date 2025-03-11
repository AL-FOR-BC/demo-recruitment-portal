import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        {/* Add your header content */}
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-white dark:bg-gray-800 shadow">
        {/* Add your footer content */}
      </footer>
    </div>
  );
};
