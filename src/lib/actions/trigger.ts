import { headers } from 'next/headers'

export async function deactivateSchedule(scheduleId: string) {
  try {
    const apiKey = process.env.TRIGGER_SECRET_KEY

    if (!apiKey) {
      throw new Error('TRIGGER_SECRET_KEY is not set in environment variables')
    }

    const response = await fetch(
      `https://api.trigger.dev/api/v1/schedules/${scheduleId}/deactivate`,
      {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Failed to deactivate schedule:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}