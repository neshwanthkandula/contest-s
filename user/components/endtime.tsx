/**
 * @returns end time in milliseconds
 */
export function calculateEndTime(
  start_date: string,
  start_time: string,
  start_duration: string
): number {
  // Combine date + time → Date object
  const startDateTime = new Date(`${start_date}T${start_time}:00`)

  // Convert duration (minutes → ms)
  const durationMs = Number(start_duration) * 60 * 1000

  return startDateTime.getTime() + durationMs
}
