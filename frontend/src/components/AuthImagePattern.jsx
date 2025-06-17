import React from 'react'

function AuthImagePattern({title,subtitle}) {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
            {[...Array(9)].map((_,i)=>(
                <div
                key={i}
                className={`aspect-square rounded-2xl bg-[rgba(59,130,246,0.1)] ${i%2==0 ? "animate-pulse":""}`}
                />
            ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-based-content/60">{subtitle}</p>
      </div>
    </div>
  )
}

export default AuthImagePattern
