// apps/client/src/utils/formatCurrency.js

const formatCurrency = (amount) => {
  // Handle null or undefined amounts gracefully
  if (amount === null || amount === undefined) {
    return '₦0'; // Default to ₦0 or any other placeholder you prefer
  }

  // Ensure the amount is a number before formatting
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    console.warn(`Invalid amount passed to formatCurrency: ${amount}`);
    return '₦0'; // Return a default for invalid numbers
  }

  // Use Intl.NumberFormat for robust currency formatting
  // 'en-NG' specifies the locale (English, Nigeria) which ensures correct grouping (comma)
  // 'decimal' style formats just the number (we add the currency symbol manually)
  // minimumFractionDigits and maximumFractionDigits control decimal places
  // For Naira, prices are usually whole numbers, so 0 decimal places is common.
  const formattedAmount = new Intl.NumberFormat('en-NG', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2, // Allows for kobo if needed, but will omit if 0
    useGrouping: true, // Ensures the comma separator
  }).format(numericAmount);

  return `₦${formattedAmount}`;
};

export default formatCurrency;