import React from 'react';
import { FileText, Eye } from 'lucide-react'; // 1. تغيير الأيقونة إلى "Eye"

interface ResourceCardProps {
    title: string;
    faculty: string;
    department: string;
    year: number;
    type: string;
    fileUrl: string;
}

export default function ResourceCard({ title, faculty, department, year, type, fileUrl }: ResourceCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 border flex flex-col hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-3">
                <FileText className="text-red-700 mr-2" size={20} />
                <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">{type}</span>
            </div>
            <h3 className="text-md font-bold text-gray-800 mb-2 grow">{title}</h3>
            <div className="text-xs text-gray-500 space-y-1 mb-4">
                <p><strong>الكلية:</strong> {faculty}</p>
                <p><strong>القسم:</strong> {department}</p>
                <p><strong>السنة:</strong> {year}</p>
            </div>
            <button
                onClick={() => window.open(fileUrl, '_blank')} // الوظيفة تبقى كما هي، تفتح رابط درايف
                className="mt-auto w-full bg-red-700 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
            >
                <Eye size={16} /> {/* 2. استخدام الأيقونة الجديدة */}
                <span>عرض الملف</span> {/* 3. تغيير النص */}
            </button>
        </div>
    );
}

