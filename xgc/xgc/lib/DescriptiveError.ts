export class DescriptiveError extends Error {
  public description: string;
  public constructor(description: string, message: string) {
    super(message);
    this.description = description;
  }
}
