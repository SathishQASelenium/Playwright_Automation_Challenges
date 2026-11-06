/**
 * Automation Challenge 1 (Level 2) - E-commerce Checkout Process Automation.
 *
 *  1. Navigate to the homepage of the e-commerce site
 *  2. Log in with the provided credentials
 *  3. Navigate to the Products page
 *  4. Search for "Dress" and add the first result to the cart
 *  5. Validate the "Your product has been added to cart." popup and use its
 *     View Cart link
 *  6. Proceed to Checkout, then Place Order
 *  7. Fill the payment form and pay
 *  8. Verify "Congratulations! Your order has been confirmed!" and Continue
 *  9. Log out and verify the app returns to the login page
 */

import { test, expect } from '@fixtures/test-base';
import { appConfig } from '@config/appConfig';
import { visualStep } from '@utils/visualStep';
import { createLogger } from '@utils/logger';

const log = createLogger('challenge-L2-01');

test.describe('@P0 @Regression E-commerce checkout process', () => {
    test('adds a searched product to the cart, pays and logs out', async ({
        page,
        homePage,
        loginPage,
        productsPage,
        cartPage,
        checkoutPage,
        paymentPage,
        orderConfirmationPage,
    }) => {
        let productName = '';

        await visualStep(page, 'Step 1 - Navigate to the homepage', async () => {
            await homePage.open();
            await homePage.waitForLoaded();
            log.info(`homepage loaded at ${page.url()}`);
        });

        await visualStep(page, 'Step 2 - Log in with the provided credentials', async () => {
            await loginPage.open();
            await loginPage.waitForLoaded();
            await loginPage.loginAs(appConfig.credentials.email, appConfig.credentials.password);
            await loginPage.expectLoggedIn();
            log.info(`logged in as ${await loginPage.nav.getLoggedInText()}`);

            // The demo account keeps its cart server-side, so start clean to
            // keep the checkout review deterministic across runs.
            await cartPage.emptyCart();
            log.info('cart emptied before adding the product');
        });

        await visualStep(page, 'Step 3 - Navigate to the Products page', async () => {
            await productsPage.open();
            await productsPage.waitForLoaded();
            log.info(`products page loaded with ${await productsPage.getProductCount()} products`);
        });

        await visualStep(page, 'Step 4 - Search for the product and add it to the cart', async () => {
            await productsPage.searchFor(appConfig.product.searchTerm);

            const results = await productsPage.getSearchResultCount();
            expect(results).toBeGreaterThan(0);

            productName = await productsPage.getProductName(0);
            log.info(`search returned ${results} results; adding "${productName}"`);

            await productsPage.addToCart(0);
        });

        await visualStep(page, 'Step 5 - Validate the added-to-cart popup and open the cart', async () => {
            const modalText = await productsPage.getCartModalText();
            expect(modalText).toContain('Your product has been added to cart.');
            log.info('added-to-cart confirmation modal is visible');

            await productsPage.clickViewCart();
            await cartPage.expectLoaded();

            expect(await cartPage.getRowCount()).toBe(1);
            expect(await cartPage.getProductNames()).toContain(productName);
            log.info(`cart contains "${productName}"`);
        });

        await visualStep(page, 'Step 6 - Proceed to checkout and place the order', async () => {
            await cartPage.proceedToCheckout();
            await checkoutPage.expectLoaded();
            log.info(`checkout page shows address: ${await checkoutPage.getDeliveryAddress()}`);

            await checkoutPage.placeOrder();
        });

        await visualStep(page, 'Step 7 - Fill the payment form and pay', async () => {
            await paymentPage.expectLoaded();
            await paymentPage.payAndConfirmOrder(appConfig.payment);
            log.info('payment submitted');
        });

        await visualStep(page, 'Step 8 - Verify the order confirmation and continue', async () => {
            await orderConfirmationPage.expectConfirmed();
            log.info(`order ${orderConfirmationPage.getOrderId()} confirmed at ${page.url()}`);

            await orderConfirmationPage.continueShopping();
            await expect(page).toHaveURL(/automationexercise\.com\/?$/);
            log.info('returned to the homepage');
        });

        await visualStep(page, 'Step 9 - Log out and verify the login page', async () => {
            await loginPage.nav.logout();

            await expect(page).toHaveURL(/\/login/);
            await loginPage.waitForLoaded();
            log.info(`logged out and returned to ${page.url()}`);
        });
    });
});
