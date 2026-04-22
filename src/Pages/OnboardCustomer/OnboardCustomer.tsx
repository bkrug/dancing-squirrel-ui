import { useParams } from "react-router";

export default function OnboardCustomer() {
  let { trainingRequestId } = useParams();
  return (
    <h1>{trainingRequestId}</h1>
  );
}