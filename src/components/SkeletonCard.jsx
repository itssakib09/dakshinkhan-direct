import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
      <Skeleton height={192} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
      <div className="p-4 sm:p-5 space-y-3">
        <Skeleton height={24} width="80%" />
        <Skeleton height={16} width="60%" />
        <div className="flex justify-between">
          <Skeleton height={32} width={100} />
          <Skeleton height={32} width={100} />
        </div>
      </div>
    </div>
  )
}