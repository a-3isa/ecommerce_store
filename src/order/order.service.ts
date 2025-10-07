import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { User } from 'src/user/entities/user.entity';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private dataSource: DataSource,
    private configService: ConfigService,
  ) {
    const stripeApiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeApiKey) {
      throw new Error('STRIPE_API_KEY is not defined in environment variables');
    }
    this.stripe = new Stripe(stripeApiKey);
  }

  async initiateOrder(cartId: string, user: User): Promise<Order> {
    if (!cartId) {
      throw new BadRequestException('Cart ID is required to create an order');
    }
    console.log('1');
    const cart = await this.cartRepository.findOne({
      where: { user },
      relations: [
        'items',
        'items.productVariant',
        'items.productVariant.product',
      ],
    });
    console.log('2');

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart not found or empty');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('3');

    try {
      const orderRepo = queryRunner.manager.getRepository(Order);
      const orderItemRepo = queryRunner.manager.getRepository(OrderItem);
      const cartRepo = queryRunner.manager.getRepository(Cart);

      // Create order
      const order = orderRepo.create({
        user: { id: user.id },
        total: cart.total,
        shippingAddress: user.shippingAddress?.[0] || '',
        billingInfo: user.billingInfo?.[0] || '',
      });

      await orderRepo.save(order);
      console.log('4');

      // Create order items from cart items
      const orderItems = cart.items.map((cartItem) => {
        if (!cartItem.productVariant.product) {
          throw new BadRequestException('Product not found for variant');
        }
        return orderItemRepo.create({
          order: { id: order.id },
          product: cartItem.productVariant.product,
          quantity: cartItem.quantity,
          price: cartItem.price,
        });
      });
      console.log(orderItems);
      await orderItemRepo.save(orderItems);
      console.log('s');

      // Clear cart items
      const cartItemRepo = queryRunner.manager.getRepository(CartItem);
      await cartItemRepo.remove(cart.items);
      cart.total = 0;
      cart.items = [];
      await cartRepo.save(cart);
      console.log('12');

      await queryRunner.commitTransaction();
      console.log('92');

      const result = await this.orderRepository.findOne({
        where: { id: order.id },
        relations: ['user', 'items', 'items.product'],
      });
      if (!result) {
        throw new Error('Order not found after creation');
      }
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async payStripe(user: User) {
    const cart = await this.cartRepository.findOne({
      where: { user },
      relations: ['items', 'items.productVariant'],
    });
    // console.log(cart);
    // console.log(cart?.id);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart not found or empty');
    }

    const session = await this.stripe.checkout.sessions.create({
      line_items: cart.items.map((item) => ({
        price_data: {
          currency: 'egp',
          unit_amount: Math.round(item.productVariant.price * 100), // Stripe expects cents
          product_data: {
            name: 'medo',
            // images: [item.productVariant.product.image],
          },
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'https://example.com/',
      cancel_url: 'https://bad.com/lander',
      client_reference_id: user.id,
      metadata: { cartId: cart.id },
    });

    return session.url;
  }

  // async payStripe(createOrderDto: CreateOrderDto, user: User) {
  //   const { items } = createOrderDto;
  //   const session = await this.stripe.checkout.sessions.create({
  //     line_items: items.map((item) => ({
  //       price_data: {
  //         currency: 'egp',
  //         unit_amount: Math.round(item.price * 100), // Stripe expects cents
  //         product_data: {
  //           name: item.name,
  //           images: [item.imageUrl],
  //         },
  //       },
  //       quantity: item.quantity,
  //     })),
  //     mode: 'payment',
  //     success_url: 'https://example.com/',
  //     cancel_url: 'https://bad.com/lander',
  //     client_reference_id: user.id,
  //     // metadata: { cartId },
  //   });

  //   return session.url;
  //   // }
  // }

  async handleWebhook(body: any, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error(
        'STRIPE_WEBHOOK_SECRET is not defined in environment variables',
      );
    }
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const cartId = session.metadata?.cartId;
      const userId = session.client_reference_id;

      console.log('heeeeeeeeeeeey');

      if (!cartId || !userId) {
        throw new BadRequestException(
          'Missing cartId or userId in webhook data',
        );
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      console.log(user);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const order = await this.initiateOrder(cartId, user);
      console.log('haaaaaaaaaaaaaaaow');
      order.status = OrderStatus.PAID;
      await this.orderRepository.save(order);
      console.log('meaaaaaaaaaaaaaaaw');
    }

    return { received: true };
  }

  async findAll(user: User): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user },
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user?: User): Promise<Order> {
    const where: any = { id };
    if (user) where.user = user;

    const order = await this.orderRepository.findOne({
      where,
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new BadRequestException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    user?: User,
  ): Promise<Order> {
    const order = await this.findOne(id, user);

    if (updateOrderDto.status) {
      this.validateStatusTransition(order.status, updateOrderDto.status);
    }

    Object.assign(order, updateOrderDto);
    await this.orderRepository.save(order);

    return this.findOne(id, user);
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID],
      [OrderStatus.PAID]: [OrderStatus.SHIPPED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  async remove(id: string, user?: User): Promise<void> {
    const order = await this.findOne(id, user);
    await this.orderRepository.remove(order);
  }
}
