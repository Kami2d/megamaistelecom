import {
  demoIncidents,
  monitoredServices,
  type MonitoredService,
  type StatusIncident,
} from '../data/status'

export type StatusSnapshot = {
  services: MonitoredService[]
  incidents: StatusIncident[]
  /** Timestamp of the local consultation, not of an external verification. */
  checkedAt: Date
  mode: 'demo' | 'live'
}

/**
 * Contract for a future backend adapter. The UI depends only on this shape,
 * so a provider that consults official status pages/APIs can be swapped in
 * without changing cards, filters or the diagnostic flow.
 */
export interface StatusProvider {
  id: string
  mode: StatusSnapshot['mode']
  load(): Promise<StatusSnapshot>
}

/**
 * Demo provider. Returns local data immediately: no request, no delay and no
 * claim of real-time verification.
 */
export const demoStatusProvider: StatusProvider = {
  id: 'demo-local',
  mode: 'demo',
  async load() {
    return {
      services: monitoredServices,
      incidents: demoIncidents,
      checkedAt: new Date(),
      mode: 'demo',
    }
  },
}

/** Provider used by the page. Replace with a live adapter when available. */
export const statusProvider: StatusProvider = demoStatusProvider
