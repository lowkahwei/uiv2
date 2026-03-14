import { CalendarDate } from "@internationalized/date";

// Cache for days in month to avoid repeated calculations
const daysInMonthCache = new Map<string, number>();

export const getDaysInMonth = (year: number, month: number): number => {
  const cacheKey = `${year}-${month}`;
  
  if (daysInMonthCache.has(cacheKey)) {
    return daysInMonthCache.get(cacheKey)!;
  }
  
  const days = new CalendarDate(year, month, 1)
    .add({ months: 1 })
    .subtract({ days: 1 })
    .day;
  
  daysInMonthCache.set(cacheKey, days);
  
  // Keep cache size reasonable
  if (daysInMonthCache.size > 100) {
    const firstKey = daysInMonthCache.keys().next().value;
    if (firstKey) {
      daysInMonthCache.delete(firstKey);
    }
  }
  
  return days;
};

// Optimized range generator with pre-allocated array
export const generateRange = (min: number, max: number): number[] => {
  const length = max - min + 1;
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = min + i;
  }
  return result;
};

// Cache for static items to avoid repeated string formatting
const staticItemsCache = new Map<string, { value: number; label: string }[]>();

export const createStaticItems = (
  min: number, 
  max: number, 
  formatter?: (value: number) => string
): { value: number; label: string }[] => {
  const cacheKey = `${min}-${max}-${formatter ? 'custom' : 'default'}`;
  
  if (!formatter && staticItemsCache.has(cacheKey)) {
    return staticItemsCache.get(cacheKey)!;
  }
  
  const items = generateRange(min, max).map(value => ({
    value,
    label: formatter ? formatter(value) : value.toString().padStart(2, '0')
  }));
  
  if (!formatter) {
    staticItemsCache.set(cacheKey, items);
  }
  
  return items;
};
