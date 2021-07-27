//Turns t type to YYYY-MM-DD HH:MM:SS time type
export function dateCleaner(dateStr) {
  return new Date(dateStr).toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '')
}