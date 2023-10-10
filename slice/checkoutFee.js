// Переменные

// item - цена одного элемента (например одна пицца)
// position - сумма айтемов (quantity * item)
// baseSum - общая сумма оплаты (все позиции + налог + сервисный сбор)

// Расчеты сумм оплаты:
// *Фии - процент, Чай - процент

// Базовая оплата:

baseAndFee = baseSum + (baseSum * fee)
baseAndFeeAndTip = baseAndFee + (baseAndFee * tip)

// Оплата по айтемам

item = position / quantity
baseSum = n * item
baseAndFee = baseSum + (baseSum * fee)
baseAndFeeAndTip = baseAndFee + (baseAndFee * tip)

// Раздельная

// peopleAtTable - кол-во людей за столом
// peopleToPay - кол-во людей, которые будут платить

baseSumAfterDivide = baseSum * (peopleToPay / peopleAtTable)
baseAndFee = baseSum + (baseSum * fee)
baseAndFeeAndTip = baseAndFee + (baseAndFee * tip)

// Кастомная

// baseSem - вводим свою

baseAndFee = baseSum + (baseSum * fee)
baseAndFeeAndTip = baseAndFee + (baseAndFee * tip)

// Округление происходит только при выводе на экран baseAndFee или baseAndFeeAndTip

