'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation';
import { HiMenuAlt3 } from "react-icons/hi";

const Navbar: React.FC = () => {
 const { data: session } = useSession();
 const router = useRouter();
 const pathname = usePathname();
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const menuRef = useRef<HTMLDivElement>(null);

 const handleSignOut = async () => {
   await signOut({ redirect: false });
   router.push('/');
 };

 const isAdmin = session?.user?.role === 'ADMIN';

 const navItems = [
   { href: '/', label: 'Home' },
   ...(isAdmin ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
 ];

 useEffect(() => {
   const handleClickOutside = (event: MouseEvent) => {
     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
       setIsMenuOpen(false);
     }
   };

   document.addEventListener('mousedown', handleClickOutside);
   return () => {
     document.removeEventListener('mousedown', handleClickOutside);
   };
 }, []);

 const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
 const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

 return (
   <nav className="bg-white bg-opacity-95 backdrop-blur-md shadow-sm fixed w-full z-10">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex justify-between h-16">
         <div className="flex items-center">
           <Link href="/" className="flex-shrink-0">
             <Image src="/power.png" alt="Logo" width={60} height={60} />
           </Link>
           <div className="hidden md:ml-6 md:flex md:space-x-8">
             {navItems.map((item) => (
               <Link
                 key={item.href}
                 href={item.href}
                 className={`${
                   pathname === item.href
                     ? "text-gray-900 border-b-2 border-gray-900"
                     : "text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300"
                 } inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ease-in-out`}
               >
                 {item.label}
               </Link>
             ))}
           </div>
         </div>
         <div className="flex items-center">
           {session ? (
             <div className="relative ml-3 hidden md:block" ref={menuRef}>
               <button
                 onClick={toggleMenu}
                 className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
               >
                 <img
                   className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                   src={session.user?.image || "/default-avatar.png"}
                   alt="User Avatar"
                 />
               </button>
               {isMenuOpen && (
                 <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                   <button
                     onClick={() => {
                       setIsMenuOpen(false);
                       handleSignOut();
                     }}
                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                   >
                     Logout
                   </button>
                 </div>
               )}
             </div>
           ) : (
             <div className="flex items-center hidden md:flex">
               <Link href="/auth/form_signup" className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-700 mr-4">
                 Sign Up
               </Link>
               <Link href="/auth/signin" className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700">
                 Sign In
               </Link>
             </div>
           )}
         </div>
         <div className="-mr-2 flex items-center md:hidden">
           <button
             onClick={toggleMobileMenu}
             type="button"
             className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
             aria-expanded="false"
           >
             <span className="sr-only">Open main menu</span>
             <HiMenuAlt3 className="h-6 w-6" />
           </button>
         </div>
       </div>
     </div>

     {isMobileMenuOpen && (
       <div className="md:hidden">
         <div className="pt-2 pb-3 space-y-1">
           {navItems.map((item) => (
             <Link
               key={item.href}
               href={item.href}
               className={`${
                 pathname === item.href
                   ? "bg-gray-50 text-gray-900"
                   : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
               } block pl-3 pr-4 py-2 text-base font-medium`}
               onClick={() => setIsMobileMenuOpen(false)}
             >
               {item.label}
             </Link>
           ))}
           {!session && (
             <>
               <Link
                 href="/auth/form_signup"
                 className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                 onClick={() => setIsMobileMenuOpen(false)}
               >
                 Sign Up
               </Link>
               <Link
                 href="/auth/signin"
                 className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                 onClick={() => setIsMobileMenuOpen(false)}
               >
                 Sign In
               </Link>
             </>
           )}
         </div>
         {session && (
           <div className="pt-4 pb-3 border-t border-gray-200">
             <div className="flex items-center px-4">
               <div className="flex-shrink-0">
                 <img
                   className="h-10 w-10 rounded-full"
                   src={session.user?.image || "/default-avatar.png"}
                   alt="User Avatar"
                 />
               </div>
               <div className="ml-3">
                 <div className="text-base font-medium text-gray-800">
                   {session.user?.firstName}
                 </div>
                 <div className="text-sm font-medium text-gray-500">
                   {session.user?.email}
                 </div>
               </div>
             </div>
             <div className="mt-3 space-y-1">
               <button
                 onClick={() => {
                   setIsMobileMenuOpen(false);
                   handleSignOut();
                 }}
                 className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
               >
                 Logout
               </button>
             </div>
           </div>
         )}
       </div>
     )}
   </nav>
 );
};

export default Navbar;