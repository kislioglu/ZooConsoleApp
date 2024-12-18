// specifying animal characteristics
const createAnimal = (animalType, gender, xAxis, yAxis, movementDistance) => {
  const animal = {
    animalType,
    gender,
    xAxis,
    yAxis,
    movementDistance,
    move() {
      const maxAxis = 500;
      const newX = this.xAxis + randomMovement(this.movementDistance);
      const newY = this.yAxis + randomMovement(this.movementDistance);
      this.xAxis = Math.max(0, Math.min(maxAxis, newX));
      this.yAxis = Math.max(0, Math.min(maxAxis, newY));
    },
    distanceTo(other) {
      return Math.sqrt(
        (this.xAxis - other.xAxis) ** 2 + (this.yAxis - other.yAxis) ** 2
      );
    },
  };
  return animal;
};

// random movement of units
const randomMovement = (movementDistance) =>
  Math.floor(Math.random() * movementDistance * 2 - movementDistance);

// Identify and add animal features
const pushAnimals = () => {
  const animals = [];
  const animalTypes = [
    { type: "sheep", count: 30, movementDistance: 2 },
    { type: "cow", count: 10, movementDistance: 2 },
    { type: "chicken", count: 10, movementDistance: 1, fixedGender: "female" },
    { type: "wolf", count: 10, movementDistance: 3 },
    { type: "rooster", count: 10, movementDistance: 1, fixedGender: "male" },
    { type: "lion", count: 8, movementDistance: 4 },
    { type: "hunter", count: 1, movementDistance: 1 },
  ];

  animalTypes.forEach((animal) => {
    for (let i = 0; i < animal.count; i++) {
      const gender = animal.fixedGender || (i % 2 === 0 ? "male" : "female");
      const xAxis = Math.random() * 500;
      const yAxis = Math.random() * 500;

      animals.push(
        createAnimal(animal.type, gender, xAxis, yAxis, animal.movementDistance)
      );
    }
  });

  return animals;
};

// movement function of units
const movementOfUnits = (animals) => {
  animals.forEach((animal) => animal.move());
  huntFunction(animals);
  birthOfAnimals(animals);
};

// hunt function for who can hunt
const huntFunction = (animals) => {
  for (let i = animals.length - 1; i >= 0; i--) {
    const animal = animals[i];
    const hunters = animals.filter((a) =>
      ["lion", "wolf", "hunter"].includes(a.animalType)
    );

    for (const hunter of hunters) {
      if (
        hunter.animalType === "wolf" &&
        ["sheep", "chicken", "rooster"].includes(animal.animalType) &&
        hunter.distanceTo(animal) <= 4
      ) {
        animals.splice(i, 1);
        break;
      }
      if (
        hunter.animalType === "lion" &&
        ["sheep", "cow"].includes(animal.animalType) &&
        hunter.distanceTo(animal) <= 5
      ) {
        animals.splice(i, 1);
        break;
      }
      if (
        hunter.animalType === "hunter" &&
        ["sheep", "chicken", "rooster", "cow", "lion", "wolf"].includes(
          animal.animalType
        ) &&
        hunter.distanceTo(animal) <= 8
      ) {
        animals.splice(i, 1);
        break;
      }
    }
  }
};

// to control of new animals birth
const birthOfAnimals = (animals) => {
  const newBorns = [];

  for (let i = 0; i < animals.length; i++) {
    for (let j = i + 1; j < animals.length; j++) {
      const animal1 = animals[i];
      const animal2 = animals[j];
      if (
        animal1.animalType === animal2.animalType &&
        animal1.gender !== animal2.gender &&
        animal1.distanceTo(animal2) <= 3
      ) {
        const newBornedAnimal = createAnimal(
          animal1.animalType,
          Math.random() < 0.5 ? "male" : "female",
          animal1.xAxis + Math.random() * 500,
          animal1.yAxis + Math.random() * 500,
          animal1.movementDistance
        );
        newBorns.push(newBornedAnimal);
      }
    }
  }

  animals.push(...newBorns);
};

// start the simulation
const runSim = () => {
  const animals = pushAnimals();
  console.log("Animals count at the beginning:", countAnimals(animals));
  for (let step = 0; step < 100; step++) {
    movementOfUnits(animals);
  }
  console.log("Animals count at the end:", countAnimals(animals));
};

const countAnimals = (animals) => {
  const counts = {};
  animals.forEach((animal) => {
    counts[animal.animalType] = (counts[animal.animalType] || 0) + 1;
  });
  return counts;
};

runSim();
