"use client"

import type React from "react"

import { useState } from "react"
import { api } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Download, Info, HelpCircle, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import * as XLSX from "xlsx"

const QuizUpload = () => {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [fileSize, setFileSize] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [activeTab, setActiveTab] = useState("upload")

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
      setFileSize(formatFileSize(selectedFile.size))
      setUploadStatus("idle")
      setUploadProgress(0)
    }
  }

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    setUploadStatus("uploading")
    setUploadProgress(10)

    const formData = new FormData()
    // The key must be 'file' to match the FastAPI endpoint parameter name
    formData.append("file", file)

    const queryParams = new URLSearchParams({
      // organization_id: organizationId,
      // subject_id: subjectId.toString(),
      // topic_id: topicId.toString(),
      // quiz_id: quizId.toString(),
      // created_by: userId,
    })

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 300)

      // Use the new postFormData method specifically designed for FormData
      const response = await api.postFormData(`/quizzes/quizzes/upload-quiz/?${queryParams.toString()}`, formData)

      clearInterval(progressInterval)

      if (response.ok) {
        setUploadProgress(100)
        setUploadStatus("success")
        toast({
          title: "Success",
          description: "Quiz uploaded successfully.",
        })
      } else {
        throw new Error("Error uploading quiz")
      }
    } catch (error) {
      setUploadStatus("error")
      toast({
        title: "Error",
        description: "Failed to upload quiz. Please try again.",
        variant: "destructive",
      })
      console.error("Upload error:", error)
    }
  }

  const resetForm = () => {
    setFile(null)
    setFileName("")
    setFileSize("")
    setUploadStatus("idle")
    setUploadProgress(0)
  }

  const downloadTemplate = () => {
    const worksheetData = [
      [
        "quiz_question_text",
        "difficulty_level",
        "is_active",
        "is_maths",
        "options",
        "correct_answer_index"
      ],
      [
        "What is photosynthesis?",
        "easy",
        true,
        false,
        '["Breathing process","Energy production","Light conversion","None of these"]',
        2
      ],
      [
        "Which planet is known as the Red Planet?",
        "medium",
        true,
        false,
        '["Earth","Mars","Venus","Jupiter"]',
        1
      ],
      [
        "What is 2+2?",
        "easy",
        true,
        true,
        '["3","4","5","6"]',
        1
      ]
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Template")

    const blob = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blobData = new Blob([blob], { type: "application/octet-stream" })

    const url = URL.createObjectURL(blobData)
    const a = document.createElement("a")
    a.href = url
    // a.download = `quiz_template_${quizTitle.replace(/[^a-zA-Z0-9]/g, "_")}_${quizId}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-[#1e74bb] to-[#4a9eda] text-white p-6 rounded-lg shadow-md mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-24"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full transform -translate-x-20 translate-y-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-white text-[#1e74bb] hover:bg-gray-100">Admin Portal</Badge>
              <Badge className="bg-[#0d4c7a] text-white">Quiz Management</Badge>
            </div>
            <h1 className="text-2xl font-bold mb-1 flex items-center">
              <Upload className="mr-2 h-6 w-6" />
              Quiz Upload
            </h1>
            <p className="text-gray-100">Upload quiz questions via Excel spreadsheet</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100 mb-6">
            <TabsTrigger value="upload" className="data-[state=active]:bg-white data-[state=active]:text-[#1e74bb]">
              <div className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </div>
            </TabsTrigger>
            <TabsTrigger value="help" className="data-[state=active]:bg-white data-[state=active]:text-[#1e74bb]">
              <div className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card className="border border-[#e6f0f9] shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#f0f7ff] to-white">
                <CardTitle className="text-lg flex items-center">
                  <FileSpreadsheet className="mr-2 h-5 w-5 text-[#1e74bb]" />
                  Upload Quiz Spreadsheet
                </CardTitle>
                <CardDescription>Upload an Excel file containing quiz questions in the required format</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleFileUpload} encType="multipart/form-data">
                  <div className="space-y-6">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Important Information</AlertTitle>
                      <AlertDescription>
                        The Excel file must contain the required columns as shown in the template. Download the template
                        for reference.
                      </AlertDescription>
                    </Alert>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 transition-all hover:border-[#1e74bb] hover:bg-[#f0f7ff]">
                      <FileSpreadsheet className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Upload Excel File</h3>
                      <p className="text-sm text-gray-500 mb-4 text-center">
                        Drag and drop your Excel file here, or click to browse
                      </p>
                      <input
                        type="file"
                        id="fileUpload"
                        name="fileUpload"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-wrap gap-3 justify-center">
                        <Button
                          type="button"
                          onClick={() => document.getElementById("fileUpload")?.click()}
                          className="bg-[#1e74bb] hover:bg-[#1a65a3] text-white"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Browse Files
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={downloadTemplate}
                          className="border-[#1e74bb] text-[#1e74bb] hover:bg-[#e6f0f9]"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Template
                        </Button>
                      </div>
                    </div>

                    {fileName && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-[#e6f0f9] p-2 rounded-lg mr-3">
                              <FileSpreadsheet className="h-6 w-6 text-[#1e74bb]" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{fileName}</p>
                              <p className="text-sm text-gray-500">{fileSize}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={resetForm}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {uploadStatus !== "idle" && (
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">
                                {uploadStatus === "uploading" && "Uploading..."}
                                {uploadStatus === "success" && "Upload Complete"}
                                {uploadStatus === "error" && "Error"}
                              </span>
                              <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />

                            {uploadStatus === "success" && (
                              <div className="flex items-center mt-3 text-green-600">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                <span className="text-sm">Quiz uploaded successfully</span>
                              </div>
                            )}

                            {uploadStatus === "error" && (
                              <div className="flex items-center mt-3 text-red-600">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                <span className="text-sm">Failed to upload quiz. Please try again.</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={!file || uploadStatus === "uploading" || uploadStatus === "success"}
                        className="bg-[#1e74bb] hover:bg-[#1a65a3] text-white"
                      >
                        {uploadStatus === "uploading" && (
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        )}
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadStatus === "uploading" ? "Uploading..." : "Upload Quiz"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <Card className="border border-[#e6f0f9] shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#f0f7ff] to-white">
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-[#1e74bb]" />
                  Help & Instructions
                </CardTitle>
                <CardDescription>Learn how to properly format your quiz spreadsheet</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="bg-[#f0f7ff] rounded-lg p-5 border border-[#e6f0f9]">
                    <h3 className="text-lg font-medium text-[#1e74bb] mb-3">Required Columns</h3>
                    <p className="text-gray-600 mb-4">
                      Your Excel file must contain the following columns with the exact names:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <p className="font-medium text-gray-800">quiz_question_text</p>
                        <p className="text-sm text-gray-500">The actual question text (required)</p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <p className="font-medium text-gray-800">difficulty_level</p>
                        <p className="text-sm text-gray-500">Difficulty (easy, medium, hard)</p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <p className="font-medium text-gray-800">is_active</p>
                        <p className="text-sm text-gray-500">Is the quiz active (TRUE/FALSE)</p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <p className="font-medium text-gray-800">is_maths</p>
                        <p className="text-sm text-gray-500">Is the quiz related to maths (TRUE/FALSE)</p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <p className="font-medium text-gray-800">options</p>
                        <p className="text-sm text-gray-500">Array of options (JSON format)</p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <p className="font-medium text-gray-800">correct_answer_index</p>
                        <p className="text-sm text-gray-500">Index of the correct answer (number)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default QuizUpload
