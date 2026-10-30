import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { RoleGuard } from './roles.guard';
import { UserRole } from 'src/user/entities/user.entity';
import { AuthController } from './auth.controller';
import { UserController } from 'src/user/user.controller';
import { CategoryController } from 'src/category/category.controller';
import { ProductController } from 'src/product/product.controller';
import { ProductAttrValController } from 'src/product-attr-val/product-attr-val.controller';
import { ProductAttrVarController } from 'src/product-attr-var/product-attr-var.controller';
import { CouponController } from 'src/coupon/coupon.controller';
import { GiftController } from 'src/gift/gift.controller';

const contextFor = (user: unknown) =>
  ({
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  }) as unknown as ExecutionContext;

describe('RoleGuard', () => {
  const guard = new RoleGuard();

  it('lets admins through', () => {
    expect(guard.canActivate(contextFor({ role: UserRole.ADMIN }))).toBe(true);
  });

  it('refuses ordinary users', () => {
    expect(() =>
      guard.canActivate(contextFor({ role: UserRole.USER })),
    ).toThrow(ForbiddenException);
  });

  it('refuses requests without a user', () => {
    expect(() => guard.canActivate(contextFor(undefined))).toThrow(
      ForbiddenException,
    );
  });
});

describe('admin-only routes', () => {
  const adminOnly: [string, object, string[]][] = [
    ['AuthController', AuthController, ['adminRegister']],
    ['UserController', UserController, ['findAll', 'findOne', 'remove']],
    ['CategoryController', CategoryController, ['create', 'update', 'remove']],
    ['ProductController', ProductController, ['create', 'update', 'remove']],
    [
      'ProductAttrValController',
      ProductAttrValController,
      ['create', 'update', 'remove'],
    ],
    [
      'ProductAttrVarController',
      ProductAttrVarController,
      ['create', 'update', 'remove'],
    ],
    [
      'CouponController',
      CouponController,
      ['create', 'findAll', 'findOne', 'update', 'remove'],
    ],
    ['GiftController', GiftController, ['create', 'update', 'remove']],
  ];

  it.each(adminOnly)(
    '%s guards %p with RoleGuard',
    (_name, controller, methods) => {
      const proto = (controller as { prototype: Record<string, unknown> })
        .prototype;
      for (const method of methods) {
        expect(typeof proto[method]).toBe('function');
        const guards = Reflect.getMetadata(
          GUARDS_METADATA,
          proto[method] as object,
        ) as unknown[];
        expect(guards).toContain(RoleGuard);
      }
    },
  );
});
