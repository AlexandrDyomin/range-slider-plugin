interface IRollers {
  slide(position: number, descriptor: 0 | 1): void;
  setDescriptor(descriptor: 0 | 1): void;
  determineDescriptor(roller: HTMLElement): void;
  getSize(): number;
  getDescriptor(): 0 | 1;
  getLastUpdatedPosition(): number;
  getPosition(descriptor: number): number;
}

export type { IRollers };