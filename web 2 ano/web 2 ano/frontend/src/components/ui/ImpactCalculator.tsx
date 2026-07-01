import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Utensils, Users, Leaf, Cloud } from 'lucide-react';
import { analyticsApi } from '../../services/api';
import type { ImpactCalculation } from '../../types';

export function ImpactCalculator() {
  const [foodKg, setFoodKg] = useState(10);
  const [result, setResult] = useState<ImpactCalculation | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const { data } = await analyticsApi.calculator(foodKg);
      setResult(data);
    } catch {
      const mealsGenerated = Math.round(foodKg * 3);
      setResult({
        inputKg: foodKg,
        mealsGenerated,
        peopleHelped: Math.round(mealsGenerated / 2.5),
        wasteAvoidedKg: Math.round(foodKg * 0.95 * 10) / 10,
        co2AvoidedKg: Math.round(foodKg * 2 * 10) / 10,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-gradient-to-br from-primary-50 to-trust-50">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary-600 p-3 text-white">
          <Calculator className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-gray-900">Calculadora de Impacto Social</h3>
          <p className="text-sm text-gray-500">Descubra o impacto da sua doação</p>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Quantidade de alimento (kg)
        </label>
        <div className="mt-2 flex gap-3">
          <input
            type="range"
            min="1"
            max="500"
            value={foodKg}
            onChange={(e) => setFoodKg(Number(e.target.value))}
            className="flex-1 accent-primary-600"
          />
          <input
            type="number"
            value={foodKg}
            onChange={(e) => setFoodKg(Number(e.target.value))}
            className="input-field w-24 text-center"
            min="1"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        disabled={loading}
        className="btn-primary mt-4 w-full"
      >
        {loading ? 'Calculando...' : 'Calcular Impacto'}
      </button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 grid grid-cols-2 gap-4"
        >
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <Utensils className="mx-auto h-6 w-6 text-primary-600" />
            <p className="mt-2 text-2xl font-bold text-gray-900">{result.mealsGenerated}</p>
            <p className="text-xs text-gray-500">Refeições geradas</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <Users className="mx-auto h-6 w-6 text-trust-600" />
            <p className="mt-2 text-2xl font-bold text-gray-900">{result.peopleHelped}</p>
            <p className="text-xs text-gray-500">Pessoas ajudadas</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <Leaf className="mx-auto h-6 w-6 text-green-600" />
            <p className="mt-2 text-2xl font-bold text-gray-900">{result.wasteAvoidedKg} kg</p>
            <p className="text-xs text-gray-500">Desperdício evitado</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <Cloud className="mx-auto h-6 w-6 text-blue-600" />
            <p className="mt-2 text-2xl font-bold text-gray-900">{result.co2AvoidedKg} kg</p>
            <p className="text-xs text-gray-500">CO₂ evitado</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
