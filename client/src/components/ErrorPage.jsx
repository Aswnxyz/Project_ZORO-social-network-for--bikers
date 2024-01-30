import React from 'react'

const ErrorPage = () => {
  return (
    <div className="text-gray-300 text-center  font-semibold mt-16 space-y-6">
      <h1 className="text-2xl">Sorry, this page isn't available.</h1>
      <p>
        The link you followed may be broken, or the page may have been removed.
        Go back to Zoro.
      </p>
    </div>
  );
}

export default ErrorPage