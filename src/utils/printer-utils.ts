const LINE_WIDTH = 48;

export function createSeperator(char: string = "-") {
  return char.repeat(LINE_WIDTH);
}

export function createJustifiedLine(
  left: string,
  right: string,
  fontSize: number = 24
) {
  // Calculate max chars based on font size ratio
  const ratio = fontSize / 24; // 24 is base font size for 48 chars
  const adjustedWidth = Math.floor(LINE_WIDTH / ratio);

  // Calculate maximum length for each side
  const maxSideLength = Math.floor(adjustedWidth / 2);

  // Trim texts if they exceed max side length
  const trimmedLeft = left.slice(0, maxSideLength);
  const trimmedRight = right.slice(0, maxSideLength);

  // Calculate spaces needed
  const spacesNeeded =
    adjustedWidth - (trimmedLeft.length + trimmedRight.length);
  const spaces = " ".repeat(Math.max(spacesNeeded, 1));

  return `${trimmedLeft}${spaces}${trimmedRight}`;
}
