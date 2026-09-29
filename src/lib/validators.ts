// ─── Input Validation Helpers ────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/** Validates an Indian phone number (10 digits) */
export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/[\s\-+()]/g, ''));
}

/** Validates an email address */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Validates a 6-digit Indian PIN code */
export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode.trim());
}

/** Validates rating is between 1 and 5 */
export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/** Validates a discount percentage (1-99) */
export function isValidDiscountPercent(percent: number): boolean {
  return typeof percent === 'number' && percent > 0 && percent < 100;
}

/** Sanitizes a string: trims + limits length */
export function sanitizeString(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

/** Validates an order placement request body */
export function validateOrderBody(body: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];

  if (!sanitizeString(body.customerName)) errors.push('Customer name is required.');
  if (!body.phone || !isValidPhone(String(body.phone))) errors.push('A valid 10-digit Indian phone number is required.');
  if (!body.email || !isValidEmail(String(body.email))) errors.push('A valid email address is required.');
  if (!sanitizeString(body.deliveryAddress)) errors.push('Delivery address is required.');
  if (!sanitizeString(body.city)) errors.push('City is required.');
  if (!sanitizeString(body.state)) errors.push('State is required.');
  if (!body.pincode || !isValidPincode(String(body.pincode))) errors.push('A valid 6-digit PIN code is required.');

  if (!Array.isArray(body.items) || (body.items as unknown[]).length === 0) {
    errors.push('Your cart cannot be empty.');
  }

  return { valid: errors.length === 0, errors };
}

/** Validates a product creation/update body */
export function validateProductBody(body: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];

  if (!sanitizeString(body.name)) errors.push('Product name is required.');
  if (!body.price || Number(body.price) <= 0) errors.push('A valid price (> 0) is required.');
  if (body.salePrice && Number(body.salePrice) >= Number(body.price)) {
    errors.push('Sale price must be less than the original price.');
  }
  if (!sanitizeString(body.category)) errors.push('Category is required.');
  if (body.stock !== undefined && Number(body.stock) < 0) errors.push('Stock cannot be negative.');

  return { valid: errors.length === 0, errors };
}

/** Validates a review submission body */
export function validateReviewBody(body: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];

  if (!sanitizeString(body.productId)) errors.push('Product ID is required.');
  if (!sanitizeString(body.customerName, 100)) errors.push('Customer name is required.');
  const rating = Number(body.rating);
  if (!isValidRating(rating)) errors.push('Rating must be a whole number between 1 and 5.');
  if (!body.comment || String(body.comment).trim().length < 10) {
    errors.push('Review comment must be at least 10 characters.');
  }

  return { valid: errors.length === 0, errors };
}

/** Validates a discount creation body */
export function validateDiscountBody(body: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];

  if (!sanitizeString(body.title)) errors.push('Discount title is required.');
  if (!isValidDiscountPercent(Number(body.discountPercent))) {
    errors.push('Discount percent must be between 1 and 99.');
  }

  const validTargetTypes = ['product', 'category', 'all'];
  if (!validTargetTypes.includes(String(body.targetType))) {
    errors.push("Target type must be one of: 'product', 'category', or 'all'.");
  }
  if (
    (body.targetType === 'product' || body.targetType === 'category') &&
    !sanitizeString(body.targetId)
  ) {
    errors.push('Target ID is required for product or category discounts.');
  }

  if (body.startDate && isNaN(Date.parse(String(body.startDate)))) {
    errors.push('Invalid start date format.');
  }
  if (body.endDate && isNaN(Date.parse(String(body.endDate)))) {
    errors.push('Invalid end date format.');
  }

  return { valid: errors.length === 0, errors };
}
