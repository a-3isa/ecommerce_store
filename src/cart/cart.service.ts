import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';
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
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCartDto: CreateCartDto, userId: string): Promise<Cart> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const productIds = createCartDto.items.map((item) => item.productId);
    const products = await this.productRepository.findBy({
      id: In(productIds),
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Some products not found');
    }

    const cart = this.cartRepository.create({ user, items: [] });
    await this.cartRepository.save(cart);

    const cartItems = createCartDto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return this.cartItemRepository.create({
        cart,
        product,
        quantity: item.quantity,
      });
    });

    await this.cartItemRepository.save(cartItems);

    cart.items = cartItems;
    return cart;
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({
      relations: ['user', 'items', 'items.product'],
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

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);

    if (updateCartDto.items) {
      // Remove existing items
      await this.cartItemRepository.delete({ cart: { id: cart.id } });

      const productIds = updateCartDto.items.map((item) => item.productId);
      const products = await this.productRepository.findBy({
        id: In(productIds),
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException('Some products not found');
      }

      const cartItems = updateCartDto.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return this.cartItemRepository.create({
          cart,
          product,
          quantity: item.quantity,
        });
      });

      await this.cartItemRepository.save(cartItems);
      cart.items = cartItems;
    }

    return this.cartRepository.save(cart);
  }

  async remove(id: string): Promise<void> {
    const cart = await this.findOne(id);
    await this.cartRepository.remove(cart);
  }

  async getCartByUser(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      throw new NotFoundException(`Cart for user ID ${userId} not found`);
    }
    return cart;
  }
}
