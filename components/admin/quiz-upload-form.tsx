"use client"

import type React from "react"
import { useState } from "react"
import { api } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Download, Info, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import * as XLSX from "xlsx"

interface QuizUploadFormProps {
    subjectId: number
    topicId: number
    quizId: number
    quizTitle: string
    onSuccess: () => void
}

const QuizUploadForm = ({ subjectId, topicId, quizId, quizTitle, onSuccess }: QuizUploadFormProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [fileName, setFileName] = useState<string>("")
    const [fileSize, setFileSize] = useState<string>("")
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")

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
        formData.append("file", file)

        // Get user and organization info from localStorage
        const userId = localStorage.getItem("userId") || "1"
        const organizationId = localStorage.getItem("organizationId") || "1"

        // Build query parameters as the backend expects them
        const queryParams = new URLSearchParams({
            organization_id: organizationId,
            subject_id: subjectId.toString(),
            topic_id: topicId.toString(),
            quiz_id: quizId.toString(),
            created_by: userId,
        })

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return prev
                    }
                    return prev + 10
                })
            }, 300)

            // Use the exact endpoint structure from the backend
            const response = await api.postFormData<any>(`/quizzes/quizzes/upload-quiz/?${queryParams.toString()}`, formData)

            clearInterval(progressInterval)

            if (response.ok) {
                setUploadProgress(100)
                setUploadStatus("success")
                toast({
                    title: "Success",
                    description: `${response.data.details}`,
                })
                // setTimeout(() => {
                //     onSuccess()
                // }, 1000)
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
        a.download = `quiz_template_${quizTitle.replace(/[^a-zA-Z0-9]/g, "_")}_${quizId}.xlsx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }


    return (
        <div className="space-y-6">
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Upload Instructions</AlertTitle>
                <AlertDescription>
                    Upload an Excel file containing quiz questions for "{quizTitle}". Download the template for the required
                    format with pre-filled context.
                </AlertDescription>
            </Alert>

            {/* Context Information Card */}
            <div className="bg-[#f0f7ff] border border-[#e6f0f9] rounded-lg p-4">
                <h4 className="font-medium text-[#1e74bb] mb-3">Upload Context</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded-md border border-[#e6f0f9]">
                        <span className="text-gray-600 block">Quiz:</span>
                        <span className="font-medium text-[#1e74bb]">
                            "{quizTitle}" (ID: {quizId})
                        </span>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-[#e6f0f9]">
                        <span className="text-gray-600 block">Subject ID:</span>
                        <span className="font-medium text-[#1e74bb]">{subjectId}</span>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-[#e6f0f9]">
                        <span className="text-gray-600 block">Topic ID:</span>
                        <span className="font-medium text-[#1e74bb]">{topicId}</span>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-[#e6f0f9]">
                        <span className="text-gray-600 block">Organization:</span>
                        <span className="font-medium text-[#1e74bb]">{localStorage.getItem("organizationId") || "1"}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleFileUpload} encType="multipart/form-data">
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 transition-all hover:border-[#1e74bb] hover:bg-[#f0f7ff]">
                        <FileSpreadsheet className="h-10 w-10 text-gray-400 mb-3" />
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
                                            <span className="text-sm">Quiz uploaded successfully to "{quizTitle}"</span>
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
        </div>
    )
}

export default QuizUploadForm
