import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { TaxOptimizer } from './components/modules/TaxOptimizer';
import { FinancingSimulator } from './components/modules/FinancingSimulator';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from './lib/utils';

type Module = 'tax' | 'financing';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('tax');

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-5" style={{backgroundImage: "url('https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"}}></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Suite de Planification Financière SCOP
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Modélisez, simulez et optimisez les structures financières et fiscales uniques des SCOP avec précision et confiance.
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="p-1.5 rounded-lg bg-zinc-800/60 backdrop-blur-sm flex items-center space-x-2">
                <TabButton id="tax" activeId={activeModule} onClick={setActiveModule}>Optimisation IS</TabButton>
                <TabButton id="financing" activeId={activeModule} onClick={setActiveModule}>Simulateur de Financement</TabButton>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeModule === 'tax' && <TaxOptimizer />}
                {activeModule === 'financing' && <FinancingSimulator />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

const TabButton = ({ id, activeId, onClick, children }: { id: Module, activeId: Module, onClick: (id: Module) => void, children: React.ReactNode }) => {
  const isActive = id === activeId;
  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-md transition-colors relative",
        isActive ? "text-white" : "text-muted-foreground hover:text-white"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-tab-indicator"
          className="absolute inset-0 bg-primary/20 rounded-md"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
