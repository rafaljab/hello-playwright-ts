import { test, expect } from '../base';

test('open empty cart', async ({ shopPageAuthenticated }) => {
  // Given
  const shopPage = shopPageAuthenticated;

  await expect(shopPage.emptyCartText).toBeHidden();

  // When
  await shopPage.viewCart();

  // Then
  await expect(shopPage.emptyCartText).toBeVisible();
  await expect(shopPage.placeOrderBtn).toBeDisabled();
});

const orders = [
  {
    productName: 'Cucumber',
    totalItems: 1,
    totalPrice: '$1.49'
  },
  {
    productName: 'Eggs',
    totalItems: 1,
    totalPrice: '$2.99'
  },
  {
    productName: 'Kiwi',
    totalItems: 1,
    totalPrice: '$2.49'
  }
];
for (const order of orders) {
  test(`add product to cart - ${order.productName} @with_rest_api`, async ({ shopPageAuthenticated }) => {
    // Given
    const shopPage = shopPageAuthenticated;

    await expect(shopPage.productCardBtn(order.productName)).toHaveAttribute('title', 'Add Product');
    await expect(shopPage.shopHeaderTotalItems).toHaveText('Total Items: 0');
    await expect(shopPage.shopHeaderTotalPrice).toHaveText('Total Price: $0.00');

    // When
    await shopPage.addProductToCart(order.productName);

    // Then
    await expect(shopPage.productCardBtn(order.productName)).toHaveAttribute('title', 'Product In Cart');
    await expect(shopPage.shopHeaderTotalItems).toHaveText(`Total Items: ${order.totalItems}`);
    await expect(shopPage.shopHeaderTotalPrice).toHaveText(`Total Price: ${order.totalPrice}`);
  });
}

test('add multiple products to cart @with_rest_api', async ({ shopPageAuthenticated }) => {
  // Given
  const shopPage = shopPageAuthenticated;

  await expect(shopPage.shopHeaderTotalItems).toHaveText('Total Items: 0');
  await expect(shopPage.shopHeaderTotalPrice).toHaveText('Total Price: $0.00');

  // When
  await shopPage.addProductToCart('Cucumber');
  await shopPage.addProductToCart('Eggs');
  await shopPage.addProductToCart('Kiwi');
  await shopPage.addProductToCart('Juice');

  // Then
  await expect(shopPage.shopHeaderTotalItems).toHaveText('Total Items: 4');
  await expect(shopPage.shopHeaderTotalPrice).toHaveText('Total Price: $10.96');
});

test('change number of product items in cart @with_rest_api', async ({ shopPageAuthenticated }) => {
  // Given
  const shopPage = shopPageAuthenticated;

  const productName = 'Kiwi';

  await shopPage.addProductToCart(productName);
  await shopPage.viewCart();

  await expect(shopPage.shopHeaderTotalItems).toHaveText('Total Items: 1');
  await expect(shopPage.shopHeaderTotalPrice).toHaveText('Total Price: $2.49');
  await expect(shopPage.productCartItemBadge(productName)).toHaveText('1');
  await expect(shopPage.productCartItemQuantityDropdown(productName)).toHaveText('1');
  await expect(shopPage.productCartItemSubtotalPrice(productName)).toHaveText('Subtotal Price: $2.49');

  // When
  await shopPage.changeQuantityOfProduct(productName, 10);

  // Then
  await expect(shopPage.shopHeaderTotalItems).toHaveText('Total Items: 10');
  await expect(shopPage.shopHeaderTotalPrice).toHaveText('Total Price: $24.90');
  await expect(shopPage.productCartItemBadge(productName)).toHaveText('10');
  await expect(shopPage.productCartItemQuantityDropdown(productName)).toHaveText('10');
  await expect(shopPage.productCartItemSubtotalPrice(productName)).toHaveText('Subtotal Price: $24.90');
});

test('remove product item from cart @with_rest_api', async ({ shopPageAuthenticated }) => {
  // Given
  const shopPage = shopPageAuthenticated;

  const productName = 'Kiwi';

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

test('place order @with_rest_api @e2e', async ({ shopPage }) => {
  // Given
  const productsToOrder = [
    {
      productName: 'Kiwi',
      quantity: 3, // 0 <= quantity
      quantityByDropdown: false
    },
    {
      productName: 'Juice',
      quantity: 5,
      quantityByDropdown: true
    },
    {
      productName: 'Cucumber',
      quantity: 1,
      quantityByDropdown: null
    }
  ];
  const totalQuantity = 9;
  const totalPrice = '$28.91';

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
      for (let i = 0; i < product.quantity-1; i++) {
        await shopPage.addProductToCart(product.productName);
      }
    }
  }

  await shopPage.viewCart();

  await expect(shopPage.shopHeaderTotalItems).toHaveText(`Total Items: ${totalQuantity}`);
  await expect(shopPage.shopHeaderTotalPrice).toHaveText(`Total Price: ${totalPrice}`);

  await shopPage.placeOrder();

  // Then
  await expect(shopPage.shopHeaderTotalItems).toHaveText('Total Items: 0');
  await expect(shopPage.shopHeaderTotalPrice).toHaveText('Total Price: $0.00');
  await expect(shopPage.afterOrderText).toBeVisible();
});
