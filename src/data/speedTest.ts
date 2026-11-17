/** Configuration for the frontend-only speed test. */
export const speedTestConfig = {
  payloadUrl: '/speedtest/payload.bin',
  pingUrl: '/favicon.svg',
  payloadBytes: 2 * 1024 * 1024,
  /** Scale used by the visual gauge. */
  maxMbps: 1000,
  uploadAvailable: false,
} as const
