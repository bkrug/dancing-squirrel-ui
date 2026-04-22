import "./CustomerSignup.css";
import TrainingRequestForm from "./TrainingRequest/TrainingRequestForm";
import { useState, useCallback } from "react";

export default function CustomerSignup() {
  let [isComplete, setComplete] = useState(false);
  const onCompletion = useCallback(() => setComplete(true), []);

  return (
    <div className="customer-signup">
      <div>
        {!isComplete
          ? <TrainingRequestForm onSuccess={onCompletion} />
          : (<><h1>Successful Submission</h1>Our representative will reach out to you.</>)
        }
      </div>
    </div>
  );
}
