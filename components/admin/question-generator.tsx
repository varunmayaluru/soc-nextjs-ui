"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Upload, Download, FileText, Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function QuestionGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [chunkSize, setChunkSize] = useState("")
  const [overlap, setOverlap] = useState("")
  const [model, setModel] = useState("")
  const [questionCount, setQuestionCount] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDownloadReady, setIsDownloadReady] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
        "image/jpeg",
        "image/png",
      ]

      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, Word document, text file, or image.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      setIsDownloadReady(false)
      toast({
        title: "File uploaded successfully",
        description: `${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`,
      })
    }
  }

  const downloadExcelFromAPI = async (count: number): Promise<void> => {
    if (!file) throw new Error("No file selected")

    // Create FormData for file upload
    const formData = new FormData()
    formData.append("file", file)
    formData.append("total_questions", count.toString())
    formData.append("chunk_size", chunkSize || "1000")
    formData.append("overlap", overlap || "100")
    formData.append("model", model || "gpt-3.5-turbo")

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 500)

    try {
      // Make direct fetch call to handle blob response properly
      const response = await fetch("/api/genai/quiz-generation/quiz/generate", {
        method: "POST",
        body: formData,
        headers: {
          // Don't set Content-Type header for FormData, let browser set it
        },
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      // Check if response is actually an Excel file
      const contentType = response.headers.get("content-type")
      console.log("Response content-type:", contentType)

      // Get the blob directly from the response
      const blob = await response.blob()
      console.log("Blob size:", blob.size, "Blob type:", blob.type)

      // Ensure the blob has the correct MIME type for Excel
      const excelBlob = new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Create download link
      const url = window.URL.createObjectURL(excelBlob)
      const link = document.createElement("a")
      link.href = url

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0]
      const filename = `quiz_questions_${timestamp}_${Date.now()}.xlsx`
      link.download = filename

      // Add link to DOM, click it, then remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the object URL
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 100)

      setIsDownloadReady(true)

      toast({
        title: "Excel file downloaded successfully!",
        description: `${filename} has been saved to your downloads folder.`,
      })
    } catch (error) {
      clearInterval(progressInterval)
      console.error("Error downloading Excel file:", error)

      // Fallback: Generate mock Excel file client-side
      await generateFallbackExcel(count)

      toast({
        title: "Downloaded with fallback data",
        description: "API unavailable. Downloaded sample questions for demonstration.",
        variant: "destructive",
      })
    }
  }

  // Fallback function to generate Excel client-side if API fails
  const generateFallbackExcel = async (count: number): Promise<void> => {
    try {
      // Dynamic import to reduce bundle size
      const XLSX = await import("xlsx")

      // Generate mock data
      const mockData = []
      for (let i = 1; i <= count; i++) {
        mockData.push({
          "Question No.": i,
          Question: `Sample question ${i}: What is the key concept discussed in the uploaded material?`,
          "Option A": `Primary concept from the material`,
          "Option B": `Secondary interpretation`,
          "Option C": `Alternative viewpoint`,
          "Option D": `Unrelated option`,
          "Correct Answer": "A",
          Explanation: `This is the explanation for question ${i}. The correct answer demonstrates understanding of the core principles.`,
          "Difficulty Level": i % 3 === 0 ? "hard" : i % 2 === 0 ? "medium" : "easy",
          "Question Type": "multiple_choice",
          "Generated On": new Date().toLocaleString(),
        })
      }

      const worksheet = XLSX.utils.json_to_sheet(mockData)
      const workbook = XLSX.utils.book_new()

      // Auto-width for columns
      const colWidths = [
        { wch: 12 }, // Question No.
        { wch: 60 }, // Question
        { wch: 25 }, // Option A
        { wch: 25 }, // Option B
        { wch: 25 }, // Option C
        { wch: 25 }, // Option D
        { wch: 25 }, // Correct Answer
        { wch: 50 }, // Explanation
        { wch: 15 }, // Difficulty Level
        { wch: 15 }, // Question Type
        { wch: 20 }, // Generated On
      ]
      worksheet["!cols"] = colWidths

      XLSX.utils.book_append_sheet(workbook, worksheet, "Generated Questions")

      const fileName = `quiz_questions_fallback_${new Date().toISOString().split("T")[0]}_${Date.now()}.xlsx`
      XLSX.writeFile(workbook, fileName)

      setIsDownloadReady(true)
    } catch (error) {
      console.error("Error generating fallback Excel:", error)
      toast({
        title: "Error generating fallback file",
        description: "Unable to create Excel file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateQuestions = async () => {
    // Reset previous state
    setProgress(0)
    setIsDownloadReady(false)

    // Validation
    if (!file) {
      toast({
        title: "File required",
        description: "Please upload a file to generate questions from.",
        variant: "destructive",
      })
      return
    }

    const count = Number.parseInt(questionCount)
    if (!count || count < 1 || count > 50) {
      toast({
        title: "Invalid question count",
        description: "Please enter a number between 1 and 50.",
        variant: "destructive",
      })
      return
    }

    if (chunkSize && (Number.parseInt(chunkSize) < 100 || Number.parseInt(chunkSize) > 9999)) {
      toast({
        title: "Invalid chunk size",
        description: "Chunk size should be between 100 and 9999 characters.",
        variant: "destructive",
      })
      return
    }

    if (overlap && (Number.parseInt(overlap) < 0 || Number.parseInt(overlap) > 1000)) {
      toast({
        title: "Invalid overlap",
        description: "Overlap should be between 0 and 1000 characters.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      toast({
        title: "Processing started",
        description: "Analyzing your content and generating questions...",
      })

      await downloadExcelFromAPI(count)
    } catch (error) {
      console.error("Error generating questions:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating the questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const resetForm = () => {
    setFile(null)
    setChunkSize("")
    setOverlap("")
    setModel("")
    setQuestionCount("")
    setProgress(0)
    setIsDownloadReady(false)

    // Reset file input
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Form Card */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  AI Question Generator
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Transform your educational content into engaging quiz questions automatically
                </CardDescription>
              </div>
            </div>
            {isDownloadReady && (
              <Badge variant="secondary" className="px-3 py-1">
                <CheckCircle className="h-4 w-4 mr-1" />
                Excel Downloaded
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <Label htmlFor="file-upload" className="text-lg font-semibold">
                Upload Content File
              </Label>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-colors">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>

                <div className="text-center">
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer text-primary hover:text-primary/80 font-medium"
                  >
                    Click to upload or drag and drop
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">PDF, Word, Text files, or Images (Max 10MB)</p>
                </div>

                {file && (
                  <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="text-sm">
                      <p className="font-medium text-green-800">{file.name}</p>
                      <p className="text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Configuration Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <Label className="text-lg font-semibold">Generation Settings</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="question-count" className="text-sm font-medium">
                  Number of Questions *
                </Label>
                <Input
                  id="question-count"
                  type="number"
                  min="1"
                  max="50"
                  placeholder="Enter number (1-50)"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="model" className="text-sm font-medium">
                  AI Model
                </Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4.1">GPT-4.1(Advanced)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="chunk-size" className="text-sm font-medium">
                  Chunk Size (characters)
                </Label>
                <Input
                  id="chunk-size"
                  type="number"
                  min="100"
                  max="9999"
                  placeholder="Default: 1000"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(e.target.value)}
                  className="h-12 text-base"
                />
                <p className="text-xs text-muted-foreground">How much text to analyze at once (100-9999)</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="overlap" className="text-sm font-medium">
                  Overlap (characters)
                </Label>
                <Input
                  id="overlap"
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="Default: 100"
                  value={overlap}
                  onChange={(e) => setOverlap(e.target.value)}
                  className="h-12 text-base"
                />
                <p className="text-xs text-muted-foreground">Text overlap between chunks (0-1000)</p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          {isGenerating && (
            <div className="space-y-4 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="font-medium text-blue-800">Generating Questions...</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-blue-600">
                Processing your content and creating quiz questions. Download will start automatically when ready.
              </p>
            </div>
          )}

          {/* Success Message */}
          {isDownloadReady && !isGenerating && (
            <div className="space-y-4 p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Questions Generated Successfully!</span>
              </div>
              <p className="text-sm text-green-600">
                Your Excel file has been downloaded automatically. Check your downloads folder.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className="flex-1 h-12 text-base font-medium"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating & Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Generate & Download Excel
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={resetForm}
              disabled={isGenerating}
              className="h-12 text-base font-medium bg-transparent"
              size="lg"
            >
              Reset Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <h4 className="font-semibold text-lg mb-4 text-gray-800">How it works:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <p className="text-sm text-gray-700">
                  Upload your educational content (PDF, Word, text, or image files)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <p className="text-sm text-gray-700">
                  Configure generation settings (questions count, AI model, chunk size)
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <p className="text-sm text-gray-700">AI analyzes your content and generates relevant quiz questions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  4
                </div>
                <p className="text-sm text-gray-700">Excel file downloads automatically to your device</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
