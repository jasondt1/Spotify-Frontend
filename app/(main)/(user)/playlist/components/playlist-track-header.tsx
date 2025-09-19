import { FaRegClock } from "react-icons/fa"

export function PlaylistTrackHeader() {
  return (
    <div className="flex items-center gap-3 p-2 pl-6 border-b border-white/10 text-sm font-medium text-gray-400">
      <div className="w-[3%] min-w-[30px] text-center">#</div>
      <div className="w-[6%] min-w-[40px]">Title</div>
      <div className="flex-1"></div>
      <div className="w-[20%]">Album</div>
      <div className="w-[20%]">Date Added</div>
      <div className="w-[5%] text-center"></div>
      <div className="w-[8%] flex justify-end items-center">
        <FaRegClock size={14} />
      </div>
      <div className="w-[5%]"></div>
    </div>
  )
}
