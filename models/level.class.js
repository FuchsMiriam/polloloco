class Level {
  enemies;
  clouds;
  //bottles;
  //coins;
  backgroundObjects;
  level_end_x = 2250;

  constructor(enemies, clouds, backgroundObjects, bottles, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    //this.bottles = bottles;
    //this.coins = coins;
  }
}
