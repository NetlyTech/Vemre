
import { Progress } from "@/components/ui/progress"

export default function Loader() {
  return (
//     <section className="w-screen h-screen flex justify-center items-center">
//         <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">

//         <Progress  />
//         </div>

    
// </section>

<div className="flex flex-col items-center justify-center min-h-screen bg-white text-green-800">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-800 border-t-transparent mb-4" />
      <p className="text-lg font-medium">Loading...</p>
    </div>

  )
}
