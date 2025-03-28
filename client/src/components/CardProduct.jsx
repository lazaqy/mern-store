import React from 'react'
import DisplayPrice from '../utils/DisplayPrice';
import UrlConverter from '../utils/UrlConverter';
import { Link } from 'react-router-dom';
import { priceAfterDiscount } from '../utils/PriceAfterDiscount';
import AddToCartButton from './AddToCartButton';

const CardProduct = ({ item }) => {
  const url = `${UrlConverter(item.name)}-${item._id}`;

  return (
    <Link
      to={`/product/${url}`}
      className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white"
    >
      <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
        <img
          src={item.image[0]}
          alt={item.name}
          className="w-full h-full object-scale-down scale-125"
        />
      </div>
      <div className="flex items-center gap-1">
        <div className="rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50">
          10 min
        </div>
        <div>
          {Boolean(item.discount) && (
            <p className="text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full">
              {item.discount}% discount
            </p>
          )}
        </div>
      </div>
      <div className="px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2">
        {item.name}
      </div>
      <div className="w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base">
        {item.unit}
      </div>

      <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base">
        <div className="flex items-center gap-1">
          <div className="font-semibold">
            {DisplayPrice(priceAfterDiscount(item.price, item.discount))}
          </div>
        </div>
        <div className="">
          {item.stock == 0 ? (
            <p className="text-red-500 text-sm text-center">Out of stock</p>
          ) : (
            <AddToCartButton data={item} />
          )}
        </div>
      </div>
    </Link>
  );
}

export default CardProduct