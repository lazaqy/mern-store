export const priceAfterDiscount = (price, discount) => {
  return Math.round(price - (price * discount) / 100);
}