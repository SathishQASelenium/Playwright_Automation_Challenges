/**
 * appConfig - environment-driven settings for the Automation Exercise
 * e-commerce checkout challenge.
 *
 * playwright.config.ts calls dotenv.config() before any spec is loaded, so the
 * values below can be overridden through `.env`. The fallbacks are the public
 * challenge values, so the suite runs on a fresh clone.
 */

export const appConfig = {
    baseURL: process.env.BASE_URL ?? 'https://www.automationexercise.com',
    paths: {
        home: '/',
        login: '/login',
        products: '/products',
        cart: '/view_cart',
        checkout: '/checkout',
        payment: '/payment',
    },
    credentials: {
        email: process.env.AE_EMAIL ?? 'r97ain68@1sec.email',
        password: process.env.AE_PASSWORD ?? 'Password@123',
    },
    product: {
        searchTerm: process.env.AE_SEARCH_PRODUCT ?? 'Dress',
    },
    payment: {
        nameOnCard: process.env.CARD_NAME ?? 'TTA Test User',
        cardNumber: process.env.CARD_NUMBER ?? '4111111111111111',
        cvc: process.env.CARD_CVC ?? '123',
        expiryMonth: process.env.CARD_EXPIRY_MONTH ?? '12',
        expiryYear: process.env.CARD_EXPIRY_YEAR ?? '2030',
    },
} as const;
