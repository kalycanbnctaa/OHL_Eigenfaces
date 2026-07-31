interface Props {
  subject: number | null | undefined;
  distance?: number;
  unknown?: boolean;
}

export default function FaceCard({
  subject,
  distance,
  unknown,
}: Props) {

  return (
    <div className="rounded-lg border p-6 space-y-3">

      <h3 className="text-xl font-bold">
        Face Information
      </h3>

      <p>
        Subject:
        {" "}
        <b>
          {
            unknown
              ? "Unknown"
              : subject ?? "-"
          }
        </b>
      </p>

      <p>
        Distance:
        {" "}
        <b>
          {
            distance !== undefined
              ? distance.toFixed(6)
              : "-"
          }
        </b>
      </p>

      <p>
        Status:
        {" "}
        <b>
          {
            unknown
              ? "Unknown Face"
              : "Known Face"
          }
        </b>
      </p>

    </div>
  );
}