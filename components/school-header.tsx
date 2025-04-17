export default function SchoolHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-[#1e74bb] flex items-center justify-center mr-3 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m2 7 8-5 12 5-12 5z" />
          <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
          <path d="M12 9v13" />
        </svg>
      </div>
      <h1 className="text-xl font-medium">{title}</h1>
    </div>
  )
}
