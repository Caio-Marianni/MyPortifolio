"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { ToggleButtons } from "@/components/toggle-buttons";

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white relative overflow-hidden transition-colors duration-300">
      <ToggleButtons />

      <div className="text-center px-10">
        <h1 className="text-[120px] md:text-[150px] font-bold mb-4 text-red-500">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Página não encontrada</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          A página que você está procurando não existe ou foi removida.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Voltar ao início
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </div>
    </main>
  );
}
