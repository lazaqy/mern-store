const DisplayPrice = (price) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price);
};

export default DisplayPrice;