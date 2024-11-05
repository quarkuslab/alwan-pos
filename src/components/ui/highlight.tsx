interface Props {
  text: string | undefined;
  query: string;
}

export default function HighlightText(props: Props) {
  if (!props.text) {
    return null;
  }

  if (!props.query.trim()) {
    return <span>{props.text}</span>;
  }

  const parts = props.text.split(new RegExp(`(${props.query})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === props.query.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}
