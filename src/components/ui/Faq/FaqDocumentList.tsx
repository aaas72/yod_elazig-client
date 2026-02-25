import React from "react";
import { Download } from "lucide-react";

interface Document {
  name: string;
  image: string;
  file?: string;
}

interface FaqDocumentListProps {
  documents: Document[];
  title: string;
  onOpenModal: (doc: Document) => void;
}

const FaqDocumentList: React.FC<FaqDocumentListProps> = ({ documents, title, onOpenModal }) => {
  if (!documents || documents.length === 0) return null;

  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
        {title}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50/50 transition-all group"
          >
            <button
              onClick={() => onOpenModal(doc)}
              className="flex items-center gap-3 flex-1 text-start min-w-0"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors overflow-hidden">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-full h-full object-cover opacity-90"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Doc";
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-red-700 truncate">
                {doc.name}
              </span>
            </button>
            
            {doc.file && (
              <a 
                href={doc.file} 
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors shrink-0 ml-2"
                title="Download File"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqDocumentList;
