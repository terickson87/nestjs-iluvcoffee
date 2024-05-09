import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';
import { containCoffeeObject, containsArrayOfCoffeeObjects } from '../util';

describe('[Feature Coffees - /coffees', () => {
  const COFFEES_ENDPOINT = '/coffees';

  const coffee1: CreateCoffeeDto = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };

  const coffee2: CreateCoffeeDto = {
    name: 'Boat Dark',
    brand: 'Buddy Brew',
    flavors: ['caramel'],
  };

  const coffee3: CreateCoffeeDto = {
    name: 'Torpedo Dawn',
    brand: 'Buddy Brew',
    flavors: [],
  };

  const allCoffee: CreateCoffeeDto[] = [coffee1, coffee2, coffee3];

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'postgres',
            host: 'localhost',
            port: 5433,
            username: 'postgres',
            password: 'pass123',
            database: 'postgres',
            autoLoadEntities: true,
            synchronize: true,
          }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  it.skip('Create [POST /] (Basic)', () => {
    return request(app.getHttpServer())
      .post(COFFEES_ENDPOINT)
      .send(coffee1 as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);
  });

  it('Create [POST /] (w/ object inspection)', () => {
    return request(app.getHttpServer())
      .post(COFFEES_ENDPOINT)
      .send(coffee1 as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => expect(body).toEqual(containCoffeeObject(coffee1)));
  });

  it('Get all [GET /]', async () => {
    // Arrange
    await Promise.all(
      allCoffee.map(async (iCof) => {
        console.log(`POSTing iCof: ${iCof.name}.`);
        await request(app.getHttpServer())
          .post(COFFEES_ENDPOINT)
          .send(iCof as CreateCoffeeDto)
          .expect(HttpStatus.CREATED);
        console.log(`iCof: ${iCof.name} POSTED.`);
        const resp = await request(app.getHttpServer()).get(COFFEES_ENDPOINT);
        console.log(`GET all after: ${JSON.stringify(resp.body)}`);
        console.log(`body length: ${resp.body.length}`);
      }),
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Act
    const resp = await request(app.getHttpServer()).get(COFFEES_ENDPOINT);

    // Assert
    console.log(`body length: ${resp.body.length}`);
    console.log(JSON.stringify(resp.body));
    expect(resp.body.length).toBeGreaterThan(0);
    allCoffee.forEach((element) => {
      expect(resp.body as CreateCoffeeDto[]).toContainEqual(
        containCoffeeObject(element),
      );
    });
  });

  it.todo('Get one [GET /:id]');

  it.todo('Update one [PATCH /:id]');

  it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
