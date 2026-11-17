import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { plans } from '../data/plans'

type PlanSelectionValue = {
  selectedPlanId: string
  selectedSpeed: number
  setSelectedPlanId: (id: string) => void
  setSelectedSpeed: (speed: number) => void
}

const PlanSelectionContext = createContext<PlanSelectionValue | null>(null)

export function PlanSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedPlanId, setSelectedPlanId] = useState('wifi-master')

  const value = useMemo<PlanSelectionValue>(() => {
    const selectedSpeed =
      plans.find((plan) => plan.id === selectedPlanId)?.speedMb ?? plans[0].speedMb

    return {
      selectedPlanId,
      selectedSpeed,
      setSelectedPlanId,
      setSelectedSpeed: (speed) => {
        const plan = plans.find((item) => item.speedMb === speed)
        if (plan) setSelectedPlanId(plan.id)
      },
    }
  }, [selectedPlanId])

  return <PlanSelectionContext.Provider value={value}>{children}</PlanSelectionContext.Provider>
}

export function usePlanSelection() {
  const context = useContext(PlanSelectionContext)
  if (!context) throw new Error('usePlanSelection must be used inside PlanSelectionProvider')
  return context
}
