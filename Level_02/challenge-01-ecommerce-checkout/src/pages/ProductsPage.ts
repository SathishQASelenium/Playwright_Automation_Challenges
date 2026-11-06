import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Products page at https://www.automationexercise.com/products.
 *
 * The page renders one `.product-image-wrapper` per product. The Add to cart
 * button only becomes visible on hover inside `.product-overlay`, so
 * `addToCart` hovers the card first and then clicks the overlay button.
 */
export class ProductsPage extends BasePage {
    static readonly PATH = '/products';

    private readonly searchInput: Locator;
    private readonly searchButton: Locator;
    private readonly productCards: Locator;
    private readonly sectionHeading: Locator;
    private readonly cartModal: Locator;
    private readonly viewCartLink: Locator;

    constructor(page: Page) {
        super(page, 'ProductsPage');
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.productCards = page.locator('.features_items .product-image-wrapper');
        this.sectionHeading = page.locator('.features_items h2.title').first();
        this.cartModal = page.locator('#cartModal');
        this.viewCartLink = page.locator('#cartModal a[href="/view_cart"]');
    }

    async open(): Promise<void> {
        await this.goto(ProductsPage.PATH);
    }

    async waitForLoaded(): Promise<void> {
        await expect(this.sectionHeading).toHaveText(/all products/i);
        await expect(this.productCards.first()).toBeVisible();
    }

    async getProductCount(): Promise<number> {
        return this.el.count(this.productCards);
    }

    async getProductNames(): Promise<string[]> {
        return this.el.getAllTexts(this.productCards.locator('.productinfo p'));
    }

    async searchFor(term: string): Promise<void> {
        this.log.info(`searching for "${term}"`);
        await this.el.fill(this.searchInput, term);
        await this.el.click(this.searchButton);
        await expect(this.page).toHaveURL(/\/products\?search=/);
        await expect(this.sectionHeading).toHaveText(/searched products/i);
    }

    async getSearchResultCount(): Promise<number> {
        return this.el.count(this.productCards);
    }

    /** Name shown on the product card at `index`. */
    async getProductName(index = 0): Promise<string> {
        return this.el.getInnerText(this.productCards.nth(index).locator('.productinfo p').first());
    }

    /**
     * Hover the product card so its overlay appears, then click Add to cart.
     * Waits for the "Your product has been added to cart." confirmation modal.
     */
    async addToCart(index = 0): Promise<void> {
        const card = this.productCards.nth(index);
        const addToCartButton = card.locator('.product-overlay .add-to-cart');

        this.log.info(`adding product ${index + 1} to the cart`);
        await card.scrollIntoViewIfNeeded();
        await card.hover();
        await expect(addToCartButton).toBeVisible();
        await this.el.click(addToCartButton);

        await expect(this.cartModal).toBeVisible();
        await expect(this.cartModal).toContainText('Your product has been added to cart.');
    }

    async getCartModalText(): Promise<string> {
        return this.el.getInnerText(this.cartModal);
    }

    async clickViewCart(): Promise<void> {
        this.log.info('clicking View Cart in the confirmation modal');
        await this.el.click(this.viewCartLink);
    }
}
