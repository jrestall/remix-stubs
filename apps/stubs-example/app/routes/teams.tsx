import { Link, Outlet, useLocation } from "@remix-run/react";

export default function Teams() {
  const teams = [
    {
      id: 1,
      name: "Team One",
      players: [
        {
          id: 1,
          name: "player one team one",
        },
        {
          id: 2,
          name: "player two team one",
        },
        {
          id: 3,
          name: "player three team one",
        },
      ],
    },
    { id: 2, name: "Team Two" },
    { id: 3, name: "Team Three" },
  ];

  // used for displaying the current application path
  const location = useLocation();

  return (
    <div
      style={{
        borderWidth: 1,
        borderColor: "grey",
        border: "solid",
        padding: 8,
      }}
    >
      <h1>TEAMS</h1>
      <Link to="/" style={{ margin: 8 }}>
        Home
      </Link>
      <Link to="create" style={{ margin: 8 }}>
        Add New Team
      </Link>
      <div style={{ margin: 8, marginTop: 32, background: "grey" }}>
        <Outlet context={[teams]} />
      </div>
      <pre>{location.pathname}</pre>
    </div>
  );
}
