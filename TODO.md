# Coupon Implementation TODO

## 1. Define Coupon Entity

- [x] Add fields: code, discountType, discountValue, expirationDate, usageLimit, usedCount, minOrderValue, isActive, type (PRODUCT/ORDER), applicableProducts (ManyToMany to Product for product-level)

## 2. Update DTOs

- [x] Implement CreateCouponDto with validation (class-validator)
- [x] Update UpdateCouponDto (extends PartialType)

## 3. Implement Coupon Service

- [x] CRUD methods with repository injection
- [x] Validation methods: isExpired, isUsageLimitReached, isMinOrderValueMet
- [x] Discount calculation methods: calculateProductDiscount, calculateOrderDiscount
- [x] Method to apply coupon (validate and calculate discount)

## 4. Update Coupon Module

- [x] Import TypeOrmModule.forFeature([Coupon])

## 5. Modify Order Service for Integration

- [x] Add couponCode parameter to payStripe method
- [x] Validate coupon in payStripe
- [x] Apply discounts to line_items in Stripe session
- [x] Update order total with discount in webhook

## 6. Add Coupon Usage Tracking

- [x] Increment usedCount when coupon is applied in checkout

## 7. Integrate Validation in Checkout

- [x] Ensure coupon is validated before creating Stripe session
