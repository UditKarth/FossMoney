import { NextResponse } from 'next/server'
import { spawn } from 'child_process'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Save file temporarily and process with Python
    const buffer = Buffer.from(await file.arrayBuffer())
    const tempFilePath = `/tmp/${Date.now()}-${file.name}`
    await fs.writeFile(tempFilePath, buffer)

    // Call Python script
    const data = await new Promise((resolve, reject) => {
      const process = spawn('python', ['backend/csv_parser.py', tempFilePath])
      let result = ''

      process.stdout.on('data', (data) => {
        result += data.toString()
      })

      process.stderr.on('data', (data) => {
        console.error(`Error: ${data}`)
      })

      process.on('close', (code) => {
        if (code !== 0) {
          reject(new Error('Processing failed'))
        } else {
          resolve(JSON.parse(result))
        }
      })
    })

    // Clean up temp file
    await fs.unlink(tempFilePath)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error processing CSV:', error)
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    )
  }
} 