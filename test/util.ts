import { CreateCoffeeDto } from '../src/coffees/dto/create-coffee.dto';

export function containCoffeeObject(coffee: CreateCoffeeDto) {
  return expect.objectContaining({
    ...coffee,
    flavors: expect.arrayContaining(
      coffee.flavors.map((name) => expect.objectContaining({ name })),
    ),
  });
}

export function containsArrayOfCoffeeObjects(coffees: CreateCoffeeDto[]) {
  return coffees.map((iCof) => containCoffeeObject(iCof));
}
