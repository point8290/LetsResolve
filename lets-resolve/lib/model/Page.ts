export default interface Page<T> {
  items: T[];
  nextCursor?: string;
}
