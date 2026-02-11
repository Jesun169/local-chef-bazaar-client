import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="text-center max-w-md space-y-4">
        <h1 className="text-5xl font-bold text-error">Oops!</h1>
        <p className="text-lg">
          Something went wrong. Please try again later.
        </p>

        {error && (
          <p className="text-sm text-gray-500">
            {error.statusText || error.message}
          </p>
        )}

        <a href="/" className="btn btn-primary mt-4">
          Go Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
