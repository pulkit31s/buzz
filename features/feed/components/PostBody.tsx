interface PostBodyProps {
  content: string;
}

export default function PostBody({ content }: PostBodyProps) {
  return (
    <div className="mt-4">
      <p className="whitespace-pre-wrap text-gray-800">
        {content}
      </p>
    </div>
  );
}