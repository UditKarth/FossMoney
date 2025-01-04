import { FileUp, BanknoteIcon as Bank } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

'use client'

export default function LandingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Here you would typically handle the file upload
      // For now, we'll just log the file name
      console.log('Selected file:', file.name)
    }
  }

  const handleJPMorganAuth = () => {
    // Redirect to the authorization page
    router.push('/auth/jpmorgan')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Budget Tracker</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Take control of your finances with our intelligent budgeting tool. Import your transactions or connect directly with your bank.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileUp className="h-6 w-6 text-white" />
                Upload CSV
              </CardTitle>
              <CardDescription className="text-gray-400">
                Import your transaction data from a CSV file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <Button 
                variant="outline" 
                className="w-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bank className="h-6 w-6 text-white" />
                Connect Bank
              </CardTitle>
              <CardDescription className="text-gray-400">
                Securely connect with JPMorgan Chase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                className="w-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
                onClick={handleJPMorganAuth}
              >
                Connect Account
              </Button>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Your data is encrypted and secure. We never store your banking credentials.</p>
        </footer>
      </main>
    </div>
  )
}

