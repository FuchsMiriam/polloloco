class Level {
  enemies;
  clouds;
  bottles;
  coins;
  backgroundObjects;
  level_end_x = 2250;

  constructor(enemies, coins, bottles, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.coins = coins;
    this.bottles = bottles;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
  }
}
