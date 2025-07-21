import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { ArrowRight, Banknote, HandCoins, PieChart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatCurrency, formatPercent } from '../../lib/utils';

interface AmortizationRow {
  year: number;
  principal: number;
  interest: number;
  totalPayment: number;
  remainingBalance: number;
}

export const FinancingSimulator = () => {
  const [principal, setPrincipal] = useState('500000');
  const [interestRate, setInterestRate] = useState('2.5');
  const [duration, setDuration] = useState('7');
  const [employeeContribution, setEmployeeContribution] = useState('150000');

  const [schedule, setSchedule] = useState<AmortizationRow[] | null>(null);

  const handleSimulation = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100;
    const n = parseInt(duration);

    if (isNaN(p) || isNaN(r) || isNaN(n) || n <= 0 || p <= 0) {
      setSchedule(null);
      return;
    }

    const newSchedule: AmortizationRow[] = [];
    let remainingBalance = p;
    const annualPayment = r > 0 ? p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;

    for (let i = 1; i <= n; i++) {
      const interestPayment = remainingBalance * r;
      const principalPayment = annualPayment - interestPayment;
      remainingBalance -= principalPayment;

      newSchedule.push({
        year: i,
        principal: principalPayment,
        interest: interestPayment,
        totalPayment: annualPayment,
        remainingBalance: Math.abs(remainingBalance) < 0.01 ? 0 : remainingBalance,
      });
    }
    setSchedule(newSchedule);
  };

  const totalFinancing = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const e = parseFloat(employeeContribution) || 0;
    return p + e;
  }, [principal, employeeContribution]);

  const financingStructure = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const e = parseFloat(employeeContribution) || 0;
    const total = p + e;
    return {
        vendorLoanPct: total > 0 ? (p / total) * 100 : 0,
        employeeContributionPct: total > 0 ? (e / total) * 100 : 0,
    }
  }, [principal, employeeContribution]);

  return (
    <div className="space-y-8">
      <Card className="bg-zinc-900/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HandCoins className="w-6 h-6 text-primary" />
            <span>Paramètres de Financement</span>
          </CardTitle>
          <CardDescription>Modélisez le crédit-vendeur et l'apport des salariés pour l'acquisition.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="principal">Principal Crédit-Vendeur (€)</Label>
              <Input id="principal" type="number" placeholder="Ex: 500000" value={principal} onChange={e => setPrincipal(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interestRate">Taux d'intérêt annuel (%)</Label>
              <Input id="interestRate" type="number" placeholder="Ex: 2.5" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Durée du prêt (années)</Label>
              <Input id="duration" type="number" placeholder="Ex: 7" value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeContribution">Apport des salariés (€)</Label>
              <Input id="employeeContribution" type="number" placeholder="Ex: 150000" value={employeeContribution} onChange={e => setEmployeeContribution(e.target.value)} />
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={handleSimulation} className="w-full md:w-auto">
              Générer le Plan de Financement
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {schedule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            <div className="lg:col-span-2">
              <Card className="bg-zinc-900/50 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Tableau d'Amortissement du Crédit-Vendeur</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Année</TableHead>
                        <TableHead className="text-right">Principal</TableHead>
                        <TableHead className="text-right">Intérêts</TableHead>
                        <TableHead className="text-right">Paiement Total</TableHead>
                        <TableHead className="text-right">Solde Restant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedule.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="font-medium text-center">{row.year}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.principal)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.interest)}</TableCell>
                          <TableCell className="font-semibold text-right">{formatCurrency(row.totalPayment)}</TableCell>
                          <TableCell className="text-primary text-right">{formatCurrency(row.remainingBalance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="bg-zinc-900/50 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5 text-secondary" />
                    <span>Structure de Financement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm text-muted-foreground">Crédit-Vendeur</span>
                      <span className="font-bold text-lg">{formatCurrency(parseFloat(principal) || 0)}</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${financingStructure.vendorLoanPct}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm text-muted-foreground">Apport Salariés</span>
                      <span className="font-bold text-lg">{formatCurrency(parseFloat(employeeContribution) || 0)}</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2.5">
                      <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${financingStructure.employeeContributionPct}%` }}></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Financement Interne Total</span>
                      <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{formatCurrency(totalFinancing)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
