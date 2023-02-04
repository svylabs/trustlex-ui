export default function swapArrayElements(
  array: any[],
  indexA: number,
  indexB: number
) {
  const temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
  return array;
}
