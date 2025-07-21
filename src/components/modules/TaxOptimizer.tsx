import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Switch';
import { AlertCircle, ArrowRight, BarChart, Percent, Scale } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatCurrency } from '../../lib/utils';

const TAX_BRACKET_LIMIT = 42500;
const REDUCED_TAX_RATE = 0.15;
const STANDARD_TAX_RATE = 0.25;

export const TaxOptimizer = () => {
  const [totalProfit, setTotalProfit] = useState<string>('250000');
  const [employeeShare, setEmployeeShare] = useState<string>('50');
  const [reserveAllocation, setReserveAllocation] = useState<string>('15');
  const [hasAgreement, setHasAgreement] = useState<boolean>(true);

  const [result, setResult] = useState<any>(null);

  const handleCalculation = () => {
    const profit = parseFloat(totalProfit);
    const employeePct = parseFloat(employeeShare) / 100;
    const reservePct = parseFloat(reserveAllocation) / 100;

    if (isNaN(profit) || isNaN(employeePct) || isNaN(reservePct) || profit <= 0) {
      // Handle error state or invalid input
      setResult(null);
      return;
    }

    // SCOP Calculation
    const employeeAmount = profit * employeePct;
    const reserveAmount = profit * reservePct;
    const taxableIncomeScop = hasAgreement ? Math.max(0, profit - employeeAmount - reserveAmount) : profit;
    
    let taxScop = 0;
    if (taxableIncomeScop > TAX_BRACKET_LIMIT) {
      taxScop = (TAX_BRACKET_LIMIT * REDUCED_TAX_RATE) + ((taxableIncomeScop - TAX_BRACKET_LIMIT) * STANDARD_TAX_RATE);
    } else {
      taxScop = taxableIncomeScop * REDUCED_TAX_RATE;
    }

    // Standard Corp Calculation
    const taxableIncomeStandard = profit;
    let taxStandard = 0;
    if (taxableIncomeStandard > TAX_BRACKET_LIMIT) {
      taxStandard = (TAX_BRACKET_LIMIT * REDUCED_TAX_RATE) + ((taxableIncomeStandard - TAX_BRACKET_LIMIT) * STANDARD_TAX_RATE);
    } else {
      taxStandard = taxableIncomeStandard * REDUCED_TAX_RATE;
    }

    setResult({
      taxScop,
      taxStandard,
      taxableIncomeScop,
      effectiveRate: taxScop / profit,
      taxSavings: taxStandard - taxScop,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="bg-zinc-900/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="w-6 h-6 text-primary" />
            <span>Paramètres de Calcul de l'IS</span>
          </CardTitle>
          <CardDescription>Saisissez les données financières et les règles de répartition des bénéfices de la SCOP.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="totalProfit">Bénéfice comptable total (€)</Label>
            <Input id="totalProfit" type="number" placeholder="Ex: 250000" value={totalProfit} onChange={e => setTotalProfit(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeShare">Part Salariés (%)</Label>
              <Input id="employeeShare" type="number" placeholder="Ex: 50" value={employeeShare} onChange={e => setEmployeeShare(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reserveAllocation">Part Réserves (%)</Label>
              <Input id="reserveAllocation" type="number" placeholder="Ex: 15" value={reserveAllocation} onChange={e => setReserveAllocation(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-md bg-zinc-800/70">
            <Label htmlFor="agreement" className="flex flex-col space-y-1 cursor-pointer">
              <span>Accord de participation dérogatoire</span>
              <span className="font-normal text-xs text-muted-foreground">Activer pour appliquer l'exonération fiscale.</span>
            </Label>
            <Switch id="agreement" checked={hasAgreement} onCheckedChange={setHasAgreement} />
          </div>
          <Button onClick={handleCalculation} className="w-full">
            Calculer l'Impôt sur les Sociétés
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <Card className="bg-zinc-900/50 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="w-6 h-6 text-secondary" />
              <span>Résultats et Analyse Comparative</span>
            </CardTitle>
            <CardDescription>Analyse détaillée de l'impôt dû et des économies réalisées.</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {!result ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p>Les résultats de la simulation s'afficheront ici.</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-zinc-800/70 rounded-lg">
                      <p className="text-sm text-muted-foreground">IS Dû (Régime SCOP)</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(result.taxScop)}</p>
                    </div>
                    <div className="p-4 bg-zinc-800/70 rounded-lg">
                      <p className="text-sm text-muted-foreground">IS Dû (Régime Standard)</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(result.taxStandard)}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-green-500/10 rounded-lg text-center">
                    <p className="text-sm text-green-400">Économie d'impôt réalisée</p>
                    <p className="text-3xl font-bold text-green-300">{formatCurrency(result.taxSavings)}</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base imposable (SCOP):</span>
                      <span className="font-medium">{formatCurrency(result.taxableIncomeScop)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux d'imposition effectif:</span>
                      <span className="font-medium">{(result.effectiveRate * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
        {!hasAgreement && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start space-x-3 p-4 rounded-lg bg-amber-900/30 border border-amber-700/50">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-300">
              L'accord de participation dérogatoire est désactivé. Les calculs reflètent un régime fiscal standard sans exonérations spécifiques à la SCOP.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
