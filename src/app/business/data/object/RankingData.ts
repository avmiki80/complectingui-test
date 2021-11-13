export class RankingData {
  complectId: number;
  startDisbalance: number;
  startAngleDisbalance: number;
  needDisbalance: number;
  rays: string;

  constructor(complectId: number, startDisbalance: number, startAngleDisbalance: number, needDisbalance: number, rays: string) {
    this.complectId = complectId;
    this.startDisbalance = startDisbalance;
    this.startAngleDisbalance = startAngleDisbalance;
    this.needDisbalance = needDisbalance;
    this.rays = rays;
  }
}



