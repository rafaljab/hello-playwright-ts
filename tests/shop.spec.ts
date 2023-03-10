import { test, expect } from '../base';

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
