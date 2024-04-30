type Props = {
  message: string;
  children: JSX.Element;
};

export default function Tooltip(props: Props) {
  return (
    <div className="group relative flex">
      {props.children}
      <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
        {props.message}
      </span>
    </div>
  );
}
