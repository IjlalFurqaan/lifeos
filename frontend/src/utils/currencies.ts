// Supported currencies with their formatting details
export interface Currency {
    code: string;
    symbol: string;
    name: string;
    locale: string;
}

export const currencies: Currency[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
    { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
    { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH' },
];

export const getCurrencyByCode = (code: string): Currency | undefined => {
    return currencies.find((c) => c.code === code);
};

export const getDefaultCurrency = (): Currency => {
    return currencies[0]; // USD
};
