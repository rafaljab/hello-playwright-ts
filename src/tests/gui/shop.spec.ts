import { test, expect } from "@base/gui/base";
import { RELATIVE_URL } from "@playwright.config";

test.describe("basic tests", { tag: ["@with_rest_api"] }, async () => {
  test.beforeEach("go to shop page", async ({ shopPage }) => {
    await shopPage.navigate();
  });

  test("open empty cart", async ({ shopPage }) => {
    // Given
    await expect(shopPage.emptyCartText).toBeHidden();

    // When
    await shopPage.viewCart();

    // Then
    await expect(shopPage.emptyCartText).toBeVisible();
    await expect(shopPage.placeOrderBtn).toBeDisabled();
  });

  const orders = [
    {
      productName: "Calypso Mangoes",
      totalItems: 1,
      totalPrice: "$2.49",
    },
    {
      productName: "Honeycrisp Apples",
      totalItems: 1,
      totalPrice: "$1.99",
    },
    {
      productName: "Large Avocados",
      totalItems: 1,
      totalPrice: "$2.29",
    },
  ];
  for (const order of orders) {
    test(`add product to cart - ${order.productName}`, async ({ shopPage }) => {
      // Given
      await expect(shopPage.productCardBtn(order.productName)).toHaveAttribute("title", "Add Product");
      await expect(shopPage.shopHeaderTotalItems).toHaveText("Total Items: 0");
      await expect(shopPage.shopHeaderTotalPrice).toHaveText("Total Price: $0.00");

      // When
      await shopPage.addProductToCart(order.productName);

      // Then
      await expect(shopPage.productCardBtn(order.productName)).toHaveAttribute("title", "Product In Cart");
      await expect(shopPage.shopHeaderTotalItems).toHaveText(`Total Items: ${order.totalItems}`);
      await expect(shopPage.shopHeaderTotalPrice).toHaveText(`Total Price: ${order.totalPrice}`);
    });
  }

  test("add multiple products to cart", async ({ shopPage }) => {
    // Given
    await expect(shopPage.shopHeaderTotalItems).toHaveText("Total Items: 0");
    await expect(shopPage.shopHeaderTotalPrice).toHaveText("Total Price: $0.00");

    // When
    await shopPage.addProductToCart("Blackberries (Organic)");
    await shopPage.addProductToCart("Organic Baby Spinach");
    await shopPage.addProductToCart("Exotic Dragonfruit");
    await shopPage.addProductToCart("Golden Kiwis");

    // Then
    await expect(shopPage.shopHeaderTotalItems).toHaveText("Total Items: 4");
    await expect(shopPage.shopHeaderTotalPrice).toHaveText("Total Price: $16.06");
  });

  test("change number of product items in cart", async ({ shopPage }) => {
    // Given
    const productName = "Calypso Mangoes";

    await shopPage.addProductToCart(productName);
    await shopPage.viewCart();

    await expect(shopPage.shopHeaderTotalItems).toHaveText("Total Items: 1");
    await expect(shopPage.shopHeaderTotalPrice).toHaveText("Total Price: $2.49");
    await expect(shopPage.productCartItemBadge(productName)).toHaveText("1");
    await expect(shopPage.productCartItemQuantityDropdown(productName)).toHaveText("1");
    await expect(shopPage.productCartItemSubtotalPrice(productName)).toHaveText("Subtotal Price: $2.49");

    // When
    await shopPage.changeQuantityOfProduct(productName, 10);

    // Then
    await expect(shopPage.shopHeaderTotalItems).toHaveText("Total Items: 10");
    await expect(shopPage.shopHeaderTotalPrice).toHaveText("Total Price: $24.90");
    await expect(shopPage.productCartItemBadge(productName)).toHaveText("10");
    await expect(shopPage.productCartItemQuantityDropdown(productName)).toHaveText("10");
    await expect(shopPage.productCartItemSubtotalPrice(productName)).toHaveText("Subtotal Price: $24.90");
  });

  test("remove product item from cart", async ({ shopPage }) => {
    // Given
    const productName = "Calypso Mangoes";

    await shopPage.addProductToCart(productName);
    await shopPage.viewCart();

    await expect(shopPage.productCartItem(productName)).toBeVisible();
    await expect(shopPage.emptyCartText).toBeHidden();
    await expect(shopPage.placeOrderBtn).toBeEnabled();

    // When
    await shopPage.removeProductFromCart(productName);

    // Then
    await expect(shopPage.productCartItem(productName)).toBeHidden();
    await expect(shopPage.emptyCartText).toBeVisible();
    await expect(shopPage.placeOrderBtn).toBeDisabled();
  });
});

test.describe("e2e tests", { tag: ["@without_storage_state", "@with_rest_api", "@e2e"] }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("place order", async ({ login, loginPage, topMenuFragment, leftMenuFragment, shopPage }) => {
    // Given
    const productsToOrder = [
      {
        productName: "Golden Kiwis",
        quantity: 3, // 0 <= quantity
        quantityByDropdown: false,
      },
      {
        productName: "Sun-Ripened Cherry Tomatoes",
        quantity: 5,
        quantityByDropdown: true,
      },
      {
        productName: "Jumbo Asparagus Spear",
        quantity: 1,
        quantityByDropdown: null,
      },
    ];
    const totalQuantity = 9;
    const totalPrice = "$27.81";

    await test.step("login and go to shop page", async () => {
      login();
      await expect(loginPage.page).toHaveURL(RELATIVE_URL);
      await topMenuFragment.openMenu();
      await leftMenuFragment.clickShopLink();
    });

    // When
    for (const product of productsToOrder) {
      await shopPage.addProductToCart(product.productName);

      // eslint-disable-next-line playwright/no-conditional-in-test
      if (product.quantityByDropdown === true || product.quantityByDropdown === null) {
        await shopPage.viewCart();
        // eslint-disable-next-line playwright/no-conditional-in-test
        if (product.quantity > 0) {
          await shopPage.changeQuantityOfProduct(product.productName, product.quantity);
        } else {
          await shopPage.removeProductFromCart(product.productName);
        }
        await shopPage.browseProducts();
      } else {
        for (let i = 0; i < product.quantity - 1; i++) {
          await shopPage.addProductToCart(product.productName);
        }
      }
    }

    await shopPage.viewCart();

    await expect(shopPage.shopHeaderTotalItems).toHaveText(`Total Items: ${totalQuantity}`);
    await expect(shopPage.shopHeaderTotalPrice).toHaveText(`Total Price: ${totalPrice}`);

    await shopPage.placeOrder();

    // Then
    await expect(shopPage.shopHeaderTotalItems).toHaveText("Total Items: 0");
    await expect(shopPage.shopHeaderTotalPrice).toHaveText("Total Price: $0.00");
    await expect(shopPage.afterOrderText).toBeVisible();
  });
});
