import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductService } from './product/product.service';
import { ProductAttrVarService } from './product-attr-var/product-attr-var.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category/entities/category.entity';
import { Product } from './product/entities/product.entity';
import { ProductAttribute } from './product-attr/entities/product-attr.entity';
import { ProductAttributeValue } from './product-attr-val/entities/product-attr-val.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const productService = app.get(ProductService);
  const variantService = app.get(ProductAttrVarService);

  const categoryRepo = app.get<Repository<Category>>(
    getRepositoryToken(Category),
  );
  const attrRepo = app.get<Repository<ProductAttribute>>(
    getRepositoryToken(ProductAttribute),
  );
  const attrValRepo = app.get<Repository<ProductAttributeValue>>(
    getRepositoryToken(ProductAttributeValue),
  );

  // Create categories
  let clothingCategory: Category | null = null;
  try {
    clothingCategory = await categoryRepo.save({
      name: 'Clothing',
      slug: 'clothing',
      description: 'Clothing category',
    });
    console.log('Clothing category created');
  } catch {
    clothingCategory = await categoryRepo.findOne({
      where: { slug: 'clothing' },
    });
    console.log('Clothing category found');
  }

  let electronicsCategory: Category | null = null;
  try {
    electronicsCategory = await categoryRepo.save({
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronics category',
    });
    console.log('Electronics category created');
  } catch {
    electronicsCategory = await categoryRepo.findOne({
      where: { slug: 'electronics' },
    });
    console.log('Electronics category found');
  }

  let booksCategory: Category | null = null;
  try {
    booksCategory = await categoryRepo.save({
      name: 'Books',
      slug: 'books',
      description: 'Books category',
    });
    console.log('Books category created');
  } catch {
    booksCategory = await categoryRepo.findOne({
      where: { slug: 'books' },
    });
    console.log('Books category found');
  }

  let homeGardenCategory: Category | null = null;
  try {
    homeGardenCategory = await categoryRepo.save({
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home & Garden category',
    });
    console.log('Home & Garden category created');
  } catch {
    homeGardenCategory = await categoryRepo.findOne({
      where: { slug: 'home-garden' },
    });
    console.log('Home & Garden category found');
  }

  let sportsCategory: Category | null = null;
  try {
    sportsCategory = await categoryRepo.save({
      name: 'Sports',
      slug: 'sports',
      description: 'Sports category',
    });
    console.log('Sports category created');
  } catch {
    sportsCategory = await categoryRepo.findOne({
      where: { slug: 'sports' },
    });
    console.log('Sports category found');
  }

  // Create attributes
  let colorAttr: ProductAttribute | null = null;
  try {
    colorAttr = await attrRepo.save({
      displayName: 'Color',
    });
    console.log('Color attribute created');
  } catch {
    colorAttr = await attrRepo.findOne({ where: { displayName: 'Color' } });
    console.log('Color attribute found');
  }

  let sizeAttr: ProductAttribute | null = null;
  try {
    sizeAttr = await attrRepo.save({
      displayName: 'Size',
    });
    console.log('Size attribute created');
  } catch {
    sizeAttr = await attrRepo.findOne({ where: { displayName: 'Size' } });
    console.log('Size attribute found');
  }

  let brandAttr: ProductAttribute | null = null;
  try {
    brandAttr = await attrRepo.save({
      displayName: 'Brand',
    });
    console.log('Brand attribute created');
  } catch {
    brandAttr = await attrRepo.findOne({ where: { displayName: 'Brand' } });
    console.log('Brand attribute found');
  }

  let materialAttr: ProductAttribute | null = null;
  try {
    materialAttr = await attrRepo.save({
      displayName: 'Material',
    });
    console.log('Material attribute created');
  } catch {
    materialAttr = await attrRepo.findOne({
      where: { displayName: 'Material' },
    });
    console.log('Material attribute found');
  }

  let weightAttr: ProductAttribute | null = null;
  try {
    weightAttr = await attrRepo.save({
      displayName: 'Weight',
    });
    console.log('Weight attribute created');
  } catch {
    weightAttr = await attrRepo.findOne({ where: { displayName: 'Weight' } });
    console.log('Weight attribute found');
  }

  // Create attribute values
  let redVal: ProductAttributeValue | null = null;
  try {
    redVal = await attrValRepo.save({
      attr: colorAttr!,
      value: 'Red',
    });
    console.log('Red value created');
  } catch {
    redVal = await attrValRepo.findOne({
      where: { attr: { id: colorAttr!.id }, value: 'Red' },
    });
    console.log('Red value found');
  }

  let blueVal: ProductAttributeValue | null = null;
  try {
    blueVal = await attrValRepo.save({
      attr: colorAttr!,
      value: 'Blue',
    });
    console.log('Blue value created');
  } catch {
    blueVal = await attrValRepo.findOne({
      where: { attr: { id: colorAttr!.id }, value: 'Blue' },
    });
    console.log('Blue value found');
  }

  let sVal: ProductAttributeValue | null = null;
  try {
    sVal = await attrValRepo.save({
      attr: sizeAttr!,
      value: 'S',
    });
    console.log('S value created');
  } catch {
    sVal = await attrValRepo.findOne({
      where: { attr: { id: sizeAttr!.id }, value: 'S' },
    });
    console.log('S value found');
  }

  let mVal: ProductAttributeValue | null = null;
  try {
    mVal = await attrValRepo.save({
      attr: sizeAttr!,
      value: 'M',
    });
    console.log('M value created');
  } catch {
    mVal = await attrValRepo.findOne({
      where: { attr: { id: sizeAttr!.id }, value: 'M' },
    });
    console.log('M value found');
  }

  let appleVal: ProductAttributeValue | null = null;
  try {
    appleVal = await attrValRepo.save({
      attr: brandAttr!,
      value: 'Apple',
    });
    console.log('Apple value created');
  } catch {
    appleVal = await attrValRepo.findOne({
      where: { attr: { id: brandAttr!.id }, value: 'Apple' },
    });
    console.log('Apple value found');
  }

  let samsungVal: ProductAttributeValue | null = null;
  try {
    samsungVal = await attrValRepo.save({
      attr: brandAttr!,
      value: 'Samsung',
    });
    console.log('Samsung value created');
  } catch {
    samsungVal = await attrValRepo.findOne({
      where: { attr: { id: brandAttr!.id }, value: 'Samsung' },
    });
    console.log('Samsung value found');
  }

  let greenVal: ProductAttributeValue | null = null;
  try {
    greenVal = await attrValRepo.save({
      attr: colorAttr!,
      value: 'Green',
    });
    console.log('Green value created');
  } catch {
    greenVal = await attrValRepo.findOne({
      where: { attr: { id: colorAttr!.id }, value: 'Green' },
    });
    console.log('Green value found');
  }

  let blackVal: ProductAttributeValue | null = null;
  try {
    blackVal = await attrValRepo.save({
      attr: colorAttr!,
      value: 'Black',
    });
    console.log('Black value created');
  } catch {
    blackVal = await attrValRepo.findOne({
      where: { attr: { id: colorAttr!.id }, value: 'Black' },
    });
    console.log('Black value found');
  }

  let lVal: ProductAttributeValue | null = null;
  try {
    lVal = await attrValRepo.save({
      attr: sizeAttr!,
      value: 'L',
    });
    console.log('L value created');
  } catch {
    lVal = await attrValRepo.findOne({
      where: { attr: { id: sizeAttr!.id }, value: 'L' },
    });
    console.log('L value found');
  }

  let xlVal: ProductAttributeValue | null = null;
  try {
    xlVal = await attrValRepo.save({
      attr: sizeAttr!,
      value: 'XL',
    });
    console.log('XL value created');
  } catch {
    xlVal = await attrValRepo.findOne({
      where: { attr: { id: sizeAttr!.id }, value: 'XL' },
    });
    console.log('XL value found');
  }

  let nikeVal: ProductAttributeValue | null = null;
  try {
    nikeVal = await attrValRepo.save({
      attr: brandAttr!,
      value: 'Nike',
    });
    console.log('Nike value created');
  } catch {
    nikeVal = await attrValRepo.findOne({
      where: { attr: { id: brandAttr!.id }, value: 'Nike' },
    });
    console.log('Nike value found');
  }

  let adidasVal: ProductAttributeValue | null = null;
  try {
    adidasVal = await attrValRepo.save({
      attr: brandAttr!,
      value: 'Adidas',
    });
    console.log('Adidas value created');
  } catch {
    adidasVal = await attrValRepo.findOne({
      where: { attr: { id: brandAttr!.id }, value: 'Adidas' },
    });
    console.log('Adidas value found');
  }

  let cottonVal: ProductAttributeValue | null = null;
  try {
    cottonVal = await attrValRepo.save({
      attr: materialAttr!,
      value: 'Cotton',
    });
    console.log('Cotton value created');
  } catch {
    cottonVal = await attrValRepo.findOne({
      where: { attr: { id: materialAttr!.id }, value: 'Cotton' },
    });
    console.log('Cotton value found');
  }

  let leatherVal: ProductAttributeValue | null = null;
  try {
    leatherVal = await attrValRepo.save({
      attr: materialAttr!,
      value: 'Leather',
    });
    console.log('Leather value created');
  } catch {
    leatherVal = await attrValRepo.findOne({
      where: { attr: { id: materialAttr!.id }, value: 'Leather' },
    });
    console.log('Leather value found');
  }

  let plasticVal: ProductAttributeValue | null = null;
  try {
    plasticVal = await attrValRepo.save({
      attr: materialAttr!,
      value: 'Plastic',
    });
    console.log('Plastic value created');
  } catch {
    plasticVal = await attrValRepo.findOne({
      where: { attr: { id: materialAttr!.id }, value: 'Plastic' },
    });
    console.log('Plastic value found');
  }

  let woodVal: ProductAttributeValue | null = null;
  try {
    woodVal = await attrValRepo.save({
      attr: materialAttr!,
      value: 'Wood',
    });
    console.log('Wood value created');
  } catch {
    woodVal = await attrValRepo.findOne({
      where: { attr: { id: materialAttr!.id }, value: 'Wood' },
    });
    console.log('Wood value found');
  }

  let lightVal: ProductAttributeValue | null = null;
  try {
    lightVal = await attrValRepo.save({
      attr: weightAttr!,
      value: 'Light',
    });
    console.log('Light value created');
  } catch {
    lightVal = await attrValRepo.findOne({
      where: { attr: { id: weightAttr!.id }, value: 'Light' },
    });
    console.log('Light value found');
  }

  let mediumVal: ProductAttributeValue | null = null;
  try {
    mediumVal = await attrValRepo.save({
      attr: weightAttr!,
      value: 'Medium',
    });
    console.log('Medium value created');
  } catch {
    mediumVal = await attrValRepo.findOne({
      where: { attr: { id: weightAttr!.id }, value: 'Medium' },
    });
    console.log('Medium value found');
  }

  // Products data
  const productsData = [
    {
      name: 'T-Shirt',
      slug: 't-shirt',
      description: 'A nice t-shirt',
      sku: 'TSHIRT001',
      barcode: '123456789',
      categoryId: clothingCategory!.id,
      attributesId: [colorAttr!.id, sizeAttr!.id],
      attributesValId: [
        redVal!.id,
        blueVal!.id,
        greenVal!.id,
        sVal!.id,
        mVal!.id,
        lVal!.id,
        xlVal!.id,
      ],
      variants: [
        {
          price: 20,
          attributeValueIds: [redVal!.id, sVal!.id],
          stock: 10,
        },
        {
          price: 20,
          attributeValueIds: [blueVal!.id, mVal!.id],
          stock: 15,
        },
        {
          price: 22,
          attributeValueIds: [greenVal!.id, lVal!.id],
          stock: 12,
        },
        {
          price: 22,
          attributeValueIds: [redVal!.id, xlVal!.id],
          stock: 8,
        },
        {
          price: 21,
          attributeValueIds: [blueVal!.id, lVal!.id],
          stock: 14,
        },
      ],
    },
    {
      name: 'Jeans',
      slug: 'jeans',
      description: 'Comfortable jeans',
      sku: 'JEANS001',
      barcode: '123456790',
      categoryId: clothingCategory!.id,
      attributesId: [colorAttr!.id, sizeAttr!.id],
      attributesValId: [
        blueVal!.id,
        blackVal!.id,
        sVal!.id,
        mVal!.id,
        lVal!.id,
        xlVal!.id,
      ],
      variants: [
        {
          price: 50,
          attributeValueIds: [blueVal!.id, sVal!.id],
          stock: 20,
        },
        {
          price: 50,
          attributeValueIds: [blueVal!.id, mVal!.id],
          stock: 25,
        },
        {
          price: 52,
          attributeValueIds: [blackVal!.id, lVal!.id],
          stock: 18,
        },
        {
          price: 52,
          attributeValueIds: [blueVal!.id, xlVal!.id],
          stock: 22,
        },
        {
          price: 51,
          attributeValueIds: [blackVal!.id, mVal!.id],
          stock: 16,
        },
      ],
    },
    {
      name: 'iPhone',
      slug: 'iphone',
      description: 'Latest iPhone',
      sku: 'IPHONE001',
      barcode: '123456791',
      categoryId: electronicsCategory!.id,
      attributesId: [colorAttr!.id, brandAttr!.id],
      attributesValId: [redVal!.id, blueVal!.id, appleVal!.id],
      variants: [
        {
          price: 1000,
          attributeValueIds: [redVal!.id, appleVal!.id],
          stock: 5,
        },
        {
          price: 1000,
          attributeValueIds: [blueVal!.id, appleVal!.id],
          stock: 8,
        },
      ],
    },
    {
      name: 'Samsung Galaxy',
      slug: 'samsung-galaxy',
      description: 'Samsung smartphone',
      sku: 'GALAXY001',
      barcode: '123456792',
      categoryId: electronicsCategory!.id,
      attributesId: [colorAttr!.id, brandAttr!.id],
      attributesValId: [blueVal!.id, samsungVal!.id],
      variants: [
        {
          price: 800,
          attributeValueIds: [blueVal!.id, samsungVal!.id],
          stock: 10,
        },
      ],
    },
    {
      name: 'Laptop',
      slug: 'laptop',
      description: 'Powerful laptop',
      sku: 'LAPTOP001',
      barcode: '123456793',
      categoryId: electronicsCategory!.id,
      attributesId: [brandAttr!.id],
      attributesValId: [appleVal!.id],
      variants: [
        {
          price: 1500,
          attributeValueIds: [appleVal!.id],
          stock: 3,
        },
      ],
    },
    {
      name: 'Headphones',
      slug: 'headphones',
      description: 'Noise cancelling headphones',
      sku: 'HEAD001',
      barcode: '123456794',
      categoryId: electronicsCategory!.id,
      attributesId: [colorAttr!.id, brandAttr!.id],
      attributesValId: [redVal!.id, blueVal!.id, appleVal!.id, samsungVal!.id],
      variants: [
        {
          price: 200,
          attributeValueIds: [redVal!.id, appleVal!.id],
          stock: 12,
        },
        {
          price: 200,
          attributeValueIds: [blueVal!.id, samsungVal!.id],
          stock: 15,
        },
      ],
    },
    {
      name: 'Sneakers',
      slug: 'sneakers',
      description: 'Comfortable sneakers',
      sku: 'SNEAK001',
      barcode: '123456795',
      categoryId: clothingCategory!.id,
      attributesId: [colorAttr!.id, sizeAttr!.id],
      attributesValId: [
        redVal!.id,
        blueVal!.id,
        blackVal!.id,
        sVal!.id,
        mVal!.id,
        lVal!.id,
      ],
      variants: [
        {
          price: 80,
          attributeValueIds: [redVal!.id, sVal!.id],
          stock: 20,
        },
        {
          price: 80,
          attributeValueIds: [blueVal!.id, mVal!.id],
          stock: 18,
        },
        {
          price: 82,
          attributeValueIds: [blackVal!.id, lVal!.id],
          stock: 15,
        },
        {
          price: 81,
          attributeValueIds: [redVal!.id, lVal!.id],
          stock: 12,
        },
      ],
    },
    {
      name: 'Tablet',
      slug: 'tablet',
      description: 'Portable tablet',
      sku: 'TAB001',
      barcode: '123456796',
      categoryId: electronicsCategory!.id,
      attributesId: [brandAttr!.id],
      attributesValId: [appleVal!.id, samsungVal!.id],
      variants: [
        {
          price: 600,
          attributeValueIds: [appleVal!.id],
          stock: 7,
        },
        {
          price: 500,
          attributeValueIds: [samsungVal!.id],
          stock: 10,
        },
      ],
    },
    {
      name: 'Watch',
      slug: 'watch',
      description: 'Smart watch',
      sku: 'WATCH001',
      barcode: '123456797',
      categoryId: electronicsCategory!.id,
      attributesId: [colorAttr!.id, brandAttr!.id],
      attributesValId: [redVal!.id, blueVal!.id, appleVal!.id],
      variants: [
        {
          price: 400,
          attributeValueIds: [redVal!.id, appleVal!.id],
          stock: 5,
        },
        {
          price: 400,
          attributeValueIds: [blueVal!.id, appleVal!.id],
          stock: 6,
        },
      ],
    },
    {
      name: 'Jacket',
      slug: 'jacket',
      description: 'Warm jacket',
      sku: 'JACKET001',
      barcode: '123456798',
      categoryId: clothingCategory!.id,
      attributesId: [colorAttr!.id, sizeAttr!.id],
      attributesValId: [blueVal!.id, sVal!.id, mVal!.id],
      variants: [
        {
          price: 120,
          attributeValueIds: [blueVal!.id, sVal!.id],
          stock: 8,
        },
        {
          price: 120,
          attributeValueIds: [blueVal!.id, mVal!.id],
          stock: 9,
        },
      ],
    },
    {
      name: 'Mouse',
      slug: 'mouse',
      description: 'Wireless mouse',
      sku: 'MOUSE001',
      barcode: '123456799',
      categoryId: electronicsCategory!.id,
      attributesId: [colorAttr!.id, brandAttr!.id],
      attributesValId: [redVal!.id, blueVal!.id, appleVal!.id, samsungVal!.id],
      variants: [
        {
          price: 50,
          attributeValueIds: [redVal!.id, appleVal!.id],
          stock: 25,
        },
        {
          price: 50,
          attributeValueIds: [blueVal!.id, samsungVal!.id],
          stock: 30,
        },
      ],
    },
    {
      name: 'Book',
      slug: 'book',
      description: 'An interesting book',
      sku: 'BOOK001',
      barcode: '123456800',
      categoryId: booksCategory!.id,
      attributesId: [brandAttr!.id, materialAttr!.id],
      attributesValId: [appleVal!.id, cottonVal!.id],
      variants: [
        {
          price: 15,
          attributeValueIds: [appleVal!.id, cottonVal!.id],
          stock: 50,
        },
      ],
    },
    {
      name: 'Sofa',
      slug: 'sofa',
      description: 'Comfortable sofa',
      sku: 'SOFA001',
      barcode: '123456801',
      categoryId: homeGardenCategory!.id,
      attributesId: [colorAttr!.id, materialAttr!.id, sizeAttr!.id],
      attributesValId: [greenVal!.id, leatherVal!.id, lVal!.id],
      variants: [
        {
          price: 500,
          attributeValueIds: [greenVal!.id, leatherVal!.id, lVal!.id],
          stock: 5,
        },
      ],
    },
    {
      name: 'Bicycle',
      slug: 'bicycle',
      description: 'Fast bicycle',
      sku: 'BIKE001',
      barcode: '123456802',
      categoryId: sportsCategory!.id,
      attributesId: [colorAttr!.id, brandAttr!.id, weightAttr!.id],
      attributesValId: [blackVal!.id, nikeVal!.id, lightVal!.id],
      variants: [
        {
          price: 300,
          attributeValueIds: [blackVal!.id, nikeVal!.id, lightVal!.id],
          stock: 10,
        },
      ],
    },
    {
      name: 'Chair',
      slug: 'chair',
      description: 'Wooden chair',
      sku: 'CHAIR001',
      barcode: '123456803',
      categoryId: homeGardenCategory!.id,
      attributesId: [colorAttr!.id, materialAttr!.id],
      attributesValId: [blackVal!.id, woodVal!.id],
      variants: [
        {
          price: 100,
          attributeValueIds: [blackVal!.id, woodVal!.id],
          stock: 20,
        },
      ],
    },
    {
      name: 'Basketball',
      slug: 'basketball',
      description: 'Official basketball',
      sku: 'BALL001',
      barcode: '123456804',
      categoryId: sportsCategory!.id,
      attributesId: [brandAttr!.id, weightAttr!.id],
      attributesValId: [adidasVal!.id, mediumVal!.id],
      variants: [
        {
          price: 30,
          attributeValueIds: [adidasVal!.id, mediumVal!.id],
          stock: 100,
        },
      ],
    },
    {
      name: 'Lamp',
      slug: 'lamp',
      description: 'Table lamp',
      sku: 'LAMP001',
      barcode: '123456805',
      categoryId: homeGardenCategory!.id,
      attributesId: [colorAttr!.id, materialAttr!.id],
      attributesValId: [redVal!.id, plasticVal!.id],
      variants: [
        {
          price: 40,
          attributeValueIds: [redVal!.id, plasticVal!.id],
          stock: 15,
        },
      ],
    },
  ];

  for (const prodData of productsData) {
    let product: Product | null = null;
    try {
      product = await productService.create({
        name: prodData.name,
        slug: prodData.slug,
        description: prodData.description,
        sku: prodData.sku,
        barcode: prodData.barcode,
        categoryId: prodData.categoryId,
        attributesId: prodData.attributesId,
        attributesValId: prodData.attributesValId,
      });
      console.log(`Product ${prodData.name} created`);
    } catch {
      // Product already exists, find it
      const productRepo = app.get<Repository<Product>>(
        getRepositoryToken(Product),
      );
      product = await productRepo.findOne({ where: { slug: prodData.slug } });
      console.log(
        `Product ${prodData.name} already exists, found for adding variants`,
      );
    }

    if (product) {
      for (const variantData of prodData.variants) {
        try {
          await variantService.create({
            price: variantData.price,
            instructions: 'Handle with care',
            productId: product.id,
            attributeValueIds: variantData.attributeValueIds,
            stock: variantData.stock,
          });
        } catch {
          console.log(`Variant for ${prodData.name} already exists, skipping`);
        }
      }
      console.log(`Variants for ${prodData.name} processed`);
    }
  }

  await app.close();
  console.log('Seeding completed');
}

seed().catch(console.error);
