import { Link, useOutletContext } from "@remix-run/react";

export default function TeamsIndex() {
  const [teams] = useOutletContext() as any;
  return (
    <div>
      <div
        style={{
          padding: 16,
          borderWidth: 1,
          borderColor: "grey",
          border: "solid",
        }}
      >
        <p>This is where the individual teams will appear</p>
        {teams?.map((t: any, index: number) => (
          <Link key={`team-${index}`} to={`/teams/${t.id}`}>
            <p>{t.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
