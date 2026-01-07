import React from "react";

// 1. Full Page Loader - Use for initial app load or page transitions
export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          CRMaster
        </h2>
        <p className="text-sm text-gray-500">Loading your dashboard...</p>
      </div>
    </div>
  );
};

// 2. Table Skeleton - Use when loading data tables
export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="border-b border-gray-100 px-6 py-4 flex gap-4"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// 3. Card Skeleton - Use for dashboard cards or grid items
export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-32 bg-gray-300 rounded animate-pulse mb-2"></div>
          <div className="h-3 w-20 bg-gray-100 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

// 4. Form Skeleton - Use when loading forms
export const FormSkeleton = ({ fields = 4 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="h-7 w-48 bg-gray-300 rounded animate-pulse mb-6"></div>

      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
        </div>
      ))}

      <div className="flex gap-3 pt-4">
        <div className="h-10 w-24 bg-blue-200 rounded animate-pulse"></div>
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

// 5. Spinner Button - Use for button loading states
export const SpinnerButton = ({ children, isLoading, ...props }) => {
  return (
    <button
      disabled={isLoading}
      className="relative bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
      <span className={isLoading ? "invisible" : ""}>{children}</span>
    </button>
  );
};

// 6. Inline Loader - Use for small loading indicators
export const InlineLoader = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <svg
        className="animate-spin h-4 w-4 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="text-sm">{text}</span>
    </div>
  );
};

// 7. Content Loader - Use for content areas
export const ContentLoader = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
      <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
      <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
      <div className="h-4 w-4/6 bg-gray-100 rounded animate-pulse"></div>
      <div className="mt-6 space-y-3">
        <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
        <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

// Demo Component showing all loaders
const LoadingComponentsDemo = () => {
  const [showFullPage, setShowFullPage] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);

  const handleButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            CRM Loading Components
          </h1>
          <p className="text-gray-600">
            A complete set of loading states for your CRM application
          </p>
        </div>

        {/* Full Page Loader Demo */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            1. Full Page Loader
          </h2>
          <p className="text-gray-600 mb-4">
            Use for initial app load or major page transitions
          </p>
          <button
            onClick={() => setShowFullPage(!showFullPage)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showFullPage ? "Hide" : "Show"} Full Page Loader
          </button>
          {showFullPage && <FullPageLoader />}
        </section>

        {/* Table Skeleton */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            2. Table Skeleton
          </h2>
          <p className="text-gray-600 mb-4">
            Use when loading data tables (leads, staff, etc.)
          </p>
          <TableSkeleton rows={5} columns={5} />
        </section>

        {/* Card Skeleton */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            3. Card Skeleton
          </h2>
          <p className="text-gray-600 mb-4">
            Use for dashboard cards or grid layouts
          </p>
          <CardSkeleton count={3} />
        </section>

        {/* Form Skeleton */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            4. Form Skeleton
          </h2>
          <p className="text-gray-600 mb-4">Use when loading forms</p>
          <div className="max-w-2xl">
            <FormSkeleton fields={4} />
          </div>
        </section>

        {/* Spinner Button */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            5. Spinner Button
          </h2>
          <p className="text-gray-600 mb-4">Use for button loading states</p>
          <SpinnerButton isLoading={buttonLoading} onClick={handleButtonClick}>
            {buttonLoading ? "Processing..." : "Click Me"}
          </SpinnerButton>
        </section>

        {/* Inline Loader */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            6. Inline Loader
          </h2>
          <p className="text-gray-600 mb-4">Use for small loading indicators</p>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 inline-block">
            <InlineLoader text="Fetching data..." />
          </div>
        </section>

        {/* Content Loader */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            7. Content Loader
          </h2>
          <p className="text-gray-600 mb-4">Use for loading content areas</p>
          <div className="max-w-2xl">
            <ContentLoader />
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-12">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Usage Instructions
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Import:</strong> Copy the components you need into your
              project
            </p>
            <p>
              <strong>FullPageLoader:</strong>{" "}
              {`{isLoading && <FullPageLoader />}`}
            </p>
            <p>
              <strong>TableSkeleton:</strong>{" "}
              {`{isLoading ? <TableSkeleton /> : <YourTable />}`}
            </p>
            <p>
              <strong>CardSkeleton:</strong>{" "}
              {`{isLoading ? <CardSkeleton count={4} /> : <YourCards />}`}
            </p>
            <p>
              <strong>FormSkeleton:</strong>{" "}
              {`{isLoading ? <FormSkeleton fields={6} /> : <YourForm />}`}
            </p>
            <p>
              <strong>SpinnerButton:</strong>{" "}
              {`<SpinnerButton isLoading={loading}>Submit</SpinnerButton>`}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoadingComponentsDemo;
