"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, FileText, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"
import { api } from "@/lib/api-client"

interface QuestionData {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanation: string
  model: string
  overlap: string
}

export default function QuestionGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [chunk_size, setSubject] = useState("")
  const [overlap, setTopic] = useState("")
  const [model, setDifficulty] = useState("")
  const [questionCount, setQuestionCount] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

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

      setFile(selectedFile)
      toast({
        title: "File uploaded",
        description: `${selectedFile.name} has been selected successfully.`,
      })
    }
  }

  const generateMockQuestions = async (count: number): Promise<QuestionData[]> => {
    const questions: QuestionData[] = []

     const payload:any = { file, chunk_size, overlap, model, count }

// Simulate API call to generate questions based on the uploaded file and parameters
const response = await api.postFormData<any>(`/api/v1/genai/quiz-generation/quiz/generate`, payload)
    // Here we just create dummy questions for demonstration purposes

    for (let i = 1; i <= count; i++) {
      questions.push({
        question: `Sample question ${i} about ${overlap || "the chunk_size"}: What is the main concept discussed in the uploaded material?`,
        optionA: `Option A for question ${i}`,
        optionB: `Option B for question ${i}`,
        optionC: `Option C for question ${i}`,
        optionD: `Option D for question ${i}`,
        correctAnswer: "A",
        explanation: `This is the explanation for question ${i}. The correct answer is A because it best represents the concept from the uploaded material.`,
        model: model || "Medium",
        overlap: overlap || "General",
      })
    }

    return questions
  }

  const exportToExcel = (questions: QuestionData[]) => {
    const worksheet = XLSX.utils.json_to_sheet(questions)
    const workbook = XLSX.utils.book_new()

    // Auto-width for columns
    const colWidths = [
      { wch: 50 }, // question
      { wch: 20 }, // optionA
      { wch: 20 }, // optionB
      { wch: 20 }, // optionC
      { wch: 20 }, // optionD
      { wch: 15 }, // correctAnswer
      { wch: 40 }, // explanation
      { wch: 15 }, // model
      { wch: 20 }, // overlap
    ]
    worksheet["!cols"] = colWidths

    XLSX.utils.book_append_sheet(workbook, worksheet, "Generated Questions")

    const fileName = `questions_${chunk_size || "chunk_size"}_${new Date().toISOString().split("T")[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  const handleGenerateQuestions = async () => {
    // Validation
    if (!file) {
      toast({
        title: "File required",
        description: "Please upload a file to generate questions from.",
        variant: "destructive",
      })
      return
    }

    // if (!chunk_size.trim()) {
    //   toast({
    //     title: "Subject required",
    //     description: "Please enter a chunk_size name.",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // if (!overlap.trim()) {
    //   toast({
    //     title: "Topic required",
    //     description: "Please enter a overlap name.",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // if (!model.trim()) {
    //   toast({
    //     title: "Difficulty required",
    //     description: "Please enter model level (e.g., Easy, Medium, Hard).",
    //     variant: "destructive",
    //   })
    //   return
    // }

    const count = Number.parseInt(questionCount)
    if (!count || count < 1 || count > 50) {
      toast({
        title: "Invalid question count",
        description: "Please enter a number between 1 and 50.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock questions (in real implementation, this would call an AI service)
      const questions = generateMockQuestions(count)

      // Export to Excel
      exportToExcel(await questions)

      toast({
        title: "Questions generated successfully!",
        description: `${count} questions have been generated and downloaded as Excel file.`,
      })
      resetForm();
    } catch (error) {
      console.error("Error generating questions:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating the questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setSubject("")
    setTopic("")
    setDifficulty("")
    setQuestionCount("")
    // Reset file input
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Question Generator
        </CardTitle>
        <CardDescription>
          Upload educational content and generate quiz questions automatically. Questions will be exported as an Excel
          file.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload Content File</Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                className="cursor-pointer"
              />
            </div>
            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                {file.name}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, Word documents, text files, and images
          </p>
        </div>

        {/* Text Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="question-count">Number of Questions</Label>
            <Input
              id="question-count"
              type="number"
              min="1"
              max="50"
              placeholder="e.g., 10"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chunk_size">Chunk_size</Label>
            <Input
              id="chunk_size"
              value={chunk_size}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

           <div className="space-y-2">
            <Label htmlFor="overlap">Overlap</Label>
            <Input
              id="overlap"
              value={overlap}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setDifficulty(e.target.value)}
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="overlap">Topic</Label>
            <Input
              id="overlap"
              placeholder="e.g., Algebra, Quantum Mechanics"
              value={overlap}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Difficulty Level</Label>
            <Input
              id="model"
              placeholder="e.g., Easy, Medium, Hard"
              value={model}
              onChange={(e) => setDifficulty(e.target.value)}
            />
          </div> */}

          
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button onClick={handleGenerateQuestions} disabled={isGenerating} className="flex-1">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Questions
              </>
            )}
          </Button>

          <Button variant="outline" onClick={resetForm} disabled={isGenerating}>
            Reset Form
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium text-sm mb-2">How it works:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Upload educational content (PDF, Word, text, or image)</li>
            <li>• Fill in the chunk_size, overlap, model, and question count</li>
            <li>• Click "Generate Questions" to create quiz questions</li>
            <li>• Questions will be automatically downloaded as an Excel file</li>
            <li>• Each question includes multiple choice options, correct answer, and explanation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
