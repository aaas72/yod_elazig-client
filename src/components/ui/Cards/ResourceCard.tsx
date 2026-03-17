"use client";

import { FileText, Eye } from "lucide-react";

interface ResourceCardProps {
    title: string;
    faculty: string;
    department: string;
    year: number;
    type: string;
    fileUrl: string;
    facultyLabel?: string;
    departmentLabel?: string;
    yearLabel?: string;
    viewFileLabel?: string;
}

export default function ResourceCard({
    title,
    faculty,
    department,
    year,
    type,
    fileUrl,
    facultyLabel = "Faculty",
    departmentLabel = "Department",
    yearLabel = "Year",
    viewFileLabel = "View File",
}: ResourceCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 border flex flex-col hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-3">
                <FileText className="text-red-700 me-2" size={20} />
                <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">{type}</span>
            </div>
            <h3 className="text-md font-bold text-gray-800 mb-2 grow">{title}</h3>
            <div className="text-xs text-gray-500 space-y-1 mb-4">
                <p><strong>{facultyLabel}:</strong> {faculty}</p>
                <p><strong>{departmentLabel}:</strong> {department}</p>
                <p><strong>{yearLabel}:</strong> {year}</p>
            </div>
            <button
                onClick={() => window.open(fileUrl, '_blank')}
                className="mt-auto w-full bg-red-700 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
            >
                <Eye size={16} />
                <span>{viewFileLabel}</span>
            </button>
        </div>
    );
}
