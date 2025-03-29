import Link from "next/link";

export default function Trends() {
  return (
    <div>
      <div>
        <Link href="/dashboard">Back to dashboard</Link>
      </div>
      <h1 className="text-3xl font-bold">Mood Trends</h1>
      <p className="mt-4">This is where the trends will be displayed.</p>
      {/* Add your chart or graph component here */}
    </div>
  );
}
