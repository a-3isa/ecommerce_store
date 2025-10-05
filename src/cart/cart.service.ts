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

  async updateCart(user: User, dto: UpdateCartDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { productId, quantity } = dto;

      const cartRepo = queryRunner.manager.getRepository(Cart);
      const cartItemRepo = queryRunner.manager.getRepository(CartItem);
      const productRepo = queryRunner.manager.getRepository(Product);

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
}
