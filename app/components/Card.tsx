type CardProps = {
  card:
    | {
        name: string;
        img: string;
      }
    | undefined;
};

export function Card({ card }: CardProps) {
  if (!card) {
    return null;
  }
  return (
    <div className="flex justify-center ">
      <img className="max-w-sm w-full" alt={card.name} src={card.img} />
    </div>
  );
}
