
{(orderItem && !isLoading) ? (
    <NumberField value={orderItem.quantity}
      onChange={handleOrderItemCounter}
      minValue={0}
      maxValue={(orderItem.promo_code_item && 1) || orderItem.stock_quantity || 9999}
      isUpdateZeroValue
      inputReadonly />
  ) : (
    <AddToCartBtn product={product} isLoading={isLoading} onClicked={setIsLoading} />
  )
}
