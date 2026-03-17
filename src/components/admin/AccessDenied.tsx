"use client";

import React, { useEffect } from 'react';
import { ShieldX, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from '@/constants/permissions';
import toast from 'react-hot-toast';

interface AccessDeniedProps {
  userRole?: string;
  requiredRoles?: string[];
  pageName?: string;
}

export default function AccessDenied({ userRole, requiredRoles, pageName }: AccessDeniedProps) {
  const roleLabel = userRole ? ROLE_LABELS[userRole] || userRole : 'غير محدد';
  const roleDescription = userRole ? ROLE_DESCRIPTIONS[userRole] : '';

  const requiredRoleLabels = requiredRoles
    ?.map(r => ROLE_LABELS[r] || r)
    .join(' أو ');

  useEffect(() => {
    toast.error(`غير مصرح لك بالوصول لهذه الصفحة`, {
      duration: 4000,
      icon: '🚫',
    });
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 max-w-md w-full text-center">
        {/* أيقونة */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX size={40} className="text-red-500" />
        </div>

        {/* العنوان */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          غير مصرح لك بالوصول
        </h2>

        {/* رسالة توضيحية */}
        <p className="text-gray-500 mb-6">
          {pageName ? `صفحة "${pageName}" ` : 'هذه الصفحة '}
          غير متاحة لصلاحياتك الحالية
        </p>

        {/* معلومات الدور */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-right">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">دورك الحالي:</span>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              {roleLabel}
            </span>
          </div>
          {roleDescription && (
            <p className="text-xs text-gray-400 mt-2">{roleDescription}</p>
          )}
          {requiredRoleLabels && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                الصلاحيات المطلوبة: <strong className="text-gray-700">{requiredRoleLabels}</strong>
              </span>
            </div>
          )}
        </div>

        {/* زر الرجوع */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
        >
          <ArrowRight size={18} />
          العودة للوحة التحكم
        </Link>
      </div>
    </div>
  );
}
