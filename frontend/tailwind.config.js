/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Aqui estendemos o tema do Tailwind
      fontFamily: {
        // Definimos 'Inter' como a fonte padrão para texto sans-serif
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Definimos nossa paleta de cores customizada
        'background': '#F1F5F9', // bg-slate-100
        'surface': '#FFFFFF',    // bg-white (para os cards)
        'sidebar': '#0F172A',    // bg-slate-900
        
        'primary': '#2563EB',    // text-blue-600 (para botões e destaques)
        'secondary': '#64748B',  // text-slate-500 (para textos secundários)
        
        'text-main': '#1E293B',    // text-slate-800
        'text-light': '#94A3B8',  // text-slate-400 (na sidebar)
        
        'success': '#22C55E',    // green-500
        'danger': '#EF4444',     // red-500
        'warning': '#F97316',    // orange-500
      }
    },
  },
  plugins: [],
}