# Challenge 01 (Level 2) - E-commerce Checkout Process

Playwright + TypeScript solution for **Level 2, Project 1**, built on the
[`AdvancePlaywrightFramework1x`](https://github.com/SathishQASelenium/AdvancePlaywrightFramework1x)
core (Page Object Model, fixtures, Winston logging, visual steps, and the
**Custom TTA HTML reporter**).

## Scenario

Target: <https://www.automationexercise.com>

1. Open the homepage
2. Log in with the provided credentials
3. Open the **Products** page
4. Search for **Dress** and add the first result to the cart
5. Validate the **"Your product has been added to cart."** popup and click
   **View Cart**
6. Click **Proceed To Checkout**, then **Place Order**
7. Fill Name on Card, Card Number, CVC, Expiration month and a future year, then
   click **Pay and Confirm Order**
8. Verify the confirmation page shows
   **"Congratulations! Your order has been confirmed!"**, then click
   **Continue**
9. Log out and verify the app returns to the **Login** page

## Structure

```
challenge-01-ecommerce-checkout/
├─ src/
│  ├─ components/
│  │  └─ NavBar.ts                     # shared header: Products, Cart, Logout
│  ├─ config/appConfig.ts              # baseURL, credentials, product, payment
│  ├─ fixtures/test-base.ts            # page-object fixtures
│  ├─ pages/
│  │  ├─ BasePage.ts
│  │  ├─ HomePage.ts
│  │  ├─ LoginPage.ts                  # data-qa login-email / login-password / login-button
│  │  ├─ ProductsPage.ts               # #search_product / #submit_search, overlay add-to-cart
│  │  ├─ CartPage.ts                   # #cart_info_table, a.check_out
│  │  ├─ CheckoutPage.ts               # #address_delivery, Place Order
│  │  ├─ PaymentPage.ts                # data-qa payment fields
│  │  └─ OrderConfirmationPage.ts      # data-qa order-placed / continue-button
│  ├─ tests/
│  │  └─ challenge-01-ecommerce-checkout.spec.ts
│  └─ utils/
│     ├─ CustomTTAReporter.ts          # copied from AdvancePlaywrightFramework1x
│     ├─ logger.ts
│     ├─ UtilElementLocator.ts
│     └─ visualStep.ts
├─ playwright.config.ts
├─ tsconfig.json
├─ .env.example
└─ package.json
```

## Setup

```bash
npm install
npx playwright install chromium
```

Optionally copy `.env.example` to `.env` to override credentials, the search
term, or the demo payment details.

## Run

```bash
npm test
npm run test:headed
npm run test:chromium
npm run typecheck
```

## App-specific behaviour handled

- The cart is stored server-side against the demo account, so the test empties
  it after login to keep the checkout review deterministic across runs.
- Product cards reveal **Add to cart** only on hover, so `ProductsPage.addToCart`
  hovers the card and clicks `.product-overlay .add-to-cart`.
- The search results page is `/products?search=Dress` and its heading changes to
  **SEARCHED PRODUCTS**.
- The Payment page accepts any syntactically valid card and never charges; the
  defaults use `4111111111111111` with a future expiry (`12/2030`).
- The confirmation URL is `/payment_done/<orderId>` and the heading is rendered
  in uppercase (`ORDER PLACED!`).

## Reports

- **Custom TTA report** - `tta-report/index.html` (latest), with one screenshot
  per `visualStep`.
- **Playwright HTML report** - `playwright-report/`, open with
  `npm run test:report`.
