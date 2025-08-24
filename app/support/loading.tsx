import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SupportLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navbar Skeleton */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Skeleton className="h-8 w-32" />
            <div className="hidden md:flex items-center space-x-8">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-80 mx-auto mb-8" />
          <div className="max-w-2xl mx-auto relative">
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* Quick Actions Skeleton */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-40 mx-auto mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Categories Skeleton */}
          <div className="mb-16">
            <Skeleton className="h-8 w-48 mx-auto mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="shadow-soft">
                  <CardContent className="p-6">
                    <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-32 mb-3" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Articles and Resources Skeleton */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Skeleton className="h-7 w-40 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="shadow-soft">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-80 mb-2" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-7 w-24 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="shadow-soft">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-24 bg-gray-700" />
                <Skeleton className="h-4 w-32 bg-gray-700" />
                <Skeleton className="h-4 w-28 bg-gray-700" />
                <Skeleton className="h-4 w-36 bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
