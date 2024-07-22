import { Locator, Page } from "@playwright/test";
import { RELATIVE_URL } from "../playwright.config";

export class ShopPage {
  url = RELATIVE_URL + "/shop";
  readonly page: Page;
  readonly viewCartBtn: Locator;
  readonly browseProductsBtn: Locator;
  readonly emptyCartText: Locator;
  readonly productCards: Locator;
  readonly shopHeaderTotalItems: Locator;
  readonly shopHeaderTotalPrice: Locator;
  readonly cartProducts: Locator;
  readonly placeOrderBtn: Locator;
  readonly afterOrderText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.viewCartBtn = page.getByRole("button", { name: "View Cart" });
    this.browseProductsBtn = page.getByRole("button", { name: "Browse Products" });
    this.emptyCartText = page.getByText("There's nothing in your cart!");
    this.productCards = page.getByTestId("product-card");
    this.shopHeaderTotalItems = page.getByTestId("shop-header-total-items");
    this.shopHeaderTotalPrice = page.getByTestId("shop-header-total-price");
    this.cartProducts = page.getByRole("listitem");
    this.placeOrderBtn = page.getByRole("button", { name: "Place Order" });
    this.afterOrderText = page.getByText("Thank you for your order.");
  }

  async navigate() {
    await this.page.goto(this.url);
  }

  async viewCart() {
    await this.viewCartBtn.click();
  }

  async browseProducts() {
    await this.browseProductsBtn.click();
  }

  productCard(productName: string) {
    return this.productCards.filter({ hasText: productName });
  }

  productCardBtn(productName: string) {
    return this.productCard(productName).getByRole("button");
  }

  async addProductToCart(productName: string) {
    await this.productCardBtn(productName).click();
  }

  productCartItem(productName: string) {
    return this.cartProducts.filter({ hasText: productName });
  }

  productCartItemQuantityDropdown(productName: string) {
    return this.productCartItem(productName).getByRole("combobox", { name: "Item Quantity" });
  }

  async changeQuantityOfProduct(productName: string, quantity: number) {
    await this.productCartItemQuantityDropdown(productName).click();
    await this.page.getByRole("option", { name: quantity.toString() }).first().click();
  }

  productCartItemBadge(productName: string) {
    return this.productCartItem(productName).locator("span.MuiBadge-badge");
  }

  productCartItemSubtotalPrice(productName: string) {
    return this.productCartItem(productName).getByText("Subtotal Price");
  }

  productCartItemRemoveBtn(productName: string) {
    return this.productCartItem(productName).getByRole("button", { name: "Remove Item From Cart" });
  }

  async removeProductFromCart(productName: string) {
    await this.productCartItemRemoveBtn(productName).click();
  }

  async placeOrder() {
    await this.placeOrderBtn.click();
  }
}
