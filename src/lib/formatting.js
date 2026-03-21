const numberFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatCurrencyAmount = (amount, currency = "EUR") =>
  `${numberFormatter.format(Number(amount || 0))} ${currency}`;

export const formatCurrencyBreakdown = (amountsByCurrency = {}, fallbackAmount = 0, fallbackCurrency = "EUR") => {
  const rawEntries = Object.entries(amountsByCurrency || {});
  const entries = rawEntries.filter(([, value]) => Number(value) !== 0);
  if (!entries.length && rawEntries.length) {
    return rawEntries.map(([currency, value]) => formatCurrencyAmount(value, currency)).join(" · ");
  }
  if (!entries.length) {
    return formatCurrencyAmount(fallbackAmount, fallbackCurrency);
  }
  return entries.map(([currency, value]) => formatCurrencyAmount(value, currency)).join(" · ");
};