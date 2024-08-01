class BottleStatusbar extends Statusbar {
  percentage = 0;
  y = 50;

  IMAGES = [
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  percentage = 0;

  constructor() {
    super().loadImages(this.IMAGES);
    this.setPercentage(0);
  }

  resolveImageIndex() {
    if (this.percentage == 0) {
      return 0;
    } else if (this.percentage >= 20) {
      return 1;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 80) {
      return 4;
    } else {
      return 5;
    }
  }
}
