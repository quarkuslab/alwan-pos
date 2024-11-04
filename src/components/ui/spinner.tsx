interface Props {
  width?: number;
  size?: number;
  color?: string;
}

export default function Spinner({
  size = 20,
  width = 3,
  color = 'black',
}: Props) {
  return (
    <div
      className="animate-spin inline-block border-current border-t-transparent rounded-full"
      style={{
        width: size,
        height: size,
        borderWidth: width,
        color: color,
      }}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
