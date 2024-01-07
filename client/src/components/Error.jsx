import { useRouteError } from "react-router-dom";

const Error = () => {
  const { status, statusText } = useRouteError();
  return (
    <div className="error-page">
      <h1>Oops...!</h1>
      <h2>Something went wrong ......</h2>
      <h2>{status + " : " + statusText}</h2>
    </div>
  );
};

export default Error;
