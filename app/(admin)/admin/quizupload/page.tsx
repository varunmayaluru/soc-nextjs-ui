"use client";

import React from 'react';
import { api } from '@/lib/api-client'; // Adjust the import path as necessary
const QuizUpload = () => {
    const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            const response = await api.post('/quizzes/quizzes/upload-quiz', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Quiz uploaded successfully!');
            console.log(response.data);
            
        } catch (error) {
            console.error('Error uploading quiz:', error);
            alert('Failed to upload quiz. Please try again.');
        }
    };
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-center items-center">
            <div className="quiz-upload bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Quiz Upload</h1>
                <form onSubmit={handleFileUpload} encType="multipart/form-data">

                <div className="form-group mb-4">
                    <label htmlFor="quizTitle" className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                    <input 
                    type="text" 
                    id="quizTitle" 
                    name="quizTitle" 
                    placeholder="Enter quiz title" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="quizDescription" className="block text-sm font-medium text-gray-700 mb-2">Quiz Description</label>
                    <textarea 
                    id="quizDescription" 
                    name="quizDescription" 
                    placeholder="Enter quiz description" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>
                <div className="form-group mb-6">
                    <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                    <input 
                    type="file" 
                    id="fileUpload" 
                    name="fileUpload" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Upload Quiz
                </button>
                </form>
            </div>
            </div>
        </div>

    );
};

export default QuizUpload;