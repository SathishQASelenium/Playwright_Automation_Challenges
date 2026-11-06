# Level 2 Project 1 - E-commerce Checkout Automation

## Date

2026-11-06

## Objective

Build `Level_02/challenge-01-ecommerce-checkout` as a standalone Playwright
project on the `AdvancePlaywrightFramework1x` core (including the custom TTA
reporter). The scenario must automate the complete checkout on
<https://www.automationexercise.com>: open the homepage, log in, search a
product on the Products page, add it to the cart, validate the add-to-cart
popup, proceed through checkout and payment, verify
"Congratulations! Your order has been confirmed!", then log out and confirm the
login page is shown again.

## Tools and Technologies Used

- Playwright Test + TypeScript (strict)
- AdvancePlaywrightFramework1x core: custom TTA HTML reporter, Winston logger,
  `UtilElementLocator`, `visualStep`
- Page Object Model, a shared `NavBar` component, and custom Playwright
  fixtures
- Chromium project
- dotenv

## Steps Performed

1. Probed the live site with a throwaway Playwright script before writing any
   page object, to capture the real selectors and transition URLs.
2. Confirmed login selectors `input[data-qa="login-email"]`,
   `input[data-qa="login-password"]`, `button[data-qa="login-button"]`; a
   successful login lands on `/` with a `Logged in as ...` header entry.
3. Confirmed the Products page uses `#search_product` / `#submit_search` and
   that a search redirects to `/products?search=<term>` with the heading
   `SEARCHED PRODUCTS`.
4. Found that Add to cart is only visible on hover inside `.product-overlay` of
   a `.product-image-wrapper`, and that the confirmation modal `#cartModal`
   contains "Your product has been added to cart." plus a View Cart link.
5. Confirmed the cart page uses `#cart_info_table`, `a.check_out` for
   Proceed To Checkout, `/checkout` has `a[href="/payment"]` for Place Order,
   and `/payment` uses the `data-qa` payment inputs and `pay-button`.
6. Confirmed the confirmation page URL is `/payment_done/<orderId>`, the
   heading is `[data-qa="order-placed"]` (rendered uppercase), and the success
   text and `[data-qa="continue-button"]` are present.
7. Created the standalone project, copied the framework core verbatim, and
   implemented page objects, fixtures, config and the spec.
8. Installed dependencies locally, ran `npm run typecheck`, then the suite
   twice.

## Code Examples

Adding a product from the hover overlay:

```ts
async addToCart(index = 0): Promise<void> {
    const card = this.productCards.nth(index);
    const addToCartButton = card.locator('.product-overlay .add-to-cart');

    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await expect(addToCartButton).toBeVisible();
    await this.el.click(addToCartButton);

    await expect(this.cartModal).toBeVisible();
    await expect(this.cartModal).toContainText('Your product has been added to cart.');
}
```

Resetting the server-side cart for repeatable runs:

```ts
async emptyCart(): Promise<void> {
    await this.open();
    for (let removed = 0; removed < 20; removed++) {
        const remaining = await this.cartRows.count();
        if (remaining === 0) return;
        const before = remaining;
        await this.el.click(this.cartRows.first().locator('.cart_quantity_delete'));
        await expect(this.cartRows).toHaveCount(before - 1);
    }
}
```

Order confirmation assertions:

```ts
await expect(page).toHaveURL(/\/payment_done\/\d+/);
await expect(orderPlacedHeading).toHaveText(/order placed/i);
await expect(confirmationMessage).toBeVisible();
```

## Challenges Faced

- The cart is stored server-side against the shared demo account, so leftover
  items from an earlier run would change the review-order row count.
- The Add to cart button on a product card is hidden until the card is hovered.
- The product card text can concatenate the product name and category for some
  results, so the first result is used and its name is captured before adding.
- The site logs non-blocking console errors (mixed-content font stylesheets, an
  MIME-type stylesheet error, and one 400 on the payment page). None of them
  affect the checkout flow.
- The order confirmation heading is uppercase (`ORDER PLACED!`), so the
  assertion is case-insensitive.

## Solutions Implemented

- `CartPage.emptyCart()` removes all existing rows after login, so the cart
  always contains exactly the product added by the test.
- `ProductsPage.addToCart()` scrolls to the card, hovers it, waits for the
  overlay button, then clicks it and waits for the confirmation modal.
- `appConfig` centralises credentials, the search term and demo payment
  details, all overridable through `.env`.
- Explicit assertions cover the popup text, the cart contents, the checkout
  URL and address, the confirmation URL/message and the post-logout login form.

## Key Learnings

- Automation Exercise exposes stable `data-qa` attributes for login, cart and
  payment, which are far more reliable than the styling classes.
- Proceeding to checkout without a session shows a login prompt; the test stays
  logged in from the start, so the direct `/checkout` transition works.
- The payment gateway is a demo: any syntactically valid card works and no real
  charge occurs.
- Using a throwaway probe script to discover selectors before writing page
  objects saved several iterations of test failures.

## Testing and Verification

- `npm run typecheck` - passed with no errors.
- `npx playwright test` (first run) - **1 passed** (30.6s test, 35.5s total),
  100% pass rate; order id `1000` confirmed.
- `npx playwright test` (second run) - passed again (exit code 0);
  `test-results/.last-run.json` reports `"status": "passed"` and the TTA report
  `tta-report/report_20261106_142939.html` shows the successful run.
- The custom TTA report contains one screenshot per `visualStep` (9 steps).

## Future Improvements

- Add negative payment validation cases (missing CVC, expired card).
- Parameterise product selection and quantity, and assert the order total.
- Capture a baseline of the delivery address once and assert it on checkout.
- Reuse a stored auth state to shorten the login step if more scenarios are
  added.
