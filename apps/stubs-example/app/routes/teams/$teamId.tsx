import { Link, useOutletContext, useParams } from "@remix-run/react";

export default function Team() {
  // get list of teams from context
  const [teams] = useOutletContext() as any;

  // the parameter is derived from the name of the file
  const { teamId } = useParams();

  // use parameter and the context to get specific team
  const team = teams[parseInt(teamId as string) - 1];

  return (
    <div style={{ padding: 16 }}>
      <p>{team?.name}</p>
      {team?.players?.map((p: any, index: number) => (
        <div key={`player-${index}`} style={{ paddingTop: 10 }}>
          <Link to={`/teams/${teamId}/player/${p.id}`}>
            <div>{p.name}</div>
          </Link>
        </div>
      ))}
      <div style={{ paddingTop: 16 }}>
        <Link to="/teams">
          <button type="button" className="button">
            Back
          </button>
        </Link>
      </div>
    </div>
  );
}
