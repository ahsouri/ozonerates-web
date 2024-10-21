import { useState } from "react";

// Define CSS classes for styling the button
const baseClasses =
  "group inline-flex items-center justify-center gap-x-2 rounded-lg px-4 py-3 text-sm font-bold text-neutral-50 ring-zinc-500 transition duration-300 focus-visible:ring outline-none";
const borderClasses = "border border-transparent";
const bgColorClasses ="bg-fuchsia-800 hover:bg-fuchsia-900 active:bg-fuchsia-900 dark:focus:outline-none";
const disableClasses = "disabled:pointer-events-none disabled:opacity-50";
const fontSizeClasses = "2xl:text-base";
const ringClasses = "dark:ring-zinc-200";

// React button component
const CustomButton = ({ title, onClick, disabled }) => {
  return (
    <button
      type="submit"
      className={`${baseClasses} ${borderClasses} ${bgColorClasses} ${fontSizeClasses} ${disableClasses} ${ringClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

const EmailFooterInput = () => {
  const [result, setResult] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Add predefined message instead of user input
    const predefinedMessage = "This person wants to be added to the subscription list.";
    formData.set("message", predefinedMessage);

    const json = JSON.stringify(Object.fromEntries(formData));
    setResult("Sending...");

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    })
      .then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
          setResult(json.message);
        } else {
          setResult(json.message);
        }
      })
      .catch((error) => {
        console.error(error);
        setResult("Something went wrong!");
      })
      .finally(() => {
        form.reset();
        setTimeout(() => {
          setResult("");
        }, 5000);
      });
  };

  return (
    <form id="form" className="needs-validation" onSubmit={handleSubmit}>
      <input type="hidden" name="access_key" value="22f19e9f-e1bc-4b2d-a363-7bf2a46a9c9b" />
      <input type="checkbox" className="hidden" style={{ display: "none" }} name="botcheck" />
      <div className="mb-5">
        <input type="email" placeholder="Email Address" name="email" required className="form-input" />
      </div>
      <div>
      <CustomButton title="Subscribe"></CustomButton> 
      </div>
      <div id="result" className="result">{result}</div>
    </form>
  );
};

export default EmailFooterInput;
