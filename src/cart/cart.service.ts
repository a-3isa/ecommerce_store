import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UpdateCartOperationsDto, CartAction } from './dto/cart-operation.dto';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async getCartByUser(user: User): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user },
      relations: ['user', 'items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found for user');
    }

    return cart;
  }

  async updateCart(userId: string, dto: UpdateCartDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { productId, quantity } = dto;

      // Use repositories bound to this transaction
      const userRepo = queryRunner.manager.getRepository(User);
      const cartRepo = queryRunner.manager.getRepository(Cart);
      const cartItemRepo = queryRunner.manager.getRepository(CartItem);
      const productRepo = queryRunner.manager.getRepository(Product);

      // Step 1: Fetch user
      const user = await userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      // Step 2: Fetch or create cart
      const cart = await cartRepo.findOne({
        where: { user },
        relations: ['items', 'items.product'],
      });
      if (!cart) throw new NotFoundException('Cart not found');

      // Step 3: Fetch product
      const product = await productRepo.findOne({ where: { id: productId } });
      if (!product || !product.isActive)
        throw new NotFoundException('Product not found or inactive');

      if (product.stock < quantity)
        throw new BadRequestException('Insufficient stock');

      // Step 4: Find cart item
      let cartItem = await cartItemRepo.findOne({
        where: { cart, product },
        relations: ['product'],
      });

      if (quantity == 0 && cartItem) {
        await cartItemRepo.remove(cartItem);
        cartItem = null;
      } else {
        product.stock -= quantity;
        await productRepo.save(product);

        if (cartItem) {
          cartItem.quantity = quantity;
        } else {
          cartItem = cartItemRepo.create({
            cart,
            product,
            quantity,
          });
        }
      }

      // Step 5: Apply action (add/remove/set)
      // if (action === 'add') {

      // } else if (action === 'remove') {
      //   if (!cartItem) throw new NotFoundException('Item not in cart');
      //   cartItem.quantity -= quantity;

      //   // restore product stock
      //   product.stock += quantity;
      //   await productRepo.save(product);

      //   if (cartItem.quantity <= 0) {
      //     await cartItemRepo.remove(cartItem);
      //     cartItem = null;
      //   }
      // } else if (action === 'set') {
      //  else {
      //         const diff = quantity - (cartItem?.quantity || 0);
      //         if (diff > 0) {
      //           if (product.stock < diff)
      //             throw new BadRequestException('Insufficient stock');
      //           product.stock -= diff;
      //         } else {
      //           product.stock += Math.abs(diff);
      //         }
      //         await productRepo.save(product);

      //         if (!cartItem) {
      //           cartItem = cartItemRepo.create({ cart, product, quantity });
      //         } else {
      //           cartItem.quantity = quantity;
      //         }
      //       }
      // }

      // Step 6: Save updated item (if still exists)
      if (cartItem) {
        cartItem.price = cartItem.quantity * product.price;
        await cartItemRepo.save(cartItem);
      }

      // Step 7: Recalculate total
      const items = await cartItemRepo.find({
        where: { cart },
      });
      cart.total = items.reduce((sum, item) => sum + Number(item.price), 0);
      await cartRepo.save(cart);

      // ✅ Commit transaction (everything succeeded)
      await queryRunner.commitTransaction();

      // Return updated cart
      return cartRepo.findOne({
        where: { id: cart.id },
        relations: ['items', 'items.product'],
      });
    } catch (error) {
      // ❌ Rollback all changes if any step fails
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Always release the connection
      await queryRunner.release();
    }
  }

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  async updateCartItems(
    user: User,
    updateCartOperationsDto: UpdateCartOperationsDto,
  ): Promise<Cart> {
    const cart = await this.getCartByUser(user);

    for (const operation of updateCartOperationsDto.operations) {
      const { productId, action, quantity } = operation;

      const product = await this.productRepository.findOne({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      const cartItem = cart.items.find((item) => item.product.id === productId);

      if (action === CartAction.ADD) {
        if (cartItem) {
          cartItem.quantity += quantity || 1;
          await this.cartItemRepository.save(cartItem);
        } else {
          const newCartItem = this.cartItemRepository.create({
            cart,
            product,
            quantity: quantity || 1,
          });
          await this.cartItemRepository.save(newCartItem);
          cart.items.push(newCartItem);
        }
      } else if (action === CartAction.REMOVE) {
        if (cartItem) {
          await this.cartItemRepository.remove(cartItem);
          cart.items = cart.items.filter((item) => item.id !== cartItem.id);
        }
      } else if (action === CartAction.SET) {
        if (quantity == null) {
          throw new NotFoundException('Quantity is required for SET action');
        }
        if (quantity === 0) {
          if (cartItem) {
            await this.cartItemRepository.remove(cartItem);
            cart.items = cart.items.filter((item) => item.id !== cartItem.id);
          }
        } else {
          if (cartItem) {
            cartItem.quantity = quantity;
            await this.cartItemRepository.save(cartItem);
          } else {
            const newCartItem = this.cartItemRepository.create({
              cart,
              product,
              quantity,
            });
            await this.cartItemRepository.save(newCartItem);
            cart.items.push(newCartItem);
          }
        }
      }
    }

    return cart;
  }
}
