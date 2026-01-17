import { useRouter } from 'next/navigation'
import React from 'react'

const Card = ({contest_name , start_time, start_date, action , duration, contest_id} : {contest_name : string , start_time  :string , start_date :string, action : string, duration : string, contest_id : string}) => {
  const router = useRouter()
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
        <div onClick ={()=> router.push(`/contest/${contest_id}`)}>
            <p className="text-lg font-medium text-gray-900">
            {contest_name}
            </p>
            <div className='flex gap-4'>
              <p className="text-sm text-gray-500">
              Starts at {start_date} -- {start_time}
              </p>
              <p className="text-sm text-gray-500">
                duration : {duration}
              </p>
            </div>
        </div>
        <div className='text-white bg-blue-600 p-2 rounded-lg' onClick={()=> router.push(`/leaderboard/${contest_id}`)}>
            {action}
        </div>
    </div>
  )
}

export default Card