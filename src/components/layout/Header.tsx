import { BarChart3, Landmark } from 'lucide-react';

export const Header = () => {
  return (
    <header className="container mx-auto px-4">
      <div className="flex items-center justify-between h-20 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Landmark className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">Outil 35</span>
        </div>
        <a
          href="mailto:contact@votre-cabinet.fr"
          className="hidden sm:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Rapport d'Expert</span>
        </a>
      </div>
    </header>
  );
};
