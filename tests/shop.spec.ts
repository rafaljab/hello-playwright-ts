import { test, expect } from '../base';

test('open empty cart', async ({ shopPageAuthenticated }) => {
  // Given
  const shopPage = shopPageAuthenticated;

  await expect(shopPage.emptyCartText).not.toBeVisible();

  // When
  await shopPage.viewCart();

  // Then
  await expect(shopPage.emptyCartText).toBeVisible();
  await expect(shopPage.placeOrderBtn).toBeDisabled();
});

const orders = [
  {
    productName: 'iPhone 9',
    totalItems: 1,
    totalPrice: '$549.00'
  },
  {
    productName: 'iPhone X',
    totalItems: 1,
    totalPrice: '$899.00'
  },
  {
    productName: 'Samsung Universe 9',
    totalItems: 1,
    totalPrice: '$1,249.00'
  }
];
for (const order of orders) {
  test(`add product to cart - ${order.productName}`, async ({ shopPageAuthenticated }) => {
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

test('add multiple products to cart', async ({ shopPageAuthenticated }) => {
  // Given
  const shopPage = shopPageAuthenticated;

  await expect(shopPage.shopHeaderTotalItems).toHaveText('Total Items: 0');
  await expect(shopPage.shopHeaderTotalPrice).toHaveText('Total Price: $0.00');

  // When
  await shopPage.addProductToCart('iPhone 9');
  await shopPage.addProductToCart('iPhone X');
  await shopPage.addProductToCart('Samsung Universe 9');
  await shopPage.addProductToCart('iPhone 9');

  // Then
  await expect(shopPage.shopHeaderTotalItems).toHaveText('Total Items: 4');
  await expect(shopPage.shopHeaderTotalPrice).toHaveText('Total Price: $3,246.00');
});

test('change number of product items in cart', async ({ shopPageAuthenticated }) => {
  // Given
  const shopPage = shopPageAuthenticated;

  const productName = 'iPhone 9';

  await shopPage.addProductToCart(productName);
  await shopPage.viewCart();

  await expect(shopPage.shopHeaderTotalItems).toHaveText('Total Items: 1');
  await expect(shopPage.shopHeaderTotalPrice).toHaveText('Total Price: $549.00');
  await expect(shopPage.productCartItemBadge(productName)).toHaveText('1');
  await expect(shopPage.productCartItemQuantityDropdown(productName)).toHaveText('1');
  await expect(shopPage.productCartItemSubtotalPrice(productName)).toHaveText('Subtotal Price: $549.00');

  // When
  await shopPage.changeQuantityOfProduct(productName, 10);

  // Then
  await expect(shopPage.shopHeaderTotalItems).toHaveText('Total Items: 10');
  await expect(shopPage.shopHeaderTotalPrice).toHaveText('Total Price: $5,490.00');
  await expect(shopPage.productCartItemBadge(productName)).toHaveText('10');
  await expect(shopPage.productCartItemQuantityDropdown(productName)).toHaveText('10');
  await expect(shopPage.productCartItemSubtotalPrice(productName)).toHaveText('Subtotal Price: $5,490.00');
});

test('remove product item from cart', async ({ shopPageAuthenticated }) => {
  // Given
  const shopPage = shopPageAuthenticated;

  const productName = 'iPhone 9';

  await shopPage.addProductToCart(productName);
  await shopPage.viewCart();

  await expect(shopPage.productCartItem(productName)).toBeVisible();
  await expect(shopPage.emptyCartText).not.toBeVisible();
  await expect(shopPage.placeOrderBtn).toBeEnabled();

  // When
  await shopPage.removeProductFromCart(productName);

  // Then
  await expect(shopPage.productCartItem(productName)).not.toBeVisible();
  await expect(shopPage.emptyCartText).toBeVisible();
  await expect(shopPage.placeOrderBtn).toBeDisabled();
});

test('place order', async ({ shopPage }) => {
  // Given
  const productsToOrder = [
    {
      productName: 'iPhone 9',
      quantity: 3, // 0 <= quantity
      quantityByDropdown: false
    },
    {
      productName: 'iPhone X',
      quantity: 5,
      quantityByDropdown: true
    },
    {
      productName: 'Samsung Universe 9',
      quantity: 1,
      quantityByDropdown: null
    }
  ]
  const totalQuantity = 9;
  const totalPrice = '$7,391.00';

  // When
  for (const product of productsToOrder) {
    await shopPage.addProductToCart(product.productName);

    if (product.quantityByDropdown === true || product.quantityByDropdown === null) {
      await shopPage.viewCart();
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
