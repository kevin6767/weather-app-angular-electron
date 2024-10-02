export const celsiusToFahrenheit = (celsius: number): number => {
  const fahrenheit = (celsius * 9) / 5 + 32;
  return Math.floor(fahrenheit);
};
