import { Spinner } from "@/components/ui/spinner"

export default function loading() {
  return (
     <div className="flex items-center gap-6 mt-10 ml-10">
      <Spinner className="size-8" />
    </div>
  )
}
