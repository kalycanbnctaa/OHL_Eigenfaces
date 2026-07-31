import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold tracking-tight">OHL Eigenfaces</h1>
        <p className="text-xl text-gray-600">
          Web-Based Face Recognition using Eigenfaces
        </p>
        <p className="text-md text-gray-500 max-w-2xl mx-auto">
          Sistem pengenalan wajah berbasis Eigenfaces yang dibangun dengan Flask
          dan Next.js. Cocokkan wajah Anda terhadap dataset, tambahkan subjek
          baru, dan jelajahi ruang eigen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-4xl mb-3">🖼️</div>
          <h3 className="text-lg font-semibold">Recognize</h3>
          <p className="text-sm text-gray-600">
            Upload atau capture wajah untuk dikenali
          </p>
          <Link
            href="/recognize"
            className="mt-3 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Coba Sekarang
          </Link>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-4xl mb-3">➕</div>
          <h3 className="text-lg font-semibold">Add Face</h3>
          <p className="text-sm text-gray-600">
            Tambahkan subjek baru ke dataset (retrain otomatis)
          </p>
          <Link
            href="/add-face"
            className="mt-3 inline-block rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Tambah
          </Link>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-4xl mb-3">🖼️</div>
          <h3 className="text-lg font-semibold">Gallery</h3>
          <p className="text-sm text-gray-600">
            Lihat Mean Face dan top-16 eigenfaces
          </p>
          <Link
            href="/gallery"
            className="mt-3 inline-block rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Lihat Galeri
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border bg-gray-50 p-6 max-w-md mx-auto">
        <p className="text-sm text-gray-600">
          Dataset: <span className="font-medium">AT&T (ORL) Face Database</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Built with Flask, Next.js, NumPy, OpenCV
        </p>
      </div>
    </div>
  );
}