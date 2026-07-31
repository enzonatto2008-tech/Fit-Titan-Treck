import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { FitnessProvider } from '@/context/FitnessContext'

import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Setup from '@/pages/Setup'
import Dashboard from '@/pages/Dashboard'
import Meals from '@/pages/Meals'
import Recipes from '@/pages/Recipes'
import Weight from '@/pages/Weight'
import Photos from '@/pages/Photos'
import Workouts from '@/pages/Workouts'
import WorkoutSession from '@/pages/WorkoutSession'
import WorkoutHistory from '@/pages/WorkoutHistory'
import Water from '@/pages/Water'
import Sleep from '@/pages/Sleep'
import Goals from '@/pages/Goals'
import Statistics from '@/pages/Statistics'
import Calculators from '@/pages/Calculators'
import ExportCenter from '@/pages/ExportCenter'
import Reports from '@/pages/Reports'
import AiAssistant from '@/pages/AiAssistant'
import Settings from '@/pages/Settings'
import Reminders from '@/pages/Reminders'
import NotFound from '@/pages/NotFound'

const App = () => (
  <BrowserRouter>
    <FitnessProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/refeicoes" element={<Meals />} />
            <Route path="/evolucao/peso" element={<Weight />} />
            <Route path="/evolucao/fotos" element={<Photos />} />
            <Route path="/treinos" element={<Workouts />} />
            <Route path="/treinos/executar/:routineId" element={<WorkoutSession />} />
            <Route path="/treinos/historico" element={<WorkoutHistory />} />
            <Route path="/agua" element={<Water />} />
            <Route path="/sono" element={<Sleep />} />
            <Route path="/lembretes" element={<Reminders />} />
            <Route path="/metas" element={<Goals />} />
            <Route path="/estatisticas" element={<Statistics />} />
            <Route path="/receitas" element={<Recipes />} />
            <Route path="/calculadoras" element={<Calculators />} />
            <Route path="/exportar" element={<ExportCenter />} />
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/ai" element={<AiAssistant />} />
            <Route path="/configuracoes" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </FitnessProvider>
  </BrowserRouter>
)

export default App
