import Link from "next/link"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          AI Mock Technical Interviewer
        </h1>

        <p className="text-lg text-gray-600 mb-8" style={{ color: "var(--text-color)" }}>
          Practice technical interviews with an AI interviewer.  
          Get instant feedback and improve your problem solving skills.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
            style={{ backgroundColor: "var(--text-color)", color: "white" }}
          >
            Login
          </Link>

          <Link
            href="/chooseinterview"
            className="rounded-lg border border-black px-6 py-3 hover:bg-gray-100"
            style={{
              borderColor: "var(--text-color)",
              color: "var(--text-color)",
            }}
          >
            Start Interview
          </Link>
        </div>
      </div>
    </main>
  )
}