import type {
  GallerySubject,
} from "@/types/gallery";

interface Props {
  subjects: GallerySubject[];
}

export default function GalleryGrid({
  subjects,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

      {subjects.map((subject) => (
        <div
          key={subject.id}
          className="rounded-lg border p-4"
        >
          <h3 className="text-lg font-bold">
            Subject {subject.id}
          </h3>

          <p>
            Images:
            {" "}
            {subject.images}
          </p>
        </div>
      ))}

    </div>
  );
}