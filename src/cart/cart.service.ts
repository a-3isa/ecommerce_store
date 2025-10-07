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
import { User } from 'src/user/entities/user.entity';
import { ProductVariant } from 'src/product-attr-var/entities/product-attr-var.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private dataSource: DataSource,
    // @InjectRepository(CartItem)
    // @InjectRepository(ProductVariant)
    // private cartItemRepository: Repository<CartItem>,
    // @InjectRepository(Product)
    // private productRepository: Repository<Product>,
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
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { productVarId, quantity } = dto;

      const cartRepo = queryRunner.manager.getRepository(Cart);
      const cartItemRepo = queryRunner.manager.getRepository(CartItem);
      const productAttrVarRepo =
        queryRunner.manager.getRepository(ProductVariant);

      // Step 2: Fetch or create cart
      let cart = await cartRepo.findOne({
        where: { user },
        relations: ['items', 'items.productVariant'],
      });
      if (!cart) {
        cart = cartRepo.create({
          user,
          total: 0,
        });
        await cartRepo.save(cart);
      }
      // console.log(cart);
      // Step 3: Fetch px roduct variant
      const productVariant = await productAttrVarRepo.findOne({
        where: { id: productVarId },
      });
      if (!productVariant) {
        throw new NotFoundException('Product not found or inactive');
      }

      // Check stock availability (do not subtract from stock here; only check)
      if (productVariant.stock < quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      // Step 4: Find existing cart item
      let cartItem = await cartItemRepo.findOne({
        where: {
          // cart: cart,
          productVariant: { id: productVariant.id },
        },
      });

      // console.log(cartItem);

      if (quantity === 0 && cartItem) {
        await cartItemRepo.remove(cartItem);
        cartItem = null;
      } else if (quantity > 0) {
        if (cartItem) {
          // console.log(cartItem.quantity);
          cartItem.quantity = quantity;
          // console.log(cartItem.quantity);
        } else {
          cartItem = cartItemRepo.create({
            quantity: quantity,
            cart: { id: cart.id },
            productVariant: { id: productVariant.id },
          });
          // console.log(cartItem);
        }
      } else {
        // Invalid quantity (e.g., negative); throw error or handle as per validation
        throw new BadRequestException(
          'Quantity must be a positive number or zero',
        );
      }

      // Step 6: Save updated item (if still exists)
      if (cartItem) {
        cartItem.price = cartItem.quantity * productVariant.price;
        // console.log(cartItem);
        await cartItemRepo.save(cartItem);
      }

      // Step 7: Recalculate total
      const items = await cartItemRepo.find({
        where: { cart: { id: cart.id } },
      });
      // console.log(items);
      cart.items = items;
      cart.total = items.reduce((sum, item) => sum + Number(item.price), 0);
      await cartRepo.save(cart);

      // ✅ Commit transaction (everything succeeded)
      await queryRunner.commitTransaction();

      // Return updated cart
    } catch (error) {
      // ❌ Rollback all changes if any step fails
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Always release the connection
      await queryRunner.release();
    }
    return this.cartRepository.findOne({
      where: { user },
      relations: ['items', 'items.productVariant'],
    });
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
